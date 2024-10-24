const IotData = require('../models/iotData');
const DifferenceData = require('../models/differeneceData');
const moment = require('moment');
const cron = require('node-cron');
const { Parser } = require('json2csv'); // For CSV export
const pdf = require('pdfkit'); // For PDF export
const fs = require('fs'); // File system for saving PDFs
const { timeStamp } = require('console');

// Helper function to get initial and last entries
const getInitialAndLastEntries = async (userName, stackName, startTime, endTime) => {
    console.log(`Fetching data for user: ${userName}, stack: ${stackName}, between ${startTime} and ${endTime}`);
    const data = await IotData.find({
        userName,
        'stackData.stackName': stackName,
        timestamp: { $gte: startTime, $lte: endTime }
    }).sort({ timestamp: 1 });

    if (!data.length) {
        console.log(`No data found for ${userName} - ${stackName}`);
        return null;
    }

    console.log(`Data fetched for ${userName} - ${stackName}:`, data);
    return { initialEntry: data[0], lastEntry: data[data.length - 1] };
};

// Function to extract values from a given entry
const extractValues = (entry, stackName) => {
    const stack = entry.stackData.find(stack => stack.stackName === stackName) || {};
    const timestamp = moment(entry.timestamp);
    
    return {
        energy: stack.energy || 0,
        inflow: stack.inflow || 0,
        finalflow: stack.finalflow || 0, 
        date: timestamp.format('YYYY-MM-DD'),
        time: timestamp.format('HH:mm:ss'),
        day: timestamp.format('dddd'), // Get day of the week
    };
};

const calculateAndSaveDifferences = async (
    userName, companyName, stackName, stationType, interval, startTime, endTime
) => {
    const entries = await getInitialAndLastEntries(userName, stackName, startTime, endTime);
    if (!entries) {
        console.log(`No entries found for ${userName} - ${stackName}`);
        return;
    }

    const { initialEntry, lastEntry } = entries;

    console.log(`Calculating differences for ${userName} - ${stackName}`);
    const initialValues = extractValues(initialEntry, stackName);
    const lastValues = extractValues(lastEntry, stackName);

    const differenceData = new DifferenceData({
        userName,
        companyName,
        stackName,
        stationType,
        interval,
        initialEnergy: initialValues.energy,
        lastEnergy: lastValues.energy,
        energyDifference: lastValues.energy - initialValues.energy,
        initialInflow: initialValues.inflow,
        lastInflow: lastValues.inflow,
        inflowDifference: lastValues.inflow - initialValues.inflow,
        initialFinalFlow: initialValues.finalflow,
        lastFinalFlow: lastValues.finalflow,
        finalFlowDifference: lastValues.finalflow - initialValues.finalflow,
        date: lastValues.date,
        time: lastValues.time,
        day: lastValues.day,
        timestamp: new Date(), // Use current timestamp
    });

    try {
        await differenceData.save();
        console.log(`Saved difference data for ${userName} - ${stackName}`);
    } catch (error) {
        console.error('Error saving difference data:', error);
    }
};

// Process differences for a given interval
const processDifferences = async (interval, startTime, endTime) => {
    console.log(`Processing differences for interval: ${interval}`);

    const users = await IotData.find({
        'stackData.stationType': { $in: ['energy', 'effluent_flow'] }
    }).distinct('userName');

    for (const userName of users) {
        const stacks = await IotData.find({ userName }).distinct('stackData.stackName');

        for (const stackName of stacks) {
            const stackRecord = await IotData.findOne({
                userName,
                'stackData.stackName': stackName
            }).select('companyName stationType');

            if (!stackRecord) {
                console.log(`No data found for ${userName} - ${stackName}`);
                continue;
            }

            const { companyName, stationType } = stackRecord;
            console.log(`User: ${userName}, Stack: ${stackName}, Company: ${companyName}`);

            await calculateAndSaveDifferences(
                userName,
                companyName,
                stackName,
                stationType,
                interval,
                startTime,
                endTime
            );
        }
    }
};


// Calculate hourly difference
const calculateHourlyDifference = async () => {
    const now = moment().startOf('hour').toDate(); // Start of current hour
    const startTime = moment(now).subtract(1, 'hour').toDate(); // 1 hour before

    console.log(`Hourly Difference Calculation - Start: ${startTime}, End: ${now}`);
    await processDifferences('hourly', startTime, now);
};

// Calculate daily difference
const calculateDailyDifference = async () => {
    const now = moment().startOf('day').toDate(); // Start of current day
    const startTime = moment(now).subtract(1, 'day').toDate(); // 1 day before

    console.log(`Daily Difference Calculation - Start: ${startTime}, End: ${now}`);
    await processDifferences('daily', startTime, now);
};

// Schedule hourly and daily difference calculations
cron.schedule('0 * * * *', async () => {
 console.log('Running hourly difference calculation...');
    await calculateHourlyDifference();
});

cron.schedule('0 0 * * *', async () => {
    console.log('Running daily difference calculation...');
    await calculateDailyDifference();
});



// Controller to fetch difference data by userName and interval
const getDifferenceDataByUserNameAndInterval = async (userName, interval) => {
    try {
        if (!['daily', 'hourly'].includes(interval)) {
            throw new Error('Invalid interval. Use "daily" or "hourly".');
        }

        const data = await DifferenceData.find({ userName, interval }).lean();
        return data;
    } catch (error) {
        console.error('Error fetching difference data:', error);
        throw error;
    }
};

// Controller to fetch both hourly and daily difference data by userName
const getAllDifferenceDataByUserName = async (userName) => {
    try {
        const data = await DifferenceData.find({ userName }).lean();

        if (!data.length) {
            return { daily: [], hourly: [] }; // Return empty arrays if no data found
        }

        const dailyData = data.filter((item) => item.interval === 'daily');
        const hourlyData = data.filter((item) => item.interval === 'hourly');

        return { daily: dailyData, hourly: hourlyData };
    } catch (error) {
        console.error('Error fetching all difference data:', error);
        throw error;
    }
};

// Function to fetch data by userName, interval, and time range
const getDifferenceDataByTimeRange = async (userName, interval, fromDate, toDate) => {
    try {
        if (!['daily', 'hourly'].includes(interval)) {
            throw new Error('Invalid interval. Use "daily" or "hourly".');
        }

        const data = await DifferenceData.find({
            userName,
            interval,
            timestamp: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }).lean();

        return data;
    } catch (error) {
        console.error('Error fetching data by time range:', error);
        throw error;
    }
};


// Function to download data as CSV
const downloadDifferenceDataAsCSV = async (userName, interval, fromDate, toDate, res) => {
    try {
        const data = await getDifferenceDataByTimeRange(userName, interval, fromDate, toDate);
        if (!data.length) {
            return res.status(404).json({ success: false, message: 'No data found for the given time range' });
        }

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${userName}_${interval}_data.csv`);
        res.status(200).end(csv);
    } catch (error) {
        console.error('Error downloading CSV:', error);
        res.status(500).json({ success: false, message: 'Failed to download CSV' });
    }
};

// Function to download data as PDF
const downloadDifferenceDataAsPDF = async (userName, interval, fromDate, toDate, res) => {
    try {
        const data = await getDifferenceDataByTimeRange(userName, interval, fromDate, toDate);
        if (!data.length) {
            return res.status(404).json({ success: false, message: 'No data found for the given time range' });
        }

        const doc = new pdf();
        const filename = `${userName}_${interval}_data.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        doc.pipe(res);
        doc.fontSize(16).text(`Difference Data Report for ${userName}`, { align: 'center' });
        doc.moveDown();

        data.forEach((item, index) => {
            doc.fontSize(12).text(`Entry ${index + 1}:`);
            doc.text(`Stack Name: ${item.stackName}`);
            doc.text(`Initial Energy: ${item.initialEnergy}`);
            doc.text(`Last Energy: ${item.lastEnergy}`);
            doc.text(`Energy Difference: ${item.energyDifference}`);
            doc.text(`Date: ${item.date}`);
            doc.text(`Time: ${item.time}`);
            doc.text(`--------------------------------------`);
        });

        doc.end();
    } catch (error) {
        console.error('Error downloading PDF:', error);
        res.status(500).json({ success: false, message: 'Failed to download PDF' });
    }
};

module.exports = {
    getDifferenceDataByUserNameAndInterval,
    getAllDifferenceDataByUserName,
    getDifferenceDataByTimeRange,
    downloadDifferenceDataAsCSV,
    downloadDifferenceDataAsPDF
};


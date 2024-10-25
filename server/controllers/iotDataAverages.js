const IotData = require('../models/iotData');
const IotDataAverage = require('../models/averageData');
const moment = require('moment-timezone');
const cron = require('node-cron');

// Function to calculate averages dynamically
// Function to calculate averages dynamically
const calculateAverages = async (userName, product_id, startTime, endTime, interval, intervalType) => {
    console.log(`Calculating averages for ${userName} - ${intervalType}: ${startTime} to ${endTime}`);

    // Check if an entry already exists for this user, interval, and intervalType
    const existingRecord = await IotDataAverage.findOne({
        userName,
        product_id,
        interval,
        intervalType,
        dateAndTime: moment().format('DD/MM/YYYY HH:mm'),
    });

    if (existingRecord) {
        console.log(`Average entry already exists for ${userName} - ${intervalType}. Skipping save operation.`);
        return; // Prevent duplicate save
    }

    // Aggregation query to fetch data
    const data = await IotData.aggregate([
        {
            $match: {
                userName,
                product_id,
                timestamp: { $gte: new Date(startTime), $lt: new Date(endTime) },
            },
        },
        { $unwind: '$stackData' },
        {
            $match: {
                'stackData.stackName': { $exists: true, $ne: null },
            },
        },
    ]);

    console.log(`Extracted ${data.length} entries for ${userName} - ${intervalType}`);
    if (data.length === 0) return;

    // Grouping and calculating averages
    const stackGroups = data.reduce((acc, entry) => {
        const { stackName, stationType, ...parameters } = entry.stackData;
        if (!acc[stackName]) acc[stackName] = { stationType, parameters: {} };

        Object.entries(parameters).forEach(([key, value]) => {
            acc[stackName].parameters[key] = acc[stackName].parameters[key] || [];
            acc[stackName].parameters[key].push(parseFloat(value || 0));
        });

        return acc;
    }, {});

    const stackData = Object.entries(stackGroups).map(([stackName, { stationType, parameters }]) => {
        const averagedParameters = Object.entries(parameters).reduce((acc, [key, values]) => {
            const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
            acc[key] = parseFloat(avg.toFixed(2));
            return acc;
        }, {});

        return {
            stackName,
            stationType,
            parameters: averagedParameters,
        };
    });

    console.log(`Averages for ${userName}:`, stackData);

    // Prepare and save the new average entry
    const averageEntry = new IotDataAverage({
        userName,
        product_id,
        interval,
        intervalType, // Save the interval type
        dateAndTime: moment().format('DD/MM/YYYY HH:mm'),
        timestamp: new Date(),
        stackData,
    });

    try {
        await averageEntry.save();
        console.log(`Average entry saved for ${userName} - ${intervalType}`);
    } catch (error) {
        console.error(`Error saving average entry for ${userName} - ${intervalType}:`, error);
    }
};


// Schedule calculations for all intervals
const scheduleAveragesCalculation = () => {
    const intervals = [
        { cronTime: '0 * * * *', interval: 'hour', duration: 60 * 60 * 1000 }, // Every hour
        { cronTime: '0 0 * * *', interval: 'day', duration: 24 * 60 * 60 * 1000 }, // Every day
        { cronTime: '0 0 * * 1', interval: 'week', duration: 7 * 24 * 60 * 60 * 1000 }, // Every week (Monday)
        { cronTime: '0 0 1 * *', interval: 'month', duration: 30 * 24 * 60 * 60 * 1000 }, // Every month
        { cronTime: '0 0 1 */6 *', interval: 'sixmonths', duration: 6 * 30 * 24 * 60 * 60 * 1000 }, // Every 6 months
        { cronTime: '0 0 1 1 *', interval: 'year', duration: 365 * 24 * 60 * 60 * 1000 }, // Every year
    ];
    
    // const intervals = [
    //     { cronTime: '*/1 * * * *', interval: 'minute', duration: 60 * 1000 }, // Every minute
    //     { cronTime: '*/2 * * * *', interval: 'twoMinutes', duration: 2 * 60 * 1000 }, // Every 2 minutes
    // ];

    intervals.forEach(({ cronTime, interval, duration }) => {
        cron.schedule(cronTime, async () => {
            console.log(`Running ${interval} average calculation...`);
            const users = await IotData.distinct('userName');
            for (const userName of users) {
                const productIds = await IotData.distinct('product_id', { userName });
                for (const product_id of productIds) {
                    const stackNames = await IotData.aggregate([
                        { $match: { userName, product_id } },
                        { $unwind: '$stackData' },
                        { $group: { _id: '$stackData.stackName' } },
                    ]).then(result => result.map(item => item._id));

                    const now = new Date();
                    const startTime = new Date(now.getTime() - duration);
                    const endTime = now;

                    for (const stackName of stackNames) {
                        await calculateAverages(userName, product_id, stackName, startTime, endTime, interval);
                    }
                }
            }
        });
    });
};
//scheduleAveragesCalculation();

// Controller function to fetch all average data
const getAllAverageData = async (req, res) => {
    try {
        const data = await IotDataAverage.find(); // Fetch all data from the collection

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No average data found.' });
        }

        res.status(200).json(data); // Return all data in the response
    } catch (error) {
        console.error('Error fetching all average data:', error);
        res.status(500).json({ message: 'Error fetching average data.', error });
    }
};



const findAverageDataUsingUserName = async (req, res) => {
    const { userName } = req.params;

    try {
        const data = await IotDataAverage.find({ userName });
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No average data found for this user.' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching data for user ${userName}:`, error);
        res.status(500).json({ message: 'Error fetching average data.', error });
    }
};

const findAverageDataUsingUserNameAndStackName = async (req, res) => {
    const { userName, stackName } = req.params;

    try {
        const data = await IotDataAverage.find({
            userName,
            'stackData.stackName': stackName,
        });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No average data found for this user and stack name.' });
        }

        // Filter only the matching stackName data
        const filteredData = data.map(entry => ({
            ...entry._doc, // Spread the entry to avoid mutation
            stackData: entry.stackData.filter(stack => stack.stackName === stackName),
        }));

        res.status(200).json(filteredData);
    } catch (error) {
        console.error(`Error fetching data for user ${userName} and stack ${stackName}:`, error);
        res.status(500).json({ message: 'Error fetching average data.', error });
    }
};
const findAverageDataUsingUserNameAndStackNameAndIntervalType = async (req, res) => {
    const { userName, stackName, intervalType } = req.params;

    try {
        const data = await IotDataAverage.find({
            userName,
            intervalType,
            'stackData.stackName': stackName,
        });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No average data found for this user, stack name, and interval type.' });
        }

        // Filter only the matching stackName data
        const filteredData = data.map(entry => ({
            ...entry._doc, // Spread the entry to avoid mutation
            stackData: entry.stackData.filter(stack => stack.stackName === stackName),
        }));

        res.status(200).json(filteredData);
    } catch (error) {
        console.error(`Error fetching data for user ${userName}, stack ${stackName}, and interval type ${intervalType}:`, error);
        res.status(500).json({ message: 'Error fetching average data.', error });
    }
};

module.exports = { calculateAverages, scheduleAveragesCalculation,findAverageDataUsingUserName,
    findAverageDataUsingUserNameAndStackName,getAllAverageData,findAverageDataUsingUserNameAndStackNameAndIntervalType };

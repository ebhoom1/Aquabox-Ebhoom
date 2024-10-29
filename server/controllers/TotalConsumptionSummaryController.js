const ConsumptionData = require('../models/ConsumptionData');
const TotalConsumptionSummary = require('../models/TotalConsumptionSummary');
const moment = require('moment-timezone');
const cron = require('node-cron');

// Helper function to get start and end time
const getStartAndEndTime = (intervalType) => {
    const endTime = moment().utc();
    const startTime = {
        'hourly': endTime.clone().subtract(1, 'hour'),
        'daily': endTime.clone().subtract(1, 'day'),
        'monthly': endTime.clone().subtract(1, 'month')
    }[intervalType];

    if (!startTime) throw new Error(`Unsupported interval type: ${intervalType}`);
    return { startTime: startTime.toDate(), endTime: endTime.toDate() };
};

// Function to calculate total consumption summary from all stack data
const calculateTotalConsumptionSummary = async (userName, product_id, startTime, endTime, intervalType) => {
    try {
        const data = await ConsumptionData.find({
            userName,
            product_id,
            timestamp: { $gte: startTime, $lt: endTime },
        });

        if (!data || data.length === 0) {
            console.log(`No consumption data found for ${userName} - ${intervalType}`);
            return;
        }

        let totalEnergy = 0;
        let totalInflow = 0;
        let totalFinalflow = 0;

        // Iterate over each entry and aggregate values from all stacks
        data.forEach(entry => {
            entry.totalConsumptionData.forEach(stack => {
                if (stack.stationType === 'energy') {
                    totalEnergy += stack.energy || 0;
                }
                if (stack.stationType === 'effluent_flow') {
                    totalInflow += stack.inflow || 0;
                    totalFinalflow += stack.finalflow || 0;
                }
            });
        });

        const userRecord = await ConsumptionData.findOne(
            { userName, product_id },
            { companyName: 1, email: 1, mobileNumber: 1 }
        );

        if (!userRecord) {
            console.error(`No user record found for ${userName}`);
            return;
        }

        const intervalIST = moment()
            .tz('Asia/Kolkata')
            .format('ddd MMM DD YYYY HH:mm:ss [GMT+0530] (India Standard Time)');

        const summaryEntry = new TotalConsumptionSummary({
            userName,
            product_id,
            companyName: userRecord.companyName,
            email: userRecord.email,
            mobileNumber: userRecord.mobileNumber,
            interval: intervalIST,
            intervalType,
            totalEnergy,
            totalInflow,
            totalFinalflow,
        });

        await summaryEntry.save();
        console.log(`Saved total consumption summary for ${userName} - ${intervalType}`);
    } catch (error) {
        console.error(`Error in calculating total consumption summary: ${error.message}`);
    }
};

// Function to run total consumption summary calculation for all users and products
const runTotalConsumptionSummaryCalculation = async (intervalType) => {
    try {
        const users = await ConsumptionData.distinct('userName');
        console.log(`Users found: ${users}`);

        for (const userName of users) {
            const productIds = await ConsumptionData.distinct('product_id', { userName });
            console.log(`Product IDs for ${userName}: ${productIds}`);

            for (const product_id of productIds) {
                const { startTime, endTime } = getStartAndEndTime(intervalType);
                console.log(`Calculating total summary for ${userName}, product_id: ${product_id}, interval: ${intervalType}`);

                await calculateTotalConsumptionSummary(userName, product_id, startTime, endTime, intervalType);
            }
        }
    } catch (error) {
        console.error(`Error in running ${intervalType} total consumption summary calculation:`, error);
    }
};

// Schedule total consumption summary calculations for different intervals
const scheduleTotalConsumptionSummaryCalculation = () => {
    const intervals = [
        { cronTime: '*/15 * * * *', intervalType: '15Minutes' },
        { cronTime: '*/30 * * * *', intervalType: '30Minutes' },
        { cronTime: '0 * * * *', intervalType: 'hourly' },
        { cronTime: '0 0 * * *', intervalType: 'daily' },
        { cronTime: '0 0 1 * *', intervalType: 'monthly' }
    ];

    intervals.forEach(({ cronTime, intervalType }) => {
        cron.schedule(cronTime, async () => {
            console.log(`Running ${intervalType} total consumption summary calculation...`);
            await runTotalConsumptionSummaryCalculation(intervalType);
        });
    });
};

// Get all total consumption summaries
const getAllSummary = async (req, res) => {
    try {
        const data = await TotalConsumptionSummary.find();
        if (!data.length) {
            return res.status(404).json({ message: 'No summary data available.' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching all summary data:', error);
        res.status(500).json({ message: 'Internal server error.', error });
    }
};

// Get total consumption summary by userName
const getSummaryByUserName = async (req, res) => {
    const { userName } = req.params;
    try {
        const data = await TotalConsumptionSummary.find({ userName });
        if (!data.length) {
            return res.status(404).json({ message: `No summary data found for user ${userName}.` });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching summary data for user ${userName}:`, error);
        res.status(500).json({ message: 'Internal server error.', error });
    }
};



// Get total consumption summary by userName and intervalType
const getSummaryByUserNameAndInterval = async (req, res) => {
    const { userName, intervalType } = req.params;

    try {
        const data = await TotalConsumptionSummary.find({
            userName,
            intervalType,
        });

        if (!data.length) {
            return res.status(404).json({
                message: 'No summary data found for the specified user and interval type.',
            });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(
            `Error fetching summary data for user ${userName} and interval type ${intervalType}:`,
            error
        );
        res.status(500).json({ message: 'Internal server error.', error });
    }
};

module.exports = { 
    scheduleTotalConsumptionSummaryCalculation, 
    calculateTotalConsumptionSummary, 
    getAllSummary,
    getSummaryByUserName,
    getSummaryByUserNameAndInterval,
};

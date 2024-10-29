const PredictionData = require('../models/PredictionData');
const TotalPredictionSummary = require('../models/TotalPredictionSummary');
const moment = require('moment-timezone');
const cron = require('node-cron');

// Helper function to get start and end time
const getStartAndEndTime = (intervalType) => {
    const endTime = moment().utc();
    const startTime = {
        'hourly': endTime.clone().subtract(1, 'hour'),
        'daily': endTime.clone().subtract(1, 'day'),
        'monthly': endTime.clone().subtract(1, 'month'),
    }[intervalType];

    console.log(`Start Time: ${startTime}, End Time: ${endTime}`); // Debugging log
    if (!startTime) throw new Error(`Unsupported interval type: ${intervalType}`);
    return { startTime: startTime.toDate(), endTime: endTime.toDate() };
};

// Calculate prediction summary
const calculateTotalPredictionSummary = async (userName, product_id, startTime, endTime, intervalType) => {
    try {
        console.log(`Fetching prediction data for ${userName}, product: ${product_id}, interval: ${intervalType}`);
        const predictions = await PredictionData.find({
            userName,
            product_id,
            timestamp: { $gte: startTime, $lt: endTime },
        });

        console.log(`Fetched Predictions: ${JSON.stringify(predictions)}`); // Debugging log

        if (!predictions || predictions.length === 0) {
            console.log(`No prediction data found for ${userName} - ${intervalType}`);
            return;
        }

        let predictedEnergy = 0;
        let predictedInflow = 0;
        let predictedFinalflow = 0;

        // Aggregate the prediction data
        predictions.forEach(entry => {
            entry.predictionData.forEach(stack => {
                predictedEnergy += stack.predictedEnergy || 0;
                predictedInflow += stack.predictedInflow || 0;
                predictedFinalflow += stack.predictedFinalflow || 0;
            });
        });

        const userRecord = predictions[0]; // Use first matching record for user details

        const intervalIST = moment().tz('Asia/Kolkata').format('ddd MMM DD YYYY HH:mm:ss [GMT+0530]');

        const summaryEntry = new TotalPredictionSummary({
            userName: userRecord.userName,
            product_id: userRecord.product_id,
            companyName: userRecord.companyName,
            email: userRecord.email,
            mobileNumber: userRecord.mobileNumber,
            interval: intervalIST,
            intervalType,
            predictedEnergy,
            predictedInflow,
            predictedFinalflow,
        });

        await summaryEntry.save();
        console.log(`Saved total prediction summary for ${userName} - ${intervalType}`);
    } catch (error) {
        console.error(`Error in calculating prediction summary: ${error.message}`);
    }
};

// Run prediction summary calculation
const runTotalPredictionSummaryCalculation = async (intervalType) => {
    try {
        const users = await PredictionData.distinct('userName');
        console.log(`Found Users: ${users}`); // Debugging log

        for (const userName of users) {
            const productIds = await PredictionData.distinct('product_id', { userName });
            console.log(`Product IDs for ${userName}: ${productIds}`); // Debugging log

            for (const product_id of productIds) {
                const { startTime, endTime } = getStartAndEndTime(intervalType);
                await calculateTotalPredictionSummary(userName, product_id, startTime, endTime, intervalType);
            }
        }
    } catch (error) {
        console.error(`Error in running ${intervalType} prediction summary calculation:`, error);
    }
};

// Schedule prediction summary calculations
const scheduleTotalPredictionSummaryCalculation = () => {
    const intervals = [
        { cronTime: '*/15 * * * *', intervalType: '15Minutes' },
        { cronTime: '*/30 * * * *', intervalType: '30Minutes' },
        { cronTime: '0 * * * *', intervalType: 'hourly' },
        { cronTime: '0 0 * * *', intervalType: 'daily' },
        { cronTime: '0 0 1 * *', intervalType: 'monthly' },
    ];

    intervals.forEach(({ cronTime, intervalType }) => {
        cron.schedule(cronTime, async () => {
            console.log(`Running ${intervalType} prediction summary calculation...`);
            await runTotalPredictionSummaryCalculation(intervalType);
        });
    });
};
// Function to get all prediction summary data
const getAllPredictionSummaryData = async (req, res) => {
    try {
        const data = await TotalPredictionSummary.find({});
        if (data.length === 0) {
            return res.status(404).json({ message: 'No prediction summary data found.' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching all prediction summary data: ${error.message}`);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Function to get prediction summary by userName
const getPredictionSummaryByUserName = async (req, res) => {
    const { userName } = req.params;
    try {
        const data = await TotalPredictionSummary.find({ userName });
        if (data.length === 0) {
            return res.status(404).json({ message: `No prediction summary data found for user: ${userName}` });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching prediction summary for user ${userName}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Function to get prediction summary by userName and intervalType
const getPredictionSummaryByUserNameAndInterval = async (req, res) => {
    const { userName, intervalType } = req.params;
    try {
        const data = await TotalPredictionSummary.find({ userName, intervalType });
        if (data.length === 0) {
            return res.status(404).json({ 
                message: `No prediction summary data found for user: ${userName} and interval: ${intervalType}` 
            });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching prediction summary for user ${userName} and interval ${intervalType}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
module.exports = { 
    runTotalPredictionSummaryCalculation, 
    calculateTotalPredictionSummary,
    scheduleTotalPredictionSummaryCalculation,
    getAllPredictionSummaryData,
    getPredictionSummaryByUserName,
    getPredictionSummaryByUserNameAndInterval,
};

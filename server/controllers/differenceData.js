const cron = require('node-cron');
const moment = require('moment');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const IotData = require('../models/iotData'); // Replace with actual path
const DifferenceData = require('../models/differeneceData'); // Replace with your model path

const calculateAndSaveDailyDifferences = async () => {
    try {
        console.log("Starting daily difference calculation...");

        // Step 1: Find users with both station types: 'energy' and 'effluent_flow'
        const usersWithStations = await IotData.aggregate([
            { 
                $unwind: "$stackData" 
            },
            { 
                $match: { 
                    $or: [
                        { "stackData.stationType": "energy" },
                        { "stackData.stationType": "effluent_flow" }
                    ] 
                }
            },
            { 
                $group: { 
                    _id: "$userName", 
                    stationTypes: { $addToSet: "$stackData.stationType" } 
                } 
            },
            { 
                $match: { 
                    stationTypes: { $all: ["energy", "effluent_flow"] } 
                } 
            }
        ]);

        const relevantUsers = usersWithStations.map(user => user._id);
        console.log("Users with both 'energy' and 'effluent_flow':", relevantUsers);

        // Step 2: Process data for each user
        for (const userName of relevantUsers) {
            // Get all distinct dates for the user's data
            const dates = await IotData.aggregate([
                { $match: { userName } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$timestamp" },
                            month: { $month: "$timestamp" },
                            day: { $dayOfMonth: "$timestamp" }
                        }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
            ]);

            for (const dateInfo of dates) {
                const { year, month, day } = dateInfo._id;

                // Define the start and end timestamps for the specific day
                const startOfDay = new Date(year, month - 1, day, 0, 0, 0);  // 12:00 AM
                const endOfDay = new Date(year, month - 1, day, 23, 50, 0);  // 11:50 PM

                console.log(`Processing data for ${userName} on ${moment(startOfDay).format('DD/MM/YYYY')}`);

                // Fetch the first and last data entries for the specific day and user
                const startData = await IotData.findOne({
                    userName,
                    timestamp: { $gte: startOfDay, $lte: endOfDay }
                }).sort({ timestamp: 1 });

                const endData = await IotData.findOne({
                    userName,
                    timestamp: { $gte: startOfDay, $lte: endOfDay }
                }).sort({ timestamp: -1 });

                if (!startData || !endData) {
                    console.log(`No data found for ${userName} on ${moment(startOfDay).format('DD/MM/YYYY')}`);
                    continue;
                }

                // Helper function to extract relevant values based on stationType
                const extractValues = (data, stationType) => {
                    const stack = data.stackData.find((s) => s.stationType === stationType);
                    if (!stack) return {};

                    return {
                        inflow: parseFloat(stack.inflow) || 0,
                        finalflow: parseFloat(stack.finalflow) || 0,
                        energy: parseFloat(stack.energy) || 0,
                        stationType: stack.stationType,
                        stackName: stack.stackName
                    };
                };

                // Extract energy and effluent values
                const initialEnergyData = extractValues(startData, 'energy');
                const finalEnergyData = extractValues(endData, 'energy');
                const initialEffluentData = extractValues(startData, 'effluent_flow');
                const finalEffluentData = extractValues(endData, 'effluent_flow');

                // Calculate differences
                const energyDifference = finalEnergyData.energy - initialEnergyData.energy;
                const inflowDifference = finalEffluentData.inflow - initialEffluentData.inflow;
                const finalflowDifference = finalEffluentData.finalflow - initialEffluentData.finalflow;

                // Save energy data
                if (initialEnergyData.energy && finalEnergyData.energy) {
                    const energyEntry = new DifferenceData({
                        date: moment(startOfDay).format('DD/MM/YYYY'),
                        day: moment(startOfDay).format('dddd'),
                        time: moment(endOfDay).format('HH:mm:ss'),
                        userName,
                        product_id: startData.product_id,
                        stationType: initialEnergyData.stationType,
                        stackName: initialEnergyData.stackName,
                        initialEnergy: initialEnergyData.energy,
                        finalEnergy: finalEnergyData.energy,
                        energyDifference: energyDifference,
                    });
                    await energyEntry.save();
                    console.log(`Energy entry saved for ${userName} on ${moment(startOfDay).format('DD/MM/YYYY')}`);
                }

                // Save effluent data
                if (initialEffluentData.inflow && finalEffluentData.finalflow) {
                    const effluentEntry = new DifferenceData({
                        date: moment(startOfDay).format('DD/MM/YYYY'),
                        day: moment(startOfDay).format('dddd'),
                        time: moment(endOfDay).format('HH:mm:ss'),
                        userName,
                        product_id: startData.product_id,
                        stationType: initialEffluentData.stationType,
                        stackName: initialEffluentData.stackName,
                        initialInflow: initialEffluentData.inflow,
                        finalInflow: finalEffluentData.inflow,
                        inflowDifference: inflowDifference,
                        initialFinalflow: initialEffluentData.finalflow,
                        finalFinalflow: finalEffluentData.finalflow,
                        finalflowDifference: finalflowDifference,
                    });
                    await effluentEntry.save();
                    console.log(`Effluent entry saved for ${userName} on ${moment(startOfDay).format('DD/MM/YYYY')}`);
                }
            }
        }
    } catch (error) {
        console.error('Error calculating and saving daily differences:', error);
    }
};

const calculateAndSaveDailyDifferenceCheck = async () => {
    try {
        console.log("Starting 9:16 AM to 9:30 AM difference calculation...");

        // Step 1: Find users with either 'energy' or 'effluent_flow' station types
        const usersWithStations = await IotData.aggregate([
            { $unwind: "$stackData" },
            { 
                $match: { 
                    "stackData.stationType": { 
                        $in: ["energy", "effluent_flow"] 
                    }
                }
            },
            { 
                $group: { 
                    _id: "$userName", 
                    stationTypes: { $addToSet: "$stackData.stationType" } 
                } 
            }
        ]);

        const relevantUsers = usersWithStations.map(user => user._id);
        console.log("Relevant users:", relevantUsers);

        // Step 2: Process data for each user between 8:50 AM and 9:10 AM
        for (const userName of relevantUsers) {
            const startTime = moment().startOf('day').hour(9).minute(16).second(0).toDate();
            const endTime = moment().startOf('day').hour(9).minute(30).second(0).toDate();

            console.log(`Processing data for ${userName} between ${startTime} and ${endTime}`);

            // Fetch start and end data with logging
            const startData = await IotData.findOne({
                userName,
                timestamp: { $gte: startTime, $lte: endTime }
            }).sort({ timestamp: 1 });

            const endData = await IotData.findOne({
                userName,
                timestamp: { $gte: startTime, $lte: endTime }
            }).sort({ timestamp: -1 });

            // Log the raw results to verify if data is found
            console.log(`Start Data for ${userName}:`, startData);
            console.log(`End Data for ${userName}:`, endData);

            if (!startData || !endData) {
                console.log(`No data found for ${userName} in the given time range.`);
                continue; // Skip to the next user if data is missing
            }

            // Helper function to extract relevant values from stackData
            const extractValues = (data, stationType) => {
                const stack = data.stackData.find((s) => s.stationType === stationType);
                if (!stack) {
                    console.log(`No stack found with stationType: ${stationType} for ${userName}`);
                    return {};
                }

                return {
                    inflow: parseFloat(stack.inflow) || 0,
                    finalflow: parseFloat(stack.finalflow) || 0,
                    energy: parseFloat(stack.energy) || 0,
                    stationType: stack.stationType,
                    stackName: stack.stackName
                };
            };

            // Try extracting values for both 'energy' and 'effluent_flow'
            const initialEnergyData = extractValues(startData, 'energy');
            const finalEnergyData = extractValues(endData, 'energy');
            const initialEffluentData = extractValues(startData, 'effluent_flow');
            const finalEffluentData = extractValues(endData, 'effluent_flow');

            // Calculate differences (only if both start and end values are present)
            if (initialEnergyData.energy && finalEnergyData.energy) {
                const energyDifference = finalEnergyData.energy - initialEnergyData.energy;
                console.log(`Energy difference: ${energyDifference}`);

                const energyEntry = new DifferenceData({
                    date: moment(startTime).format('DD/MM/YYYY'),
                    day: moment(startTime).format('dddd'),
                    time: moment(endTime).format('HH:mm:ss'),
                    userName,
                    product_id: startData.product_id,
                    stationType: initialEnergyData.stationType,
                    stackName: initialEnergyData.stackName,
                    initialEnergy: initialEnergyData.energy,
                    finalEnergy: finalEnergyData.energy,
                    energyDifference: energyDifference,
                });

                await energyEntry.save();
                console.log(`Energy entry saved for ${userName}`);
            } else {
                console.log(`Energy data missing for ${userName}.`);
            }

            if (initialEffluentData.inflow && finalEffluentData.finalflow) {
                const inflowDifference = finalEffluentData.inflow - initialEffluentData.inflow;
                const finalflowDifference = finalEffluentData.finalflow - initialEffluentData.finalflow;

                console.log(`Inflow difference: ${inflowDifference}, Final flow difference: ${finalflowDifference}`);

                const effluentEntry = new DifferenceData({
                    date: moment(startTime).format('DD/MM/YYYY'),
                    day: moment(startTime).format('dddd'),
                    time: moment(endTime).format('HH:mm:ss'),
                    userName,
                    product_id: startData.product_id,
                    stationType: initialEffluentData.stationType,
                    stackName: initialEffluentData.stackName,
                    initialInflow: initialEffluentData.inflow,
                    finalInflow: finalEffluentData.inflow,
                    inflowDifference: inflowDifference,
                    initialFinalflow: initialEffluentData.finalflow,
                    finalFinalflow: finalEffluentData.finalflow,
                    finalflowDifference: finalflowDifference,
                });

                await effluentEntry.save();
                console.log(`Effluent entry saved for ${userName}`);
            } else {
                console.log(`Effluent data missing for ${userName}.`);
            }
        }
    } catch (error) {
        console.error('Error in dummy calculation:', error);
    }
};
// calculateAndSaveDailyDifferenceCheck()

// Schedule the task to run every day at 11:55 PM
cron.schedule('55 23 * * *', () => {
    console.log('Running scheduled task at 11:55 PM');
    calculateAndSaveDailyDifferences();
});

// Function to get daily difference data by userName
const getDailyDifferencesByUserName = async (userName) => {
    try {
        const data = await DifferenceData.find({ userName }).sort({ date: -1 }); // Sort by most recent date
        if (data.length === 0) {
            return { message: `No data found for user: ${userName}` };
        }
        return data;
    } catch (error) {
        console.error('Error fetching data by userName:', error);
        throw new Error('Failed to fetch daily differences.');
    }
};
const downloadDifferenceDataByUserName = async (req, res) => {
    try {
        const { userName, fromDate, toDate, format } = req.query;

        // Validate input
        if (!userName || !fromDate || !toDate || !format) {
            return res.status(400).send('Missing required query parameters');
        }

        // Parse dates to ensure proper querying
        const parsedFromDate = moment(fromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const parsedToDate = moment(toDate, 'DD-MM-YYYY').endOf('day').toDate();

        // Query the difference data based on the userName and date range
        const data = await DifferenceData.find({
            userName,
            timestamp: {
                $gte: parsedFromDate,
                $lte: parsedToDate,
            },
        }).lean();

        if (data.length === 0) {
            return res.status(404).send('No difference data found for the specified criteria');
        }

        // Define the fields based on the DifferenceData schema
        const fields = [
            'date', 
            'day', 
            'time', 
            'userName', 
            'product_id', 
            'stationType', 
            'stackName', 
            'initialInflow', 
            'finalInflow', 
            'inflowDifference', 
            'initialFinalflow', 
            'finalFinalflow', 
            'finalflowDifference', 
            'initialEnergy', 
            'finalEnergy', 
            'energyDifference'
        ];

        if (format === 'csv') {
            // Generate CSV
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(data);

            res.header('Content-Type', 'text/csv');
            res.attachment('difference_data.csv');
            return res.send(csv);
        } else if (format === 'pdf') {
            // Generate PDF
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment('difference_data.pdf');

            doc.pipe(res);

            doc.fontSize(20).text('Difference Data Report', { align: 'center' });
            doc.fontSize(12).text(`User Name: ${userName}`);
            doc.fontSize(12).text(`Date Range: ${fromDate} - ${toDate}`);
            doc.moveDown();

            data.forEach((item) => {
                doc.fontSize(10).text(`Date: ${item.date}, Time: ${item.time}`);
                doc.fontSize(12).text(`Station: ${item.stationType}, Stack: ${item.stackName}`);
                doc.text(`Initial Inflow: ${item.initialInflow}, Final Inflow: ${item.finalInflow}, Inflow Difference: ${item.inflowDifference}`);
                doc.text(`Initial Final Flow: ${item.initialFinalflow}, Final Final Flow: ${item.finalFinalflow}, Final Flow Difference: ${item.finalflowDifference}`);
                doc.text(`Initial Energy: ${item.initialEnergy}, Final Energy: ${item.finalEnergy}, Energy Difference: ${item.energyDifference}`);
                doc.moveDown();
            });

            doc.end();
        } else {
            return res.status(400).send('Invalid format requested');
        }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {calculateAndSaveDailyDifferences,calculateAndSaveDailyDifferenceCheck, getDailyDifferencesByUserName,downloadDifferenceDataByUserName}
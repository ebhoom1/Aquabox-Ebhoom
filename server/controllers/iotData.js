const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const cron = require('node-cron');
const IotData = require('../models/iotData');
const userdb = require('../models/user');
const IotDataAverage = require(`../models/averageData`);
const DifferenceData = require(`../models/differeneceData`);
const { handleExceedValues } = require('./calibrationExceed');

// Function to check sensor data for zero values
const checkSensorData = (data) => {
    // List of Sensor data fields to check
    const sensorDataFields = [
        'ph', 'tds', 'turbidity', 'temperature', 'bod', 'cod',
        'tss', 'orp', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride'
    ];

    // Check if any sensor data field is zero
    for (let field of sensorDataFields) {
        if (data[field] === "N/A") {
            return {
                success: false,
                message: `Problem in data: ${field} value is 0`,
                problemField: field
            };
        }
    }
    return {
        success: true,
        message: "All sensor data values are valid"
    };
};

// Function to check if required fields are missing
const checkRequiredFields = (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        return {
            success: false,
            message: `Missing required fields: ${missingFields.join(', ')}`,
            missingFields
        };
    }
    return {
        success: true,
        message: "All required fields are present"
    };
};


// Function to handle Mqtt Messages and save the data to MongoDB
// const handleSaveMessage = async (req, res) => {
//     const data = req.body;

//     try {
//         // Check required fields
//         const requiredFields = ['userName', 'companyName', 'industryType', 'mobileNumber', 'email', 'product_id'];
//         const validationStatus = checkRequiredFields(data, requiredFields);
//         if (!validationStatus.success) {
//             console.error(validationStatus.message);
//             return res.status(400).json(validationStatus);
//         }
        
//         // Check sensor data
//         const sensorValidationStatus = checkSensorData(data);
//         if (!sensorValidationStatus.success) {
//             console.error(sensorValidationStatus.message);
//             return res.status(400).json(sensorValidationStatus);
//         }

//         const formattedDate = moment().format('DD/MM/YYYY');

//         // Prepare stack data if provided
//         let stackData = [];

//         // If the 'stacks' array is provided in the data, use it directly
//         if (data.stacks && Array.isArray(data.stacks)) {
//             stackData = data.stacks.map(stack => ({
//                 stackName: stack.stackName,
//                 ph: stack.ph !== 'N/A' ? stack.ph : null,
//                 TDS: stack.TDS !== 'N/A' ? stack.TDS : null,
//                 turbidity: stack.turbidity !== 'N/A' ? stack.turbidity : null,
//                 temperature: stack.temperature !== 'N/A' ? stack.temperature : null,
//                 BOD: stack.BOD !== 'N/A' ? stack.BOD : null,
//                 COD: stack.COD !== 'N/A' ? stack.COD : null,
//                 TSS: stack.TSS !== 'N/A' ? stack.TSS : null,
//                 ORP: stack.ORP !== 'N/A' ? stack.ORP : null,
//                 nitrate: stack.nitrate !== 'N/A' ? stack.nitrate : null,
//                 ammonicalNitrogen: stack.ammonicalNitrogen !== 'N/A' ? stack.ammonicalNitrogen : null,
//                 DO: stack.DO !== 'N/A' ? stack.DO : null,
//                 chloride: stack.chloride !== 'N/A' ? stack.chloride : null,
//                 Flow: stack.Flow !== 'N/A' ? stack.Flow : null,
//                 Totalizer_Flow:stack.Totalizer_Flow !=='N/A' ? stack.Totalizer_Flow : null,
//                 CO: stack.CO !== 'N/A' ? stack.CO : null,
//                 NOX: stack.NOX !== 'N/A' ? stack.NOX : null,
//                 Pressure: stack.Pressure !== 'N/A' ? stack.Pressure : null,
//                 Flouride: stack.Flouride !== 'N/A' ? stack.Flouride : null,
//                 PM: stack.PM !== 'N/A' ? stack.PM : null,
//                 SO2: stack.SO2 !== 'N/A' ? stack.SO2 : null,
//                 NO2: stack.NO2 !== 'N/A' ? stack.NO2 : null,
//                 Mercury: stack.Mercury !== 'N/A' ? stack.Mercury : null,
//                 PM10: stack.PM10 !== 'N/A' ? stack.PM10 : null,
//                 PM25: stack.PM25 !== 'N/A' ? stack.PM25 : null,
//                 NOH: stack.NOH !== 'N/A' ? stack.NOH : null,
//                 NH3: stack.NH3 !== 'N/A' ? stack.NH3 : null,
//                 WindSpeed: stack.WindSpeed !== 'N/A' ? stack.WindSpeed : null,
//                 WindDir: stack.WindDir !== 'N/A' ? stack.WindDir : null,
//                 AirTemperature: stack.AirTemperature !== 'N/A' ? stack.AirTemperature : null,
//                 Humidity: stack.Humidity !== 'N/A' ? stack.Humidity : null,
//                 solarRadiation: stack.solarRadiation !== 'N/A' ? stack.solarRadiation : null,
//                 DB: stack.DB !== 'N/A' ? stack.DB : null,
//                 inflow: stack.inflow !== 'N/A' ? stack.inflow : null,
//                 finalflow: stack.finalflow !== 'N/A' ? stack.finalflow : null,
//                 energy: stack.energy !== 'N/A' ? stack.energy : null,
//                 voltage: stack.voltage !== 'N/A' ? stack.voltage : null,
//                 current: stack.current !== 'N/A' ? stack.current : null,
//                 power: stack.power !== 'N/A' ? stack.power : null,
//             }));
//         } else {
//             // If no stacks array is provided, assume it's for stack_1 and use individual sensor data
//             stackData.push({
//                 stackName: "stack_1",
//                 ph: data.ph !== 'N/A' ? data.ph : null,
//                 TDS: data.TDS !== 'N/A' ? data.TDS : null,
//                 turbidity: data.turbidity !== 'N/A' ? data.turbidity : null,
//                 temperature: data.temperature !== 'N/A' ? data.temperature : null,
//                 BOD: data.BOD !== 'N/A' ? data.BOD : null,
//                 COD: data.COD !== 'N/A' ? data.COD : null,
//                 TSS: data.TSS !== 'N/A' ? data.TSS : null,
//                 ORP: data.ORP !== 'N/A' ? data.ORP : null,
//                 nitrate: data.nitrate !== 'N/A' ? data.nitrate : null,
//                 ammonicalNitrogen: data.ammonicalNitrogen !== 'N/A' ? data.ammonicalNitrogen : null,
//                 DO: data.DO !== 'N/A' ? data.DO : null,
//                 chloride: data.chloride !== 'N/A' ? data.chloride : null,
//                 Flow: data.Flow !== 'N/A' ? data.Flow : null,
//                 CO: data.CO !== 'N/A' ? data.CO : null,
//                 NOX: data.NOX !== 'N/A' ? data.NOX : null,
//                 Pressure: data.Pressure !== 'N/A' ? data.Pressure : null,
//                 Flouride: data.Flouride !== 'N/A' ? data.Flouride : null,
//                 PM: data.PM !== 'N/A' ? data.PM : null,
//                 SO2: data.SO2 !== 'N/A' ? data.SO2 : null,
//                 NO2: data.NO2 !== 'N/A' ? data.NO2 : null,
//                 Mercury: data.Mercury !== 'N/A' ? data.Mercury : null,
//                 PM10: data.PM10 !== 'N/A' ? data.PM10 : null,
//                 PM25: data.PM25 !== 'N/A' ? data.PM25 : null,
//                 NOH: data.NOH !== 'N/A' ? data.NOH : null,
//                 NH3: data.NH3 !== 'N/A' ? data.NH3 : null,
//                 WindSpeed: data.WindSpeed !== 'N/A' ? data.WindSpeed : null,
//                 WindDir: data.WindDir !== 'N/A' ? data.WindDir : null,
//                 AirTemperature: data.AirTemperature !== 'N/A' ? data.AirTemperature : null,
//                 Humidity: data.Humidity !== 'N/A' ? data.Humidity : null,
//                 solarRadiation: data.solarRadiation !== 'N/A' ? data.solarRadiation : null,
//                 DB: data.DB !== 'N/A' ? data.DB : null,
//                 inflow: data.inflow !== 'N/A' ? data.inflow : null,
//                 finalflow: data.finalflow !== 'N/A' ? data.finalflow : null,
//                 energy: data.energy !== 'N/A' ? data.energy : null,
//                 voltage: data.voltage !== 'N/A' ? data.voltage : null,
//                 current: data.current !== 'N/A' ? data.current : null,
//                 power: data.power !== 'N/A' ? data.power : null
//             });
//         }

//         const newEntry = new IotData({
//             product_id: data.product_id,
//             stackData,
//             date: formattedDate,
//             time: data.time !== 'N/A' ? data.time : moment().format('HH:mm:ss'),
//             topic: data.topic,
//             companyName: data.companyName,
//             industryType: data.industryType,
//             userName: data.userName || 'N/A',
//             mobileNumber: data.mobileNumber || 'N/A',
//             email: data.email || 'N/A',
//             timestamp: new Date(),
//             validationMessage: data.validationMessage || 'Validated',
//             validationStatus: data.validationStatus || 'Valid',
//         });

//         await newEntry.save();
//         console.log('New Entry:', newEntry);

//         // Update the user's iotLastEnterDate
//         const userUpdate = await userdb.findOneAndUpdate(
//             { userName: data.userName },
//             { iotLastEnterDate: formattedDate }, // Update with the latest incoming date
//             { new: true } // Return the updated document
//         );

//         if (!userUpdate) {
//             console.error('User not found or update failed');
//             return res.status(404).json({ success: false, message: 'User not found or update failed' });
//         }

//         console.log('User Updated Successfully:', userUpdate);

//         // Call handleExceedValues after saving the new IoT data entry
//         await handleExceedValues();

//         res.status(200).json({
//             success: true,
//             message: "New Entry data saved successfully",
//             newEntry
//         });
//     } catch (error) {
//         console.error('Error saving data to MongoDB:', error);
//         res.status(500).json({
//             success: false,
//             message: "Error saving data to MongoDB",
//             error: error.message
//         });
//     }
// };

const handleSaveMessage = async (req, res) => {
    const data = req.body;

     // Check for missing required fields
     const requiredFields = ['product_id', 'companyName', 'industryType', 'userName', 'mobileNumber', 'email'];
     const requiredFieldsCheck = checkRequiredFields(data, requiredFields);


    if (!requiredFieldsCheck.success) {
        return res.status(400).json(requiredFieldsCheck);
    }

    // Check if 'stackData' field is provided instead of 'stacks'
    const stacks = data.stacks || data.stackData; 

    // Ensure that the 'stacks' (or 'stackData') field exists
    if (!Array.isArray(stacks) || stacks.length === 0) {
        console.error('Stacks data is required but not provided.');
        return res.status(400).json({
            success: false,
            message: 'Stacks data is required and must include stackName.',
            missingFields: ['stacks'],
        });
    }
// Adjust to your local timezone
const time = moment().tz('Asia/Kolkata').format('HH:mm:ss');
const timestamp = moment().tz('Asia/Kolkata').toDate();
    try {
        const newEntry = new IotData({
            product_id: data.product_id,
            stackData: stacks, // Save stacks directly
            date: moment().format('DD/MM/YYYY'),
            time: time,
            companyName: data.companyName,
            industryType: data.industryType,
            userName: data.userName,
            mobileNumber: data.mobileNumber,
            email: data.email,
            timestamp: new Date(),
            validationMessage: data.validationMessage || 'Validated',
            validationStatus: data.validationStatus || 'Valid',
        });

        await newEntry.save();
        console.log('New Entry:', newEntry);
 
        // Call handleExceedValues after saving the new IoT data entry
      await handleExceedValues();
        res.status(200).json({
            success: true,
            message: 'New Entry data saved successfully',
            newEntry,
        });
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving data to MongoDB',
            error: error.message,
        });
    }
};





const getIotDataByUserNameAndStackName = async (req, res) => {
    const { userName, stackName } = req.params;

    try {
        // Querying data based on userName and stackName within stackData and sorting by timestamp (latest first)
        const data = await IotData.find({
            userName,
            'stackData.stackName': stackName,  // Accessing stackName inside stackData
        }).sort({ timestamp: -1 }); // Sorting in descending order by timestamp

        if (data.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No IoT data found for the specified userName: ${userName} and stackName: ${stackName}`,
            });
        }

        // Filter stackData to return only the matching stackName
        const filteredData = data.map((entry) => {
            const stackData = entry.stackData.filter(stack => stack.stackName === stackName);
            return {
                ...entry._doc,  // Spread the document object to keep other fields
                stackData       // Replace stackData with the filtered version
            };
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: `IoT data for userName ${userName} and stackName ${stackName} fetched successfully`,
            data: filteredData,
        });
    } catch (error) {
        console.error(`Error Fetching IoT data by userName and stackName:`, error);
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error Fetching IoT data by userName and stackName || Internal Server error`,
            error: error.message,
        });
    }
};


const getIotDataByCompanyNameAndStackName = async (req, res) => {
    let { companyName, stackName } = req.params;

    try {
        // Decode the companyName to handle %20 or other encoded characters
        companyName = decodeURIComponent(companyName);

        // Querying data based on companyName and stackName within stackData
        const data = await IotData.find({
            companyName,
            'stackData.stackName': stackName,  // Accessing stackName inside stackData
        });

        if (data.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No IoT data found for the specified companyName: ${companyName} and stackName: ${stackName}`,
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `IoT data for companyName ${companyName} and stackName ${stackName} fetched successfully`,
            data,
        });
    } catch (error) {
        console.error(`Error Fetching IoT data by companyName and stackName:`, error);
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error Fetching IoT data by companyName and stackName || Internal Server error`,
            error: error.message,
        });
    }
};




const getAllIotData =async (req,res)=>{
    try{
        const allData =await IotData.find({});
        
        res.status(200).json({
            status:200,
            success:true,
            message:'All IoT data fetched Succesfully',
            data:allData
        })
    }catch(error){
        console.error('Error fetching IoT data:',error);
        res.status(500).json({
            success:false,
            message:'Error fetching IoT data',
            error:error.message
        })
    }
}

const getLatestIoTData = async (req, res) => {
    const { userName } = req.params;
    try {
        const latestData = await IotData.aggregate([
            { $match: { userName: userName } },
            { $sort: { timestamp: -1 } }, // Sort by timestamp in descending order 
            {
                $group: {
                    _id: "$product_id",
                    latestRecord: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$latestRecord" } }
        ]).allowDiskUse(true); // Enable disk usage for sorting

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Latest IoT Data fetched successfully',
            data: latestData
        });
    } catch (error) {
        console.error('Error fetching latest IoT Data:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Error fetching latest IoT data',
            error: error.message
        });
    }
};


const getIotDataByUserName = async (req,res)=>{
    const {userName} =req.params;

    try {
        const data = await IotData.find({userName});
        if(data.length === 0){
            return res.status(404).json({
                status:404,
                success:false,
                message:'No IoT data found for the specified userName',
               

            });           
        }
        res.status(200).json({
            status:200,
            success:true,
            message:`IoT data for userName ${userName} fetched successfully`,
            data
        });
    } catch (error) {
        console.error(`Error Fetching IoT data by userName:`,error);
        res.status(500).json({
            status:500,
            success:false,
            message:`Error Fetching IoT data by userName|| Internal Server error`,
            error:error.message,
        })
    }
}
const getIotDataByCompanyName = async (req, res) => {
    const { companyName } = req.params;

    try {
        const data = await IotData.find({ companyName });
        if (data.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No IoT data found for the specified companyName',
            });
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: `IoT data for companyName ${companyName} fetched successfully`,
            data,
        });
    } catch (error) {
        console.error(`Error Fetching IoT data by companyName:`, error);
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error Fetching IoT data by companyName || Internal Server error`,
            error: error.message,
        });
    }
};


// The Graph printing Taking average and using in the graph//
const calculateAverages = async (userName, product_id, startTime, endTime, interval) => {
    console.log(`Calculating averages for ${interval}: ${startTime} to ${endTime}`);
    const data = await IotData.find({
        userName: userName,
        product_id: product_id,
        timestamp: {
            $gte: startTime,
            $lt: endTime
        }
    });
    console.log(`Data length for ${interval}:`, data.length);
    if (data.length === 0) {
        console.log(`No data found for interval ${interval}`);
        return;
    }

    const fields = ['ph', 'TDS', 'turbidity', 'temperature', 'BOD', 'COD', 'TSS', 'ORP', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride', 'PM', 'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed', 'WindDir', 'AirTemperature', 'Flouride', 'Humidity', 'solarRadiation', 'DB', 'inflow', 'finalflow', 'energy', 'CO', 'NOX', 'NO2', 'Mercury', 'Pressure', 'voltage', 'current', 'power'];

    const averages = fields.reduce((acc, field) => {
        acc[field] = parseFloat((data.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0) / data.length).toFixed(2));
        return acc;
    }, {});

    console.log(`Averages calculated for ${interval}:`, averages);

    const averageEntry = new IotDataAverage({
        userName: userName,
        product_id: product_id,  // Assuming all data entries have the same product_id
        interval: interval,
        dateAndTime: moment().format('DD/MM/YYYY HH:mm'),
        ...averages,
        timestamp: new Date()
    });

    await averageEntry.save();
    console.log(`Average entry saved for ${interval}:`, averageEntry);
};

const scheduleAveragesCalculation = () => {
   
    cron.schedule('0 * * * *', async () => { // Every hour
        console.log("Running hourly average calculation...");
        const users = await IotData.distinct('userName');
        for (let userName of users) {
            const productIds = await IotData.distinct('product_id', { userName: userName });
            for (let product_id of productIds) {
                const startTime = new Date(Date.now() - 60 * 60 * 1000);
                const endTime = new Date();
                await calculateAverages(userName, product_id, startTime, endTime, 'hour');
            }
        }
    });

    cron.schedule('0 0 * * *', async () => { // Every day
        console.log("Running daily average calculation...");
        const users = await IotData.distinct('userName');
        for (let userName of users) {
            const productIds = await IotData.distinct('product_id', { userName: userName });
            for (let product_id of productIds) {
                const now = new Date();
                const dailyStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                const dailyEndTime = new Date(dailyStartTime.getTime() + 24 * 60 * 60 * 1000 - 1);
                await calculateAverages(userName, product_id, dailyStartTime, dailyEndTime, 'day');
            }
        }
    });

    cron.schedule('0 0 * * 1', async () => { // Every week (Monday)
        console.log("Running weekly average calculation...");
        const users = await IotData.distinct('userName');
        for (let userName of users) {
            const productIds = await IotData.distinct('product_id', { userName: userName });
            for (let product_id of productIds) {
                const now = new Date();
                const weeklyStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
                await calculateAverages(userName, product_id, weeklyStartTime, now, 'week');
            }
        }
    });

    cron.schedule('0 0 1 * *', async () => { // Every month (1st day)
        console.log("Running monthly average calculation...");
        const users = await IotData.distinct('userName');
        for (let userName of users) {
            const productIds = await IotData.distinct('product_id', { userName: userName });
            for (let product_id of productIds) {
                const now = new Date();
                const monthlyStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()- 30, 0, 0, 0);
                const monthlyEndTime = new Date();
                await calculateAverages(userName, product_id, monthlyStartTime, monthlyEndTime, 'month');
            }
        }
    });

    cron.schedule('0 0 1 */6 *', async () => { // Every 6 months (1st day of every 6th month)
        console.log("Running 6-monthly average calculation...");
        const users = await IotData.distinct('userName');
        for (let userName of users) {
            const productIds = await IotData.distinct('product_id', { userName: userName });
            for (let product_id of productIds) {
                const now = new Date();
                const sixMonthStartTime = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate(), 0, 0, 0);
                const sixMonthEndTime = new Date();
                await calculateAverages(userName, product_id, sixMonthStartTime, sixMonthEndTime, 'sixmonths');
            }
        }
    });

    cron.schedule('0 0 1 1 *', async () => { // Every year (1st day of January)
        console.log("Running yearly average calculation...");
        const users = await IotData.distinct('userName');
        for (let userName of users) {
            const productIds = await IotData.distinct('product_id', { userName: userName });
            for (let product_id of productIds) {
                const now = new Date();
                const yearlyStartTime = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0);
                const yearlyEndTime = new Date();
                await calculateAverages(userName, product_id, yearlyStartTime,yearlyEndTime, 'year');
            }
        }
    });
};

scheduleAveragesCalculation();






const getAverageDataByUserName = async (req, res) => {
    const { userName } = req.params;
    const { interval } = req.query;

    try {
        const averageData = await IotDataAverage.find({ userName, interval });
        if (averageData.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No average data found for the specified userName and interval'
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `Average data for userName ${userName} and interval ${interval} fetched successfully`,
            data: averageData
        });
    } catch (error) {
        console.error(`Error Fetching average data by userName:`, error);
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error Fetching average data by userName and interval`,
            error: error.message
        });
    }
};


//End of Averages // 

//Download Entire IOT Data

const downloadIotData = async (req, res) => {
    try {
        let { fromDate, toDate, industryName, companyName, format } = req.query;

        // Decode the URL-encoded parameters
        industryName = decodeURIComponent(industryName.trim());
        companyName = decodeURIComponent(companyName.trim());

        // Ensure dates are in the correct format
        fromDate = moment(fromDate, 'DD-MM-YYYY').format('DD/MM/YYYY');
        toDate = moment(toDate, 'DD-MM-YYYY').format('DD/MM/YYYY');

        // Log the parameters for debugging
        console.log("Query Parameters:", { fromDate, toDate, industryName, companyName, format });

        // Validate input
        if (!fromDate || !toDate || !industryName || !companyName) {
            return res.status(400).send('Missing required query parameters');
        }

        // Find IoT data based on filters
        const data = await IotData.find({
            industryType: industryName,
            companyName: companyName,
            date: {
                $gte: fromDate,
                $lte: toDate,
            },
        }).lean();

        if (data.length === 0) {
            console.log("No data found with criteria:", { fromDate, toDate, industryName, companyName });
            return res.status(404).send('No data found for the specified criteria');
        }

        if (format === 'csv') {
            // Generate CSV
            const fields = [
                'userName', 'industryType', 'companyName', 'date', 'time', 'product_id', 
                'ph', 'TDS', 'turbidity', 'temperature', 'BOD', 'COD', 'TSS', 'ORP', 
                'nitrate', 'ammonicalNitrogen', 'DO', 'chloride', 'Flow', 'CO', 'NOX', 
                'Pressure', 'Flouride', 'PM', 'SO2', 'NO2', 'Mercury', 'PM10', 'PM25', 
                'NOH', 'NH3', 'WindSpeed', 'WindDir', 'AirTemperature', 'Humidity', 
                'solarRadiation', 'DB', 'inflow', 'finalflow', 'energy', 'voltage', 
                'current', 'power', 
                 'topic', 'mobileNumber', 'email', 
                'validationStatus', 'validationMessage', 'timestamp'
              ];
              
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(data);

            res.header('Content-Type', 'text/csv');
            res.attachment('data.csv');
            return res.send(csv);
        } else if (format === 'pdf') {
            // Generate PDF
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment('data.pdf');

            doc.pipe(res);

            doc.fontSize(20).text('IoT Data Report', { align: 'center' });
            doc.fontSize(12).text(`Industry Type: ${industryName}`);
            doc.fontSize(12).text(`Company Name: ${companyName}`);
            doc.fontSize(12).text(`Date Range: ${fromDate} - ${toDate}`);
            doc.moveDown();

            data.forEach(item => {
                doc.fontSize(10).text(JSON.stringify(item), {
                    width: 410,
                    align: 'left'
                });
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




//inflow, finalflow,Energy


const calculateAndSaveDailyDifferences = async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0); // 8:20 PM
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0); // 8:22 PM

    // console.log(`Start of day: ${startOfDay}`);
    // console.log(`End of day: ${endOfDay}`);

    try {
        const initialData = await IotData.findOne({ timestamp: { $gte: startOfDay } }).sort({ timestamp: 1 });
        const finalData = await IotData.findOne({ timestamp: { $lte: endOfDay } }).sort({ timestamp: -1 });

        // console.log(`Initial data: ${JSON.stringify(initialData, null, 2)}`);
        // console.log(`Final data: ${JSON.stringify(finalData, null, 2)}`);

        if (!initialData) {
            // console.log('No initial data found for the specified date range');
            return;
        }

        if (!finalData) {
            // console.log('No final data found for the specified date range');
            return;
        }

        // Ensure all required fields are present
        const requiredFields = ['inflow', 'finalflow', 'energy'];
        for (const field of requiredFields) {
            if (typeof initialData[field] === 'undefined' || typeof finalData[field] === 'undefined') {
                // console.log(`Missing field ${field} in initial or final data`);
                return;
            }
        }

        const inflowDifference = finalData.inflow - initialData.inflow;
        const finalflowDifference = finalData.finalflow - initialData.finalflow;
        const energyDifference = finalData.energy - initialData.energy;

        const differenceEntry = new DifferenceData({
            date: moment(startOfDay).format('DD/MM/YYYY'),
            day: moment(startOfDay).format('dddd'),
            userName: initialData.userName,
            productId: initialData.product_id,
            initialInflow: initialData.inflow,
            finalInflow: finalData.inflow,
            inflowDifference: inflowDifference,
            initialFinalflow: initialData.finalflow,
            finalFinalflow: finalData.finalflow,
            finalflowDifference: finalflowDifference,
            initialEnergy: initialData.energy,
            finalEnergy: finalData.energy,
            energyDifference: energyDifference
        });

        await differenceEntry.save();
        // console.log(`Difference entry saved for ${moment(startOfDay).format('DD/MM/YYYY')}`);
    } catch (error) {
        console.error('Error calculating and saving daily differences:', error);
    }
};



// Schedule the task to run once a day at midnight
cron.schedule('0 0 * * *', calculateAndSaveDailyDifferences);





const getDifferenceDataByUserName = async (req, res) => {
    const { userName } = req.params;

    try {
        const differenceData = await DifferenceData.find({ userName });
        if (differenceData.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No difference data found for the specified userID'
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `Difference data for userName ${userName} fetched successfully`,
            data: differenceData
        });
    } catch (error) {
        console.error(`Error Fetching difference data by userName:`, error);
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error fetching difference data by userName`,
            error: error.message
        });
    }
};

const downloadIotDataByUserName = async (req, res) => {
    try {
        let { userName, fromDate, toDate, format } = req.query;

        // Decode the URL-encoded parameters
        userName = decodeURIComponent(userName.trim());

        // Parse the dates correctly in 'YYYY-MM-DD' format to ensure proper querying
        const parsedFromDate = moment(fromDate, 'DD-MM-YYYY').startOf('day').toDate();  // Changed to .toDate() to handle Date type in MongoDB
        const parsedToDate = moment(toDate, 'DD-MM-YYYY').endOf('day').toDate();        // Changed to .toDate() to handle Date type

        // Log the parameters for debugging
        console.log("Query Parameters:", { parsedFromDate, parsedToDate, userName, format });

        // Validate input
        if (!parsedFromDate || !parsedToDate || !userName) {
            return res.status(400).send('Missing required query parameters');
        }

        // Query data using correct date range
        const data = await IotData.find({
            userName: userName,
            timestamp: {
                $gte: parsedFromDate,  // Data from the start of fromDate
                $lte: parsedToDate     // Data until the end of toDate
            }
        }).lean();

        if (data.length === 0) {
            console.log("No data found with criteria:", { parsedFromDate, parsedToDate, userName });
            return res.status(404).send('No data found for the specified criteria');
        }

        if (format === 'csv') {
            // Generate CSV
            const fields = ['userName', 'industryType', 'companyName', 'date', 'time', 'product_id', 'ph', 'TDS', 'turbidity', 'temperature', 'BOD', 'COD', 'TSS', 'ORP', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride', 'PM', 'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed', 'WindDir', 'AirTemperature', 'Humidity', 'solarRadiation', 'DB', 'inflow','CO','NOX','SO2','Pressure','Flouride','Flow', 'finalflow', 'energy'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(data);

            res.header('Content-Type', 'text/csv');
            res.attachment('data.csv');
            return res.send(csv);
        } else if (format === 'pdf') {
            // Generate PDF
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment('data.pdf');

            doc.pipe(res);

            doc.fontSize(20).text('IoT Data Report', { align: 'center' });
            doc.fontSize(12).text(`User Name: ${userName}`);
            doc.fontSize(12).text(`Date Range: ${fromDate} - ${toDate}`);
            doc.moveDown();

            data.forEach(item => {
                doc.fontSize(10).text(JSON.stringify(item), {
                    width: 410,
                    align: 'left'
                });
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


const downloadIotDataByUserNameAndStackName = async (req, res) => {
    try {
        let { userName, stackName, fromDate, toDate, format } = req.query;

        // Decode parameters and validate input
        userName = decodeURIComponent(userName.trim());
        stackName = decodeURIComponent(stackName.trim());

        const parsedFromDate = moment(fromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const parsedToDate = moment(toDate, 'DD-MM-YYYY').endOf('day').toDate();

        if (!parsedFromDate || !parsedToDate || !userName || !stackName) {
            return res.status(400).send('Missing required query parameters');
        }

        // Query IoT data by user and stack name within the given date range
        const data = await IotData.find({
            userName,
            'stackData.stackName': stackName,
            timestamp: { $gte: parsedFromDate, $lte: parsedToDate }
        }).lean();

        if (data.length === 0) {
            return res.status(404).send('No data found for the specified criteria');
        }

        if (format === 'csv') {
            // Extract the fields dynamically from the stackData, excluding '_id'
            const stackKeys = Object.keys(data[0].stackData[0] || {}).filter(key => key !== '_id');

            const fields = ['Date', 'Time', ...stackKeys];
            const csvData = data.flatMap(item =>
                item.stackData.map(stack => ({
                    Date: moment(item.timestamp).format('DD-MM-YYYY'),
                    Time: moment(item.timestamp).format('HH:mm:ss'),
                    ...stack
                }))
            );

            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(csvData);

            res.header('Content-Type', 'text/csv');
            res.attachment('iot_data.csv');
            return res.send(csv);
        } else if (format === 'pdf') {
            // Generate PDF in tabular format
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment('iot_data.pdf');

            doc.pipe(res);
            doc.fontSize(20).text('IoT Data Report', { align: 'center' });
            doc.fontSize(12).text(`User Name: ${userName}`);
            doc.fontSize(12).text(`Stack Name: ${stackName}`);
            doc.fontSize(12).text(`Date Range: ${fromDate} - ${toDate}`);
            doc.moveDown();

            data.forEach(item => {
                doc.fontSize(10).text(`Date: ${moment(item.timestamp).format('DD-MM-YYYY')}, Time: ${moment(item.timestamp).format('HH:mm:ss')}`);
                const stackData = item.stackData;

                stackData.forEach(stack => {
                    doc.moveDown();
                    doc.fontSize(12).text(`Stack: ${stack.stackName}`, { underline: true });

                    const keys = Object.keys(stack).filter(key => key !== 'stackName' && stack[key] !== null);
                    const tableData = keys.map(key => `${key}: ${stack[key]}`).join(', ');

                    doc.text(tableData);
                });
                doc.moveDown();
            });

            doc.end();
        } else {
            res.status(400).send('Invalid format requested');
        }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        res.status(500).send('Internal Server Error');
    }
};


const viewDataByDateUserAndStackName = async (req, res) => {
    const { fromDate, toDate, userName, stackName } = req.query;

    try {
        // Parse the input dates to ISO Date objects for accurate querying
        const parsedFromDate = moment(fromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const parsedToDate = moment(toDate, 'DD-MM-YYYY').endOf('day').toDate();

        console.log("Parsed Dates:", { parsedFromDate, parsedToDate });

        // Build query with proper date range and userName
        const query = {
            userName: userName,
            timestamp: { // Use timestamp for accurate date-based queries
                $gte: parsedFromDate,
                $lte: parsedToDate
            },
            // Check if any stack inside stackData matches the given stackName
            'stackData.stackName': stackName
        };

        const data = await IotData.find(query).lean();

        if (!data.length) {
            console.log("No data found with criteria:", { parsedFromDate, parsedToDate, userName, stackName });
            return res.status(404).json({ message: "No data record is saved on these dates for the given user and stack name." });
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error('Failed to view data:', error);
        res.status(500).json({ message: "Failed to process request" });
    }
};




const deleteIotDataByDateAndUser = async (req, res) => {
    try {
        let { userName, fromDate, toDate } = req.query;

        // Ensure all required parameters are present
        if (!userName || !fromDate || !toDate) {
            return res.status(400).send('Missing required query parameters');
        }

        // Decode the URL-encoded parameters
        userName = decodeURIComponent(userName.trim());

        // Parse the dates in 'YYYY-MM-DD' format to ensure proper querying
        const parsedFromDate = moment(fromDate, 'DD-MM-YYYY').startOf('day').toDate();  // Start of the day for fromDate
        const parsedToDate = moment(toDate, 'DD-MM-YYYY').endOf('day').toDate();        // End of the day for toDate

        // Log the parameters for debugging
        console.log("Delete Operation Parameters:", { parsedFromDate, parsedToDate, userName });

        // Delete IoT data based on userName and date range
        const deleteResult = await IotData.deleteMany({
            userName: userName,
            timestamp: {
                $gte: parsedFromDate,  // Data from the start of fromDate
                $lte: parsedToDate     // Data until the end of toDate
            }
        });

        // Check if any data was deleted
        if (deleteResult.deletedCount === 0) {
            console.log("No data found to delete with the specified criteria:", { userName, parsedFromDate, parsedToDate });
            return res.status(404).send('No data found for the specified criteria');
        }

        // Return success message
        console.log(`Deleted ${deleteResult.deletedCount} records for user ${userName} between ${fromDate} and ${toDate}`);
        return res.status(200).send(`Deleted ${deleteResult.deletedCount} records for user ${userName} between ${fromDate} and ${toDate}`);
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Internal Server Error');
    }
};



module.exports ={handleSaveMessage, scheduleAveragesCalculation,getAllIotData, getLatestIoTData,getIotDataByUserName,
    downloadIotData,getAverageDataByUserName,calculateAndSaveDailyDifferences,getDifferenceDataByUserName,downloadIotDataByUserName,
    deleteIotDataByDateAndUser,downloadIotDataByUserNameAndStackName,getIotDataByUserNameAndStackName,getIotDataByCompanyNameAndStackName,
    getIotDataByCompanyName,viewDataByDateUserAndStackName
 }


  // const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    // const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
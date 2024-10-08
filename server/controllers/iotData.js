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
const handleSaveMessage = async (req, res) => {
    const data = req.body;

    try {
        // Check required fields
        const requiredFields = ['userName', 'companyName', 'industryType', 'mobileNumber', 'email', 'product_id',];
        const validationStatus = checkRequiredFields(data, requiredFields);
        if (!validationStatus.success) {
            console.error(validationStatus.message);
            return res.status(400).json(validationStatus);
        }
        
        // Check sensor data
        const sensorValidationStatus = checkSensorData(data);
        if (!sensorValidationStatus.success) {
            console.error(sensorValidationStatus.message);
            return res.status(400).json(sensorValidationStatus);
        }

        const formattedDate = moment().format('DD/MM/YYYY');

        const newEntry = new IotData({
            product_id: data.product_id,
            ph: data.ph !== 'N/A' ? data.ph : null,
            TDS: data.tds !== 'N/A' ? data.tds : null,
            turbidity: data.turbidity !== 'N/A' ? data.turbidity : null,
            temperature: data.temperature !== 'N/A' ? data.temperature : null,
            BOD: data.bod !== 'N/A' ? data.bod : null,
            COD: data.cod !== 'N/A' ? data.cod : null,
            TSS: data.tss !== 'N/A' ? data.tss : null,
            ORP: data.orp !== 'N/A' ? data.orp : null,
            nitrate: data.nitrate !== 'N/A' ? data.nitrate : null,
            ammonicalNitrogen: data.ammonicalNitrogen !== 'N/A' ? data.ammonicalNitrogen : null,
            DO: data.DO !== 'N/A' ? data.DO : null,
            chloride: data.chloride !== 'N/A' ? data.chloride : null,
            Flow: data.Flow !== 'N/A' ? data.Flow : null,
            CO: data.CO !== 'N/A' ? data.CO : null,
            NOX: data.NOX !== 'N/A' ? data.NOX : null,
            Pressure: data.Pressure !== 'N/A' ? data.Pressure : null,
            Flouride: data.Flouride !== 'N/A' ? data.Flouride : null,
            PM: data.PM !== 'N/A' ? data.PM : null,
            SO2: data.SO2 !== 'N/A' ? data.SO2 : null,
            NO2: data.NO2 !== 'N/A' ? data.NO2 : null,
            Mercury: data.Mercury !== 'N/A' ? data.Mercury : null,
            PM10: data.PM10 !== 'N/A' ? data.PM10 : null,
            PM25: data.PM25 !== 'N/A' ? data.PM25 : null,
            NOH: data.NOH !== 'N/A' ? data.NOH : null,
            NH3: data.NH3 !== 'N/A' ? data.NH3 : null,
            WindSpeed: data.WindSpeed !== 'N/A' ? data.WindSpeed : null,
            WindDir: data.WindDir !== 'N/A' ? data.WindDir : null,
            AirTemperature: data.AirTemperature !== 'N/A' ? data.AirTemperature : null,
            Humidity: data.Humidity !== 'N/A' ? data.Humidity : null,
            solarRadiation: data.solarRadiation !== 'N/A' ? data.solarRadiation : null,
            DB: data.DB !== 'N/A' ? data.DB : null,
            inflow: data.inflow !== 'N/A' ? data.inflow : null,
            finalflow: data.finalflow !== 'N/A' ? data.finalflow : null,
            energy: data.energy !== 'N/A' ? data.energy : null,
            voltage: data.voltage !== 'N/A' ? data.voltage : null,
            current: data.current !== 'N/A' ? data.current : null,
            power: data.power !== 'N/A' ? data.power : null,
            
            // Add stack_1 fields
            stack_2_flow: data.stack_2_flow !== 'N/A' ? data.stack_2_flow : null,
            stack_2_CO: data.stack_2_CO !== 'N/A' ? data.stack_2_CO : null,
            stack_2_NOX: data.stack_2_NOX !== 'N/A' ? data.stack_2_NOX : null,
            stack_2_Pressure: data.stack_2_Pressure !== 'N/A' ? data.stack_2_Pressure : null,
            stack_2_Flouride: data.stack_2_Flouride !== 'N/A' ? data.stack_2_Flouride : null,
            stack_2_PM: data.stack_2_PM !== 'N/A' ? data.stack_2_PM : null,
            stack_2_SO2: data.stack_2_SO2 !== 'N/A' ? data.stack_2_SO2 : null,
            stack_2_NO2: data.stack_2_NO2 !== 'N/A' ? data.stack_2_NO2 : null,
            stack_2_Mercury: data.stack_2_Mercury !== 'N/A' ? data.stack_2_Mercury : null,
            stack_2_PM10: data.stack_2_PM10 !== 'N/A' ? data.stack_2_PM10 : null,
            stack_2_PM25: data.stack_2_PM25 !== 'N/A' ? data.stack_2_PM25 : null,
            stack_2_NOH: data.stack_2_NOH !== 'N/A' ? data.stack_2_NOH : null,
            stack_2_NH3: data.stack_2_NH3 !== 'N/A' ? data.stack_2_NH3 : null,
            stack_2_WindSpeed: data.stack_2_WindSpeed !== 'N/A' ? data.stack_2_WindSpeed : null,
            stack_2_WindDir: data.stack_2_WindDir !== 'N/A' ? data.stack_2_WindDir : null,
            stack_2_AirTemperature: data.stack_2_AirTemperature !== 'N/A' ? data.stack_2_AirTemperature : null,
            stack_2_Humidity: data.stack_2_Humidity !== 'N/A' ? data.stack_2_Humidity : null,
            stack_2_solarRadiation: data.stack_2_solarRadiation !== 'N/A' ? data.stack_2_solarRadiation : null,
        
            // Add stack_2 fields
            STACK_32_Ammonia_flow: data.STACK_32_Ammonia_flow !== 'N/A' ? data.STACK_32_Ammonia_flow : null,
            STACK_32_Ammonia_CO: data.STACK_32_Ammonia_CO !== 'N/A' ? data.STACK_32_Ammonia_CO : null,
            STACK_32_Ammonia_NOX: data.STACK_32_Ammonia_NOX !== 'N/A' ? data.STACK_32_Ammonia_NOX : null,
            STACK_32_Ammonia_Pressure: data.STACK_32_Ammonia_Pressure !== 'N/A' ? data.STACK_32_Ammonia_Pressure : null,
            STACK_32_Ammonia_Flouride: data.STACK_32_Ammonia_Flouride !== 'N/A' ? data.STACK_32_Ammonia_Flouride : null,
            STACK_32_Ammonia_PM: data.STACK_32_Ammonia_PM !== 'N/A' ? data.STACK_32_Ammonia_PM : null,
            STACK_32_Ammonia_SO2: data.STACK_32_Ammonia_SO2 !== 'N/A' ? data.STACK_32_Ammonia_SO2 : null,
            STACK_32_Ammonia_NO2: data.STACK_32_Ammonia_NO2 !== 'N/A' ? data.STACK_32_Ammonia_NO2 : null,
            STACK_32_Ammonia_Mercury: data.STACK_32_Ammonia_Mercury !== 'N/A' ? data.STACK_32_Ammonia_Mercury : null,
            STACK_32_Ammonia_PM10: data.STACK_32_Ammonia_PM10 !== 'N/A' ? data.STACK_32_Ammonia_PM10 : null,
            STACK_32_Ammonia_PM25: data.STACK_32_Ammonia_PM25 !== 'N/A' ? data.STACK_32_Ammonia_PM25 : null,
            STACK_32_Ammonia_NOH: data.STACK_32_Ammonia_NOH !== 'N/A' ? data.STACK_32_Ammonia_NOH : null,
            STACK_32_Ammonia_NH3: data.STACK_32_Ammonia_NH3 !== 'N/A' ? data.STACK_32_Ammonia_NH3 : null,
            STACK_32_Ammonia_WindSpeed: data.STACK_32_Ammonia_WindSpeed !== 'N/A' ? data.STACK_32_Ammonia_WindSpeed : null,
            STACK_32_Ammonia_WindDir: data.STACK_32_Ammonia_WindDir !== 'N/A' ? data.STACK_32_Ammonia_WindDir : null,
            STACK_32_Ammonia_AirTemperature: data.STACK_32_Ammonia_AirTemperature !== 'N/A' ? data.STACK_32_Ammonia_AirTemperature : null,
            STACK_32_Ammonia_Humidity: data.STACK_32_Ammonia_Humidity !== 'N/A' ? data.STACK_32_Ammonia_Humidity : null,
            STACK_32_Ammonia_solarRadiation: data.STACK_32_Ammonia_solarRadiation !== 'N/A' ? data.STACK_32_Ammonia_solarRadiation : null,
        
            date: formattedDate,
            time: data.time !== 'N/A' ? data.time : moment().format('HH:mm:ss'),
            topic: data.topic,
            companyName: data.companyName,
            industryType: data.industryType,
            userName: data.userName || 'N/A',
            mobileNumber: data.mobileNumber || 'N/A',
            email: data.email || 'N/A',
            timestamp: new Date(),
            validationMessage: data.validationMessage || 'Validated',
            validationStatus: data.validationStatus || 'Valid',
        });
        

        await newEntry.save();
        console.log('New Ent:',newEntry)

           // Update the user's iotLastEnterDate
           const userUpdate = await userdb.findOneAndUpdate(
            { userName: data.userName },
            { iotLastEnterDate: formattedDate }, // Update with the latest incoming date
            { new: true } // Return the updated document
        );

        if (!userUpdate) {
            console.error('User not found or update failed');
            return res.status(404).json({ success: false, message: 'User not found or update failed' });
        }

        console.log('User Updated Successfully:', userUpdate);

         // Call handleExceedValues after saving the new IoT data entry
          await handleExceedValues();

        res.status(200).json({
            success: true,
            message: "New Entry data saved successfully",
            newEntry
        });
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).json({
            success: false,
            message: "Error saving data to MongoDB",
            error: error.message
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
                'stack_2_flow', 'STACK_32_Ammonia_flow', 'stack_2_CO', 'stack_2_NOX', 
                'stack_2_Pressure', 'stack_2_Flouride', 'stack_2_PM', 'stack_2_SO2', 
                'stack_2_NO2', 'stack_2_Mercury', 'stack_2_PM10', 'stack_2_PM25', 'stack_2_NOH', 
                'stack_2_NH3', 'stack_2_WindSpeed', 'stack_2_WindDir', 'stack_2_AirTemperature', 
                'stack_2_Humidity', 'stack_2_solarRadiation', 'STACK_32_Ammonia_CO', 
                'STACK_32_Ammonia_NOX', 'STACK_32_Ammonia_Pressure', 'STACK_32_Ammonia_Flouride', 
                'STACK_32_Ammonia_PM', 'STACK_32_Ammonia_SO2', 'STACK_32_Ammonia_NO2', 
                'STACK_32_Ammonia_Mercury', 'STACK_32_Ammonia_PM10', 'STACK_32_Ammonia_PM25', 
                'STACK_32_Ammonia_NOH', 'STACK_32_Ammonia_NH3', 'STACK_32_Ammonia_WindSpeed', 
                'STACK_32_Ammonia_WindDir', 'STACK_32_Ammonia_AirTemperature', 'STACK_32_Ammonia_Humidity', 
                'STACK_32_Ammonia_solarRadiation', 'topic', 'mobileNumber', 'email', 
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



const viewDataByDateAndUser = async (req, res) => {
    const { fromDate, toDate, userName } = req.query;

    try {
        // Assuming date is stored as 'DD-MM-YYYY' strings in MongoDB and no time zone adjustment is needed
        const formattedFromDate = moment(fromDate, 'DD-MM-YYYY').format('DD-MM-YYYY'); 
        const formattedToDate = moment(toDate, 'DD-MM-YYYY').format('DD-MM-YYYY');

        console.log("Formatted Dates:", { formattedFromDate, formattedToDate });

        const data = await IotData.find({
            userName: userName,
            date: {
                $gte: formattedFromDate,
                $lte: formattedToDate
            }
        }).lean();
        
        if (!data.length) {
            console.log("No data found with criteria:", { formattedFromDate, formattedToDate, userName });
            return res.status(404).json({ message: "No data record is saved on these dates for the given user." });
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
    viewDataByDateAndUser,deleteIotDataByDateAndUser
 }


  // const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    // const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
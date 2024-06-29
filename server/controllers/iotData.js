const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const IotData = require('../models/iotData')
const userdb = require('../models/user');
const IotDataAverage = require(`../models/averageData`);
const moment = require('moment');


//Function to check sensor data for zero values
const checkSensorData = (data)=>{
    //List of Sensor data fields to check
    const sensorDataFields = [
        'ph', 'tds', 'turbidity', 'temperature', 'bod', 'cod', 
        'tss', 'orp', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride'
    ];

    //Check if any sensor data field is zero
    for(let field of sensorDataFields){
        if(data[field]==="N/A"){
            return{
                success:false,
                message:`Problem in data: ${field} value is 0`,
                problemField:field
            }
        }
    }
    return {
        success: true,
        message: "All sensor data values are valid"
    }
}

// Function to handle Mqtt Messages and save the data to MongoDB
const handleSaveMessage = async (req, res) => {
    const data = req.body;

    try {
        const user = await userdb.findById(data.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const validationStatus = checkSensorData(data);
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
            date: formattedDate,
            time: data.time !== 'N/A' ? data.time : null,
            userId: data.userId || 'N/A',
            topic: data.topic,
            companyName: data.companyName,
            industryType: data.industryType,
            userName: data.userName || 'N/A',
            mobileNumber: data.mobileNumber || 'N/A',
            email: data.email || 'N/A',
            validationStatus: validationStatus.success,
            validationMessage: validationStatus.message,
            timestamp: new Date()
        });
        
        await newEntry.save();

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

const calculateAverages = async (userId, userName, startTime, endTime, interval) => {
    console.log(`Calculating averages for ${interval}: ${startTime} to ${endTime}`);
    const data = await IotData.find({
        userId: userId,
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

    const fields = ['ph', 'TDS', 'turbidity', 'temperature', 'BOD', 'COD', 'TSS', 'ORP', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride', 'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed', 'WindDir', 'AirTemperature', 'Humidity', 'solarRadiation', 'DB', 'inflow', 'finalflow', 'energy'];

    const averages = fields.reduce((acc, field) => {
        acc[field] = data.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0) / data.length;
        return acc;
    }, {});

    console.log(`Averages calculated for ${interval}:`, averages);

    const averageEntry = new IotDataAverage({
        userName: userName,
        interval: interval,
        dateAndTime: moment().format('DD/MM/YYYY HH:mm'),
        ...averages,
        timestamp: new Date()
    });

    await averageEntry.save();
    console.log(`Average entry saved for ${interval}:`, averageEntry);
};

const calculateAllAverages = async (userId, userName) => {
    const now = new Date();

    console.log(`Calculating all averages for user ${userName} (${userId})`);
    await calculateAverages(userId, userName, new Date(now.getTime() - 60 * 60 * 1000), now, 'hour');

    // Calculate daily average using 24-hour data
    const dailyStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const dailyEndTime = new Date(dailyStartTime.getTime() + 24 * 60 * 60 * 1000);
    await calculateAverages(userId, userName, dailyStartTime, dailyEndTime, 'day');

    // Calculate weekly average using 7-day data
    const weeklyStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
    const weeklyEndTime = now;
    await calculateAverages(userId, userName, weeklyStartTime, weeklyEndTime, 'week');

    // Calculate monthly average using 4-week data
    const monthlyStartTime = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const monthlyEndTime = now;
    await calculateAverages(userId, userName, monthlyStartTime, monthlyEndTime, 'month');

    // Calculate six-month average
    const sixMonthStartTime = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const sixMonthEndTime = now;
    await calculateAverages(userId, userName, sixMonthStartTime, sixMonthEndTime, 'sixmonths');

    // Calculate yearly average
    const yearlyStartTime = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const yearlyEndTime = now;
    await calculateAverages(userId, userName, yearlyStartTime, yearlyEndTime, 'year');
};

const calculateAndSaveAverages = async () => {
    const users = await IotData.distinct('userId');

    for (let userId of users) {
        const userData = await userdb.findById(userId);
        await calculateAllAverages(userId, userData.userName);
    }
};

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



const downloadIotData = async (req, res) => {
    try {
        const { fromDate, toDate, industryName, companyName, format } = req.query;

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
            return res.status(404).send('No data found for the specified criteria');
        }

        if (format === 'csv') {
            // Generate CSV
            const fields = ['userName', 'industryType', 'companyName', 'date', 'product_id', 'ph', 'TDS', 'turbidity', 'temperature', 'BOD', 'COD', 'TSS', 'ORP', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride', 'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed', 'WindDir', 'AirTemperature', 'Humidity', 'solarRadiation', 'DB', 'inflow', 'finalflow', 'energy'];
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

module.exports ={handleSaveMessage,calculateAndSaveAverages,getAllIotData, getLatestIoTData,getIotDataByUserName,
    downloadIotData,calculateAndSaveAverages,getAverageDataByUserName
 }
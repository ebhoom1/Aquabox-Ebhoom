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
const handleSaveMessage = async (data) => {
    try {
        const user = await userdb.findById(data.userId);

        if (!user) {
            throw new Error('User not found');
        }

        const validationStatus = checkSensorData(data);

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
            timestamp: new Date(),
            userId: data.userId || 'N/A',
            topic: data.topic,
            companyName: data.companyName || 'N/A',
            industryType: data.industryType || 'N/A',
            userName: data.userName || 'N/A',
            mobileNumber: data.mobileNumber || 'N/A',
            email: data.email || 'N/A',
            validationStatus: validationStatus.success,
            validationMessage: validationStatus.message
        });

        await newEntry.save();
        console.log('Data saved to DB');

        return {
            success: true,
            message: "New Entry data saved successfully",
            newEntry
        };
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        return {
            success: false,
            message: "Error saving data to MongoDB",
            error: error.message
        };
    }
};



const calculateAverage = async (userId, averageType, startTime, endTime, index) => {
    const data = await IotData.find({
        userId: userId,
        timestamp: {
            $gte: startTime,
            $lt: endTime
        }
    });

    if (data.length === 0) {
        return;
    }

    const fields = ['ph', 'TDS', 'turbidity', 'temperature', 
                    'BOD', 'COD', 'TSS', 'ORP', 'nitrate',
                     'ammonicalNitrogen', 'DO', 'chloride', 
                    'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed',
                    'WindDir', 'AirTemperature', 'Humidity', 
                    'solarRadiation', 'DB'];

    const averages = fields.reduce((acc, field) => {
        acc[field] = data.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0) / data.length;
        return acc;
    }, {});

    const getName = (averageType, index) => {
        const namesMap = {
            hour: [],
            day: [
                "12:00 am", "1:00 am", "2:00 am", "3:00 am", "4:00 am", 
                "5:00 am", "6:00 am", "7:00 am", "8:00 am", "9:00 am", 
                "10:00 am", "11:00 am", "12:00 pm"
            ],
            week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            month: ["1st week", "2nd week", "3rd week", "4th week"],
            sixmonth: ["Jan-June", "July-December"],
            year: []
        };

        if (averageType === 'year') {
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - index;
            return `${startYear}`;
        } else if (averageType === 'hour') {
            return `Hour ${index}`;
        }

        return namesMap[averageType][index % namesMap[averageType].length];
    };

    const averageEntry = new IotDataAverage({
        userId: userId,
        userName: data[0].userName,
        averageType: averageType,
        name: getName(averageType, index),
        ...averages
    });

    await averageEntry.save();
};

const calculateAndSaveAverages = async () => {
    const users = await IotData.distinct('userId');

    for (let userId of users) {
        const now = new Date();
        const intervals = [
            { type: 'hour', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1), endTime: now },
            { type: 'day', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), endTime: now },
            { type: 'week', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7), endTime: now },
            { type: 'month', startTime: new Date(now.getFullYear(), now.getMonth() - 1), endTime: now },
            { type: 'sixmonth', startTime: new Date(now.getFullYear(), now.getMonth() - 6), endTime: now },
            { type: 'year', startTime: new Date(now.getFullYear() - 1), endTime: now }
        ];

        for (let i = 0; i < intervals.length; i++) {
            const { type, startTime, endTime } = intervals[i];
            await calculateAverage(userId, type, startTime, endTime, i);
        }
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

const getIotDataByTimeInterval = async (req,res) =>{
    const {userName, interval} = req.params;
    const now = new Date();

    let startTime;

    switch(interval) {
        case 'today':
            startTime = moment().startOf('day').toDate();
            break;
        case 'week':
            startTime = moment().subtract(7,'days').toDate();
            break;
        case 'month':
            startTime = moment().subtract(1,'month').toDate();
            break;
        case '6months':
            startTime = moment().subtract(6,'months').toDate();
            break;
        case 'year':
            startTime = moment().subtract(1, 'year').toDate();
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Invalid interval specified'
            });       

    }
    try{
        const data =await IotData.find({
            userName,
            timeStamp:{$gte: startTime, $lt:now}
        });
        
      if(data.length === 0){
            return res.status(404).json({
                success: false,
                message: 'No data found for the specified interval'
            })
      }
        const fields = ['ph', 'TDS', 'turbidity', 'temperature', 'BOD', 'COD', 'TSS', 'ORP', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride',];
        const averages = fields.reduce((acc, field) => {
            acc[field] = data.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0) / data.length;
            return acc;
        }, {});
        const intervalData = new IotDataAverage ({
            userName,
            interval,
            ...averages
        })
        await intervalData.save();
       
        res.status(200).json({
            success: true,
            data: intervalData
        });
    }catch(error){
        console.error(`Error fetching IoT data for ${interval} interval:`, error);
        res.status(500).json({
            success: false,
            message: 'Error fetching IoT data',
            error: error.message
        });
    }
}



const downloadIotData = async (req, res) => {
    try {
        const { userName, industryType, fromDate, toDate, format } = req.query;

        // Validate input
        if (!userName || !industryType || !fromDate || !toDate) {
            return res.status(400).send('Missing required query parameters');
        }

       // Find IoT data based on filters
       const data = await IotData.find({
        userName,
        industryType,
        timestamp: {
            $gte: from,
            $lte: to,
        },
    });
    if (format === 'csv') {
        // Generate CSV
        const fields = ['userName', 'industryType', 'timestamp', 'product_id', 'ph', 'TDS', 'turbidity', 'temperature', 'BOD', 'COD', 'TSS', 'ORP', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride', 'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed', 'WindDir', 'AirTemperature', 'Humidity', 'solarRadiation', 'DB'];
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
        doc.fontSize(12).text(`Industry Type: ${industryType}`);
        doc.fontSize(12).text(`Date Range: ${moment(from).format('YYYY/MM/DD')} - ${moment(to).format('YYYY/MM/DD')}`);

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
}

module.exports ={handleSaveMessage,calculateAndSaveAverages,getAllIotData, getLatestIoTData,getIotDataByUserName,getIotDataByTimeInterval,
    downloadIotData
 }
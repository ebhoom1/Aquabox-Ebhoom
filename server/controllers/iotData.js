const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const IotData = require('../models/iotData')
const userdb = require('../models/user');
const IotDataAverage = require(`../models/averageData`);



//Function to check sensor data for zero values
const checkSensorData = (data)=>{
    //List of Sensor data fields to check
    const sensorDataFields = [
        'ph', 'tds', 'turbidity', 'temperature', 'bod', 'cod', 
        'tss', 'orp', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride'
    ];

    //Check if any sensor data field is zero
    for(let field of sensorDataFields){
        if(data[field]===0){
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
        // Fetch user information from the database
        const user = await userdb.findById(data.userId);

        if (!user) {
            throw new Error('User not found');
        }

       //Validate the sensor data
       const validationStatus = checkSensorData(data);

       

        // Create a new document based on the received data
        const newEntry = new IotData({
            product_id:data.product_id,
            ph: data.ph || null,
            TDS: data.tds || null,
            turbidity: data.turbidity || null,
            temperature: data.temperature || null,
            BOD: data.bod || null,
            COD: data.cod || null,
            TSS: data.tss || null,
            ORP: data.orp || null,
            nitrate: data.nitrate || null,
            ammonicalNitrogen: data.ammonicalNitrogen || null,
            DO: data.DO || null,
            chloride: data.chloride || null,
            timestamp: new Date(),
            userId: data.userId,
            topic:data.topic,
            companyName:data.compayName,
            industryType:data.industryType,
            userName: data.userName, 
            mobileNumber:data.mobileNumber,
            email:data.email,
            validationStatus:validationStatus.success,
            validationMessage:validationStatus.message
        });

        // Log the new entry object
        console.log('New Entry:', newEntry);

        // Save the document to db
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



const getAverageIotData = async(req,res)=>{
    try {
        const {userName} = req.params;
        
        const userIoTdata = await IotDataAverage.find({userName})

        if(!userIoTdata){
            res.status(404).json({message:'User Not found'})
        }
        res.status(200).json({
            status:200,
            success:true,
            message:'Fetched Iot average value',
            userIoTdata
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error in Fetching IoT Data of User`,
            error: error.message,
          });
    }
}

const downloadIotData = async (req, res) => {
    const { dateFrom, dateTo, industry, company, format } = req.body;

    try {
        const query = {
            timestamp: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
            industry,
            company
        };

        const data = await IotData.find(query);

        if (format === 'csv') {
            const fields = Object.keys(data[0].toObject());
            const parser = new Parser({ fields });
            const csv = parser.parse(data);

            res.header('Content-Type', 'text/csv');
            res.attachment('iot_data.csv');
            return res.send(csv);
        } else if (format === 'pdf') {
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment('iot_data.pdf');

            doc.pipe(res);
            doc.text(JSON.stringify(data, null, 2));
            doc.end();
        } else {
            return res.status(400).json({ message: 'Invalid format specified' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
}

module.exports ={handleSaveMessage,calculateAndSaveAverages,getAllIotData, getLatestIoTData,getIotDataByUserName,getAverageIotData,
    downloadIotData
 }
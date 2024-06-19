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


const calculateAverage = async ( userId, averageType, startTime,endTime) =>{
    const data =await IotData.find({
        userId:userId,
        timestamp:{
            $gte:startTime,
            $lt:endTime
        }
    });

    if(data.length === 0){
        return;
    }
    const fields =['ph', 'TDS', 'turbidity', 'temperature', 
                    'BOD', 'COD', 'TSS', 'ORP', 'nitrate',
                     'ammonicalNitrogen','DO', 'chloride', 
                    'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed',
                    'WindDir', 'AirTemperature', 'Humidity', 
                    'solarRadiation', 'DB'];

    const averages=fields.reduce((acc,fields)=>{
        acc[fields] = data.reduce((sum,item)=> sum + parseFloat(item[fields] || 0),0) /data.length;
        return acc;
    },{});

    const averageEntry = new IotDataAverage({
        userId:userId,
        userName:data[0].userName,
        averageType:averageType,
        ...averages
    });
    await averageEntry.save();
};

const calculateAndSaveAverages = async () =>{
    const users = await IotData.distinct('userId');

    for(let userId of users){
        const now = new Date();

        //Hourly average
        await calculateAverage(userId,'hour', new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours()-1),now);

        //Daily average
        await calculateAverage(userId,'day', new Date(now.getFullYear(),now.getMonth(),now.getDate()-1),now);

        //Monthly average
        await calculateAverage(userId,'month', new Date(now.getFullYear(),now.getMonth()-1),now);

        //Six-monthly average
        await calculateAverage(userId,'sixmonth', new Date(now.getFullYear(), now.getMonth()-6),now);


        //Yearly average
        await calculateAverage(userId, 'year',new Date(now.getFullYear()-1),now);

    }
}

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

module.exports ={handleSaveMessage,calculateAndSaveAverages,getAllIotData, getLatestIoTData,getIotDataByUserName,getAverageIotData }
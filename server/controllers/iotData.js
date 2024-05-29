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
            userName: data.userName, 
            // mobileNumber:data.mobileNumber,
            // email:data.email,
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


module.exports ={handleSaveMessage, calculateAndSaveAverages}
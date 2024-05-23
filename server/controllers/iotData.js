const IotData = require('../models/iotData')


//Function to handle Mqtt Messages and save the data to MongoDB
const handleSaveMessage = async (data) => {
    try {
        // Create a new document based on the received data
        const newEntry = new IotData({
            ph: data.ph,
            TDS: data.tds,
            turbidity: data.turbidity,
            temperature: data.temperature,
            BOD: data.bod,
            COD: data.cod,
            TSS: data.tss,
            ORP: data.orp,
            nitrate: data.nitrate,
            ammonicalNitrogen: data.ammonicalNitrogen,
            DO: data.DO,
            chloride: data.chloride,
            timestamp: new Date()
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


module.exports ={handleSaveMessage}
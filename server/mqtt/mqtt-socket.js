const mqtt = require('mqtt');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const iotData = require('../controllers/iotData');
const calibrationExceed = require('../controllers/calibrationExceed');

// Define the paths to the certificates
const KEY = path.resolve(__dirname, './creds/ebhoom-v1-device-private.pem.key');
const CERT = path.resolve(__dirname, './creds/ebhoom-v1-device-certificate.pem.crt');
const CAfile = path.resolve(__dirname, './creds/ebhoom-v1-device-AmazonRootCA1.pem');

// Function to check sensor data for zero values
const checkSensorData = (data) => {
    // List of Sensor data fields to check
    const sensorDataFields = [
        'ph', 'tds', 'turbidity', 'temperature', 'bod', 'cod', 
        'tss', 'orp', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride','inflow',
        'finalflow','energy','PM10','PM25','NOH','NH3','WindSpeed','WindDir',
        'AirTemperature','Humidity','solarRadiation','DB'
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

// Function to set up MQTT client for each device
const setupMqttClient = (io, productIDMap) => {
    const options = {
        host: "a3gtwu0ec0i4y6-ats.iot.ap-south-1.amazonaws.com",
        protocol: 'mqtts',
        keepalive: 30,
        clientId: "Ebhoom2023",
        clean: true,
        key: fs.readFileSync(KEY),
        cert: fs.readFileSync(CERT),
        ca: fs.readFileSync(CAfile),
    };
    
    const client = mqtt.connect(options);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe('ebhoomPub', (err) => {
            if (!err) {
                console.log('Subscribed to topic: ebhoomPub');
            } else {
                console.error('Subscription error:', err);
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());
            const { product_id } = data;

            if (topic === 'ebhoomPub' && productIDMap[product_id]) {
                const userDetails = productIDMap[product_id];
                Object.assign(data, userDetails);

                // Add formatted timestamp
                data.timestamp = moment().format('DD/MM/YYYY');

                // Check sensor data
                const validationStatus = checkSensorData(data);
                if (!validationStatus.success) {
                    console.error(validationStatus.message);
                    return;
                }

                // Send POST request
                await axios.post('http://localhost:5555/api/handleSaveMessage', data);

                 // Send POST request for handling exceed values
                 await axios.post('http://localhost:5555/api/handleExceedValues', data);

                io.to(product_id.toString()).emit('data', data);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT error:', err);
    });

    return client;
};

module.exports = setupMqttClient;

const mqtt = require('mqtt');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const userdb = require('../models/user');

// Define the paths to the certificates
const KEY = path.resolve(__dirname, './creds/ebhoom-v1-device-private.pem.key');
const CERT = path.resolve(__dirname, './creds/ebhoom-v1-device-certificate.pem.crt');
const CAfile = path.resolve(__dirname, './creds/ebhoom-v1-device-AmazonRootCA1.pem');

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

// Function to check sensor data for zero values
const checkSensorData = (data) => {
    const sensorDataFields = [
        'ph', 'tds', 'turbidity', 'temperature', 'bod', 'cod',
        'tss', 'orp', 'nitrate', 'ammonicalNitrogen', 'DO', 'chloride', 'inflow',
        'finalflow', 'energy', 'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed', 'WindDir',
        'AirTemperature', 'Humidity', 'solarRadiation', 'DB'
    ];

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
const setupMqttClient = (io) => {
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
            console.log('Message received:', message.toString());
            const data = JSON.parse(message.toString());
            const { product_id } = data;

            if (topic === 'ebhoomPub') {
                const userDetails = await userdb.findOne({ productID: product_id });
                if (userDetails) {
                    Object.assign(data, {
                        userId: userDetails._id,
                        userName: userDetails.userName,
                        email: userDetails.email,
                        mobileNumber: userDetails.mobileNumber,
                        companyName: userDetails.companyName,
                        industryType: userDetails.industryType
                    });

                    // Add formatted timestamp
                    data.timestamp = moment().format('DD/MM/YYYY');

                    console.log('Received data:', data);

                    // Check required fields
                    const requiredFields = ['userName', 'companyName', 'industryType', 'mobileNumber', 'email', 'product_id', 'energy', 'time'];
                    const validationStatus = checkRequiredFields(data, requiredFields);
                    if (!validationStatus.success) {
                        console.error(validationStatus.message);
                        return;
                    }

                    // Check sensor data
                    const sensorValidationStatus = checkSensorData(data);
                    if (!sensorValidationStatus.success) {
                        console.error(sensorValidationStatus.message);
                        return;
                    }

                    console.log('Data to be posted:', data);

                    // Send POST request
                    await axios.post('http://localhost:5555/api/handleSaveMessage', data);
                    console.log('Data successfully posted to handleSaveMessage');

                    // Send POST request for handling exceed values
                    await axios.post('http://localhost:5555/api/handleExceedValues', data);
                    console.log('Data successfully posted to handleExceedValues');

                    io.to(product_id.toString()).emit('data', data);
                    console.log('Data posted and emitted:', data);
                } else {
                    console.error(`No user details found for product_id: ${product_id}`);
                }
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

// Initialize all MQTT clients at server startup
const initializeMqttClients = async (io) => {
    try {
        setupMqttClient(io);
        console.log('All MQTT clients initialized.');
    } catch (error) {
        console.error('Error initializing MQTT clients:', error);
    }
};

module.exports = { setupMqttClient, initializeMqttClients };

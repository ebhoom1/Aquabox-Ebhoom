const mqtt = require('mqtt');
const path = require('path');
const fs = require('fs');
const CalibrationExceed = require('../models/calibrationExceed'); // Adjust the path as necessary

const KEY = path.resolve(__dirname, './creds/ebhoom-v1-device-private.pem.key');
const CERT = path.resolve(__dirname, './creds/ebhoom-v1-device-certificate.pem.crt');
const CAfile = path.resolve(__dirname, './creds/ebhoom-v1-device-AmazonRootCA1.pem');

const setupMqttClient = (io) => {
    // MQTT connection options
    const options = {
        host: 'a3gtwu0ec0i4y6-ats.iot.ap-south-1.amazonaws.com',
        protocol: 'mqtts', // Use 'mqtts' for secure connection
        keepalive: 30,
        clientId: 'sijo1234',
        clean: true,
        key: fs.readFileSync(KEY),
        cert: fs.readFileSync(CERT),
        ca: fs.readFileSync(CAfile),
    };

    // Create MQTT client and connect to the broker
    const client = mqtt.connect(options);

    // Handle MQTT client events
    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe('ebhoomPub', (err) => {
            if (!err) {
                console.log('Subscribed to topic');
            } else {
                console.error('Subscription error:', err);
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received message:', data);

            // Check the topic and handle accordingly
            if (topic === 'ebhoomPub' && data && data.product_id) {
                console.log('Data to be saved:', data);

                // Create a new document based on the received data
                const newEntry = new CalibrationExceed({
                    pH: data.ph,
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

                // Save the document to MongoDB
                await newEntry.save();
                console.log('Data saved to MongoDB');

                // Emit data to connected clients
                io.to(data.product_id.toString()).emit('data', data);
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

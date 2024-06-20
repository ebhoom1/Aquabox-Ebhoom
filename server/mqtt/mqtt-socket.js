const mqtt = require('mqtt');
const path = require('path');
const fs = require('fs');
const iotData = require('../controllers/iotData');
const calibrationExceed = require('../controllers/calibrationExceed');

// Define the paths to the certificates
const KEY = path.resolve(__dirname, './creds/ebhoom-v1-device-private.pem.key');
const CERT = path.resolve(__dirname, './creds/ebhoom-v1-device-certificate.pem.crt');
const CAfile = path.resolve(__dirname, './creds/ebhoom-v1-device-AmazonRootCA1.pem');

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

                await iotData.handleSaveMessage(data);
                await calibrationExceed.handleExceedValues(data);
                
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

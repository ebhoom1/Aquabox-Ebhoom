const mqtt = require('mqtt');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const userdb = require('../models/user');

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Define the paths to the certificates
const KEY = path.resolve(__dirname, './creds/ebhoom-v1-device-private.pem.key');
const CERT = path.resolve(__dirname, './creds/ebhoom-v1-device-certificate.pem.crt');
const CAfile = path.resolve(__dirname, './creds/ebhoom-v1-device-AmazonRootCA1.pem');

// Function to set up MQTT client for each device
const setupMqttClient = (io, retries = 0) => {
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
                //  console.log('Subscribed to topic: ebhoomPub');
            } else {
                console.error('Subscription error:', err);
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            console.log('Received message on topic:', topic);
        console.log('Message:', message.toString());

            const data = JSON.parse(message.toString());
            const { product_id } = data;

            if (topic === 'ebhoomPub') {
                const userDetails = await userdb.findOne({ productID: product_id });
                if (userDetails) {
                    Object.assign(data, {
                        userName: userDetails.userName,
                        email: userDetails.email,
                        mobileNumber: userDetails.mobileNumber,
                        companyName: userDetails.companyName,
                        industryType: userDetails.industryType,
                        timestamp: moment().format('DD/MM/YYYY'),
                        time: data.time || moment().format('HH:mm:ss') // Set default time if not provided
                    });
  
                    await axios.post('http://13.233.106.171:5555/api/handleSaveMessage', data);
                    io.to(product_id.toString()).emit('data', data);
                    console.log('Data entered',data)
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
        if (err.code === 'ENOTFOUND' && retries < MAX_RETRIES) {
            console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
            setTimeout(() => setupMqttClient(io, retries + 1), RETRY_DELAY);
        }
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

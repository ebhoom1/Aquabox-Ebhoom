const mqtt = require('mqtt');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const userdb = require('../models/user'); // Import user schema

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const KEY = path.resolve(__dirname, './creds/ebhoom-v1-device-private.pem.key');
const CERT = path.resolve(__dirname, './creds/ebhoom-v1-device-certificate.pem.crt');
const CAfile = path.resolve(__dirname, './creds/ebhoom-v1-device-AmazonRootCA1.pem');

// Setup MQTT client
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
            if (err) console.error('Subscription error:', err);
        });
    });

    client.on('message', async (topic, message) => {
        try {
            console.log('Received message on topic:', topic);
            console.log('Message:', message.toString());

            const data = JSON.parse(message.toString()); // Ensure message is parsed

            if (!Array.isArray(data)) {
                console.error('Received data is not an array.');
                return;
            }

            for (const item of data) {
                const { product_id, userName, stacks } = item;

                // Validate input
                if (!product_id || !userName || !Array.isArray(stacks) || stacks.length === 0) {
                    console.error('Invalid data: Missing product_id, userName, or stack data.');
                    continue;
                }

                const stackNames = stacks.map((stack) => stack.stackName);

                // Find matching user in the database
                const userDetails = await userdb.findOne({
                    productID: product_id,
                    userName,
                    stackName: { $in: stackNames },
                });

                if (!userDetails) {
                    console.error(`No matching user found for product_id: ${product_id}, userName: ${userName}`);
                    continue;
                }

                // Prepare payload
                const payload = {
                    product_id,
                    userName: userDetails.userName,
                    email: userDetails.email,
                    mobileNumber: userDetails.mobileNumber,
                    companyName: userDetails.companyName,
                    industryType: userDetails.industryType,
                    stackData: stacks.map((stack) => ({
                        stackName: stack.stackName,
                        ...Object.fromEntries(
                            Object.entries(stack).filter(([key, value]) => key !== 'stackName' && value !== 'N/A')
                        ),
                    })),
                    date: moment().format('DD/MM/YYYY'),
                    time: item.time || moment().format('HH:mm:ss'),
                    validationStatus: 'Valid',
                    validationMessage: 'Validated',
                    timestamp: new Date(),
                };

                // Send the data to the API endpoint
                await axios.post('https://api.ocems.ebhoom.com/api/handleSaveMessage', payload);
                io.to(product_id.toString()).emit('data', payload);

                console.log('Data successfully sent:', payload);
            }
        } catch (error) {
            console.error('Error handling MQTT message:', error);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT error:', err);
        if (retries < MAX_RETRIES) {
            console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
            setTimeout(() => setupMqttClient(io, retries + 1), RETRY_DELAY);
        }
    });

    return client;
};

// Initialize MQTT clients at server startup
const initializeMqttClients = async (io) => {
    try {
        setupMqttClient(io);
        console.log('All MQTT clients initialized.');
    } catch (error) {
        console.error('Error initializing MQTT clients:', error);
    }
};

module.exports = { setupMqttClient, initializeMqttClients };

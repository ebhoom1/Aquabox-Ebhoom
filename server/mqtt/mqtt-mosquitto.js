const mqtt = require('mqtt');
const axios = require('axios');
const moment = require('moment-timezone'); // Use moment-timezone for accurate timezones
const userdb = require('../models/user'); // Import user schema

const RETRY_DELAY = 5000; // 5 seconds

// MQTT Connection Options
const options = {
    host: '3.110.40.48',
    port: 1883,
    clientId: `EbhoomSubscriber-${Math.random().toString(16).substr(2, 8)}`,
    protocol: 'mqtt',
    keepalive: 300,
    reconnectPeriod: RETRY_DELAY,
    clean: false,
    connectTimeout: 60000,
    pingTimeout: 120000,
};

// Setup MQTT Client
const setupMqttClient = (io) => {
    const client = mqtt.connect(options);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');

        // Subscribe to the topic only on a successful connection
        client.subscribe('ebhoomPub', (err) => {
            if (err) {
                console.error('Subscription error:', err);
            } else {
                console.log('Subscribed to topic: ebhoomPub');
            }
        });
    });

    // Handle Incoming Messages
    client.on('message', async (topic, message) => {
        try {
            // console.log(`Received message on topic: ${topic}`);
            const messageString = message.toString();
            // console.log('Message:', messageString);

            let data;
            try {
                data = JSON.parse(messageString); // Try parsing JSON
                data = Array.isArray(data) ? data : [data]; // Ensure it's an array
            } catch (parseError) {
                console.log('Invalid JSON. Treating message as plain string.');
                data = [{ message: messageString }];
            }

            const time = moment().tz('Asia/Kolkata').format('HH:mm:ss');
            const timestamp = moment().tz('Asia/Kolkata').toDate();

            for (const item of data) {
                const { product_id, userName, stacks } = item;

                if (!product_id || !userName || !Array.isArray(stacks) || stacks.length === 0) {
                    console.error('Invalid data: Missing product_id, userName, or stack data.');
                    continue;
                }

                const stackNames = stacks.map(stack => stack.stackName);

                const userDetails = await userdb.findOne({
                    productID: product_id,
                    userName,
                    stackName: { 
                        $elemMatch: { name: { $in: stackNames } } 
                    },
                });

                if (!userDetails) {
                    console.error(`No matching user found for product_id: ${product_id}, userName: ${userName}`);
                    continue;
                }

                const payload = {
                    product_id,
                    userName: userDetails.userName,
                    email: userDetails.email,
                    mobileNumber: userDetails.mobileNumber,
                    companyName: userDetails.companyName,
                    industryType: userDetails.industryType,
                    stackData: stacks.map(stack => ({
                        stackName: stack.stackName,
                        ...Object.fromEntries(
                            Object.entries(stack).filter(([key, value]) => key !== 'stackName' && value !== 'N/A')
                        ),
                    })),
                    date: moment().format('DD/MM/YYYY'),
                    time,
                    validationStatus: 'Valid',
                    validationMessage: 'Validated',
                    timestamp: new Date(),    
                };

                await axios.post('http://localhost:5555/api/handleSaveMessage', payload);
                io.to(product_id.toString()).emit('data', payload);

                 console.log('Data successfully sent:', payload);
            }
        } catch (error) {
            console.error('Error handling MQTT message:', error);
        }
    });

    // Handle MQTT Errors
    client.on('error', (err) => {
        console.error('MQTT error:', err);
        console.log('Attempting to reconnect...');
    });

    // Handle Disconnections
    client.on('close', () => {
        console.warn(`Disconnected from broker at ${new Date().toLocaleString()}`);
    });

    // Reconnection Logic
    client.on('reconnect', () => {
        console.log('Reconnecting to MQTT broker...');
    });

    return client;
};

// Initialize MQTT Clients at Server Startup
const initializeMqttClients = async (io) => {
    try {
        setupMqttClient(io);
        console.log('All MQTT clients initialized.');
    } catch (error) {
        console.error('Error initializing MQTT clients:', error);
    }
};

module.exports = { setupMqttClient, initializeMqttClients };

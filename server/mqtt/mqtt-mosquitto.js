const mqtt = require('mqtt');
const axios = require('axios');
const moment = require('moment');
const userdb = require('../models/user'); // Import user schema

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Mosquitto MQTT connection options
const options = {
    host: '13.201.137.182',  // Your EC2 public IP for Mosquitto broker
    port: 1883,              // Default MQTT port
    clientId: 'EbhoomSubscriber',
    protocol: 'mqtt',         // Use 'mqtt' protocol
    keepalive: 30,            // Keep connection alive for 30 seconds
    clean: true,              // Clean session
};

const setupMqttClient = (io, retries = 0) => {
    const client = mqtt.connect(options);

    // On successful connection
    client.on('connect', () => {
        console.log('Connected to MQTT broker');

        // Subscribe to the `ebhoomPub` topic
        client.subscribe('ebhoomPub', (err) => {
            if (err) {
                console.error('Subscription error:', err);
            } else {
                console.log('Subscribed to topic: ebhoomPub');
            }
        });
    });

    // On receiving a message
    client.on('message', async (topic, message) => {
        try {
            console.log('Received message on topic:', topic);
            console.log('Message:', message.toString());

            const data = JSON.parse(message.toString()); // Ensure message is parsed

            if (!Array.isArray(data)) {
                console.error('Received data is not an array.');
                return;
            }
                // Adjust to your local timezone
                const time = moment().tz('Asia/Kolkata').format('HH:mm:ss');
                const timestamp = moment().tz('Asia/Kolkata').toDate();
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
                    time: time,
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

    // Handle connection errors
    client.on('error', (err) => {
        console.error('MQTT error:', err);
        if (retries < MAX_RETRIES) {
            console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
            setTimeout(() => setupMqttClient(io, retries + 1), RETRY_DELAY);
        } else {
            client.end();
        }
    });

    // Handle disconnection
    client.on('close', () => {
        console.log('Disconnected from broker');
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

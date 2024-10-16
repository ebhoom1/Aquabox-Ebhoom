const mqtt = require('mqtt');
const axios = require('axios');
const moment = require('moment-timezone'); // Ensure moment-timezone is used for correct timezones
const userdb = require('../models/user'); // Import user schema

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// Mosquitto MQTT connection options
const options = {
    host: '3.110.40.48',
    port: 1883,
    clientId: `EbhoomSubscriber-${Math.random().toString(16).substr(2, 8)}`,
    protocol: 'mqtt',
    keepalive: 300,
    reconnectPeriod: 5000, 
    clean: false,
    connectTimeout: 60000,
    pingTimeout: 120000
};

const setupMqttClient = (io, retries = 0) => {
    const client = mqtt.connect(options);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe('ebhoomPub', (err) => {
            if (err) console.error('Subscription error:', err);
            else console.log('Subscribed to topic: ebhoomPub');
        });
    });

    client.on('message', async (topic, message) => {
        try {
            console.log('Received message on topic:', topic);
            const messageString = message.toString();
            console.log('Message:', messageString);

            // Parse the incoming JSON message
            let data = JSON.parse(messageString);

            // Handle both array and object payloads
            data = Array.isArray(data) ? data : [data];

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
                    stackName: { $in: stackNames }
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
                        )
                    })),
                    date: moment().format('DD/MM/YYYY'),
                    time: time,
                    validationStatus: 'Valid',
                    validationMessage: 'Validated',
                    timestamp: new Date()
                };

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
        } else {
            client.end();
        }
    });

    client.on('close', () => {
        console.warn(`Disconnected from broker at ${new Date().toLocaleString()}`);
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            console.log(`Reconnecting attempt ${reconnectAttempts} in 5 seconds...`);
            setTimeout(() => client.reconnect(), 5000);
        } else {
            console.error('Max reconnect attempts reached. Exiting.');
            client.end();
        }
    });

    client.on('reconnect', () => {
        console.log('Reconnecting to broker...');
    });

    return client;
};

const initializeMqttClients = async (io) => {
    try {
        setupMqttClient(io);
        console.log('All MQTT clients initialized.');
    } catch (error) {
        console.error('Error initializing MQTT clients:', error);
    }
};

module.exports = { setupMqttClient, initializeMqttClients };

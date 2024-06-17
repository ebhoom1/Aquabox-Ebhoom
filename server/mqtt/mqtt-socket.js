const mqtt = require('mqtt');
const path = require('path');
const fs = require('fs');
const iotData =require('../controllers/iotData');
const calibrationExceed =require('../controllers/calibrationExceed')





const setupMqttClient = (io, deviceCredentials) => {
    const { host, clientId, key, cert, ca, userId,userName,email,mobileNumber,topic} = deviceCredentials;

    if (!host || !clientId || !key || !cert || !ca) {
        console.error('Invalid device credentials:', deviceCredentials);
        return;
    }

    const options = {
        host,
        protocol: 'mqtts',
        keepalive: 30,
        clientId,
        clean: true,
        key: Buffer.from(key, 'base64'),
        cert: Buffer.from(cert, 'base64'),
        ca: Buffer.from(ca, 'base64')
    };

    const client = mqtt.connect(options);

    client.on('connect', () => {
         console.log(`Connected to MQTT broker for clientId: ${clientId}`);
        client.subscribe('ebhoomPub', (err) => {
            if (!err) {
                 console.log(`Subscribed to topic for clientId: ${clientId}`);
            } else {
                 console.error(`Subscription error for clientId: ${clientId}:`, err);
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());
           console.log(`Received message for clientId: ${clientId}:`, data);

            // Include user information in the data
           
            data.userId = userId;
            data.userName = userName;
            data.mobileNumber =mobileNumber;
            data.email = email;
            // data.topic =topic;

            if (topic === 'ebhoomPub' && data && data.product_id) {
                await iotData.handleSaveMessage(data);
                 await calibrationExceed.handleExceedValues(data);
                
                io.to(data.product_id.toString()).emit('data', data);
            }
        } catch (error) {
            console.error(`Error handling message for clientId: ${clientId}:`, error);
        }
    });

    client.on('error', (err) => {
        console.error(`MQTT error for clientId: ${clientId}:`, err);
    });

    return client;
};



module.exports = setupMqttClient;




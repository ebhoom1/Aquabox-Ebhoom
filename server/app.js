// app.js or server.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const DB = require('./config/DB');
const userRoutes = require('./routers/user');
const calibrationRoutes = require('./routers/calibration');
const notificationRoutes = require('./routers/notification');
const calibrationExceedRoutes= require('./routers/calibrationExceed')
const MqttSocket = require('./mqtt/mqtt-socket')
const socketIO = require('socket.io'); 
const app = express();
const port = process.env.PORT || 5555;

// Database connection
DB();

// Middleware
app.use(cors({
    origin:['http://localhost:3000','https://aquabox-ebhoom-3.onrender.com','http://localhost:3001','http://localhost:3002'] ,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api', userRoutes);
app.use('/api', calibrationRoutes);
app.use('/api', notificationRoutes);
app.use('/api', calibrationExceedRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server and set up Socket.IO
const server = app.listen(port, () => {
    console.log(`Server Connected - ${port}`);
});

const io = socketIO(server);

// Initialize MQTT Socket with Socket.IO and active_users (if needed)
const active_users = {}; // Replace this with your actual active users object if needed
const mqttSocket = new MqttSocket(io, active_users);

// Ensure MQTT client is running
mqttSocket.client.on('connect', () => {
    console.log('MQTT client connected');
});
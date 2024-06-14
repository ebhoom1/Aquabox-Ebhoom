// app.js or server.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path'); // Add this line
const DB = require('./config/DB');

const userRoutes = require('./routers/user');
const calibrationRoutes = require('./routers/calibration');
const notificationRoutes = require('./routers/notification');
const calibrationExceedRoutes= require('./routers/calibrationExceed');
const calibrationExceedValuesRoute = require('./routers/calibrationExceedValues');
const calculateAverageRoute = require('./routers/calculateAverage');
const reportRoutes=require('./routers/report');


 
const { getAllDeviceCredentials } = require('./controllers/user');
const setupMqttClient = require('./mqtt/mqtt-socket');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const port = process.env.PORT || 5555;
const server = http.createServer(app);
const io = socketIO(server);
const cron = require('node-cron');
const { calculateAndSaveAverages } = require('./controllers/iotData');

// Database connection
DB();



// Middleware
app.use(cors({
    origin:['http://localhost:3000','http://13.202.11.195:5555','http://13.202.11.195:3000'] ,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api', userRoutes);
app.use('/api', calibrationRoutes);
app.use('/api', notificationRoutes);
app.use('/api', calibrationExceedRoutes);
app.use('/api', calibrationExceedValuesRoute);
app.use('/api', calculateAverageRoute);
app.use('/api', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Schedule the averages calculation every hour
cron.schedule('0 * * * *', async () => {
    await calculateAndSaveAverages();
    console.log('Averages calculated and saved.');
});

// Initialize all MQTT clients at server startup
const initializeMqttClients = async (io) => {
    try {
        const allDeviceCredentials = await getAllDeviceCredentials();
        allDeviceCredentials.forEach(({ userId,userName,email,mobileNumber, deviceCredentials }) => {
            if (deviceCredentials && deviceCredentials.host && deviceCredentials.clientId && deviceCredentials.key && deviceCredentials.cert && deviceCredentials.ca) {
                try {
                    setupMqttClient(io, { ...deviceCredentials, userId, userName,email,mobileNumber });
                } catch (error) {
                    // console.error(`Error setting up MQTT client for user ${userId}:`, error);
                }
            } else {
                // console.log(`No valid device credentials for user ${userId}`);
            }
        });
        console.log('All MQTT clients initialized.');
    } catch (error) {
        console.error('Error initializing MQTT clients:', error);
    }
};

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// All other requests should be handled by React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
  

// Start the server and set up Socket.IO
server.listen(port, () => {
    console.log(`Server Connected - ${port}`);
//initializeMqttClients(io); // Initialize all MQTT clients at startup
});
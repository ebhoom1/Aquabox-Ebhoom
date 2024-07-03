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
const calibrationExceedRoutes = require('./routers/calibrationExceed');
const calibrationExceedValuesRoute = require('./routers/calibrationExceedValues');
const calculateAverageRoute = require('./routers/calculateAverage');
const reportRoutes = require('./routers/report');
const paymentRoutes = require('./routers/payment');
const liveVideoRoutes = require('./routers/liveVideo');
const saveWaterParamsRoutes = require('./routers/saveWaterParams');

const { calculateAndSaveDailyDifferences } = require('./controllers/iotData');
const { getAllDeviceCredentials } = require('./controllers/user');
const { initializeMqttClients } = require('./mqtt/mqtt-socket'); // Updated import
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const port = process.env.PORT || 5555;
const server = http.createServer(app);
const io = socketIO(server);
const cron = require('node-cron');
const { calculateAndSaveAverages } = require('./controllers/iotData');
const { deleteOldNotifications } = require('./controllers/notification');

// Database connection
DB();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://13.202.11.195:5555', 'http://13.232.163.105:5555'],
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
app.use('/api', paymentRoutes);
app.use('/api', liveVideoRoutes);
app.use('/api', saveWaterParamsRoutes);

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
// Schedule the task to delete old notifications every day at midnight
cron.schedule('0 0 * * *', () => {
    deleteOldNotifications();
    console.log('Old notifications deleted.');
});
// Schedule the calculation inflow, finalflow, energy
cron.schedule('59 23 * * *', async () => {
    await calculateAndSaveDailyDifferences();
    console.log('Daily differences calculated and saved');
});

// Initialize all MQTT clients at server startup
server.listen(port, () => {
    console.log(`Server Connected - ${port}`);
    initializeMqttClients(io, getAllDeviceCredentials); // Initialize all MQTT clients at startup
});

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

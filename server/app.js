const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path'); 
const DB = require('./config/DB');
const Chat = require('./models/chatModel'); // Import Chat model here

const userRoutes = require('./routers/user');
const calibrationRoutes = require('./routers/calibration');
const notificationRoutes = require('./routers/notification');
const calibrationExceedRoutes = require('./routers/calibrationExceed');
const calibrationExceedValuesRoute = require('./routers/calibrationExceedValues');
const calculateAverageRoute = require('./routers/calculateAverage');
const reportRoutes = require('./routers/report');
const paymentRoutes = require('./routers/payment');
const liveVideoRoutes = require('./routers/liveVideo');
const chatRoutes = require('./routers/chatRoutes');
const sensorRoute = require('./routers/sensorRoutes')

const { calculateAndSaveDailyDifferences } = require('./controllers/iotData');
const { getAllDeviceCredentials } = require('./controllers/user');
const { initializeMqttClients } = require('./mqtt/mqtt-socket');
const http = require('http');
const socketIO = require('socket.io');
const cron = require('node-cron');
const { calculateAndSaveAverages } = require('./controllers/iotData');
const { deleteOldNotifications } = require('./controllers/notification');

const app = express();
const port = process.env.PORT || 5555;
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: ['https://ocems.ebhoom.com','https://api.ocems.ebhoom.com','https://new.ocems.ebhoom.com','http://localhost:3000','http://localhost:3001'], // Include other origins as needed
        methods: ["GET", "POST","PUT","PATCH","DELETE"],
        credentials: true
    }
});

// Database connection
DB();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000',  'https://new.ocems.ebhoom.com','https://ocems.ebhoom.com','https://api.ocems.ebhoom.com','http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
app.use('/api', chatRoutes);
app.use('/api',sensorRoute);

// WebSockets for real-time chat
io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room by user ID
    socket.on('joinRoom', ({ userId }) => {
        socket.join(userId);
        console.log(`User joined room: ${userId}`);
    });

    // Listen for chat messages
    socket.on('chatMessage', async ({ from, to, message }) => {
        try {
            const chat = new Chat({
                from,
                to,
                message
            });
            await chat.save();
            io.to(from).emit('newChatMessage', chat);
            io.to(to).emit('newChatMessage', chat); // Emit new message to the recipient
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Schedule the averages calculation every hour
cron.schedule('0 * * * *', async () => {
    await calculateAndSaveAverages();
    // console.log('Averages calculated and saved.');
});

// Schedule the task to delete old notifications every day at midnight
cron.schedule('0 0 * * *', () => {
    deleteOldNotifications();
    // console.log('Old notifications deleted.');
});

// Schedule the calculation of inflow, final flow, energy
cron.schedule('59 23 * * *', async () => {
    await calculateAndSaveDailyDifferences();
    // console.log('Daily differences calculated and saved');
});

// Initialize all MQTT clients at server startup
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    initializeMqttClients(io, getAllDeviceCredentials);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

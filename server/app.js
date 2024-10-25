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
const calculateAverageRoute = require('./routers/iotDataRouter');
const reportRoutes = require('./routers/report');
const paymentRoutes = require('./routers/payment');
const liveVideoRoutes = require('./routers/liveVideo');
const chatRoutes = require('./routers/chatRoutes');
const dailyDifferencesRoutes = require('./routers/differenceData') 
const iotDataAveragesRoutes = require('./routers/iotDataAveragesRoute')

const { getAllDeviceCredentials } = require('./controllers/user');
const {initializeMqttClients} = require('./mqtt/mqtt-mosquitto');
const http = require('http');
const socketIO = require('socket.io');

const cron = require('node-cron');
const { calculateAndSaveAverages } = require('./controllers/iotData');
const { handleSaveMessage, getIotDataByUserName, getIotDataByUserNameAndStackName, getLatestIoTData } = require('./controllers/iotData');
const { deleteOldNotifications } = require('./controllers/notification');
const { scheduleAveragesCalculation } = require('./controllers/iotDataAverages');

const app = express();
const port = process.env.PORT || 5555;
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: ['https://ocems.ebhoom.com','https://api.ocems.ebhoom.com','https://new.ocems.ebhoom.com','http://localhost:3000','http://localhost:3001'], // Include other origins as needed
        methods: ["GET", "POST","PUT","PATCH","DELETE"],
    }
});
// Export io and server instances
module.exports = { io, server };

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
app.use((req, res, next) => {
    req.io = io;
    next();
});
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
app.use('/api',dailyDifferencesRoutes)
app.use('/api', iotDataAveragesRoutes)

// WebSockets for real-time chat
// WebSockets for real-time chat and energy data
io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room based on user ID
    socket.on('joinRoom', ({ userId }) => {
        socket.join(userId);
        console.log(`User joined room: ${userId}`);
    });
       // Handle real-time stack data updates
       socket.on('sendStackData', (data) => {
        console.log('Stack data received:', data);
        const { userName, stackData } = data;

        // Emit stack data to the specific user room
        io.to(userName).emit('stackDataUpdate', {
            stackData, // Send the entire stack data array
            timestamp: new Date(),
        });
        console.log(`Real-time stack data emitted to ${userName}`);
    });
    // Broadcast real-time energy data
    socket.on('sendEnergyData', (data) => {
        console.log('Energy data received:', data);
        const { userName } = data;
        io.to(userName).emit('energyDataUpdate', data); // Broadcast to clients in the room
      });
        // Emit real-time water data
        socket.on('sendWaterData', (data) => {
            console.log('Water data received:', data);
            const { userName } = data;
            io.to(userName).emit('waterDataUpdate', data); // Emit to specific room
        });

    // Listen for chat messages
    socket.on('chatMessage', async ({ from, to, message }) => {
        try {
            const chat = new Chat({ from, to, message });
            await chat.save();
            io.to(from).emit('newChatMessage', chat); // Emit to sender
            io.to(to).emit('newChatMessage', chat);   // Emit to recipient
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the scheduling function when the server starts
scheduleAveragesCalculation();

// // Schedule the averages calculation every hour
// cron.schedule('0 * * * *', async () => {
//     await calculateAndSaveAverages();
//     // console.log('Averages calculated and saved.');
// });

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
server.listen(port, async () => {
    console.log(`Server running on port ${port}`);

    // Initialize the MQTT client when the server starts
    try {
        await initializeMqttClients(io);
        console.log('MQTT clients initialized successfully');
    } catch (error) {
        console.error('Failed to initialize MQTT clients:', error);
    }
});
app.get('/cors-test', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send('CORS is working!');
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

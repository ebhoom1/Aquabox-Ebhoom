
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    adminID:{
        type: String,
    },
    adminName:{
        type: String,
    },
    dateOfCalibrationAdded:{
        type: String,
    },
    timeOfCalibrationAdded:{
        type: String,
    },
    
    message:{
        type:String
    },
    
})
const Notification = mongoose.model('Notification',notificationSchema);

module.exports = Notification;
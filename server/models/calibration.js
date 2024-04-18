const mongoose = require('mongoose');

const calibrationSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    date: {
        type: String,
    },
    userType:{
        type:String,
    },
    
    fname:{
        type:String,
    },
    equipmentName: {
        type: String
    },
    before: {
        type: String
    },
    after: {
        type: String,
    },
    technician: {
        type: String,
    },
    notes: {
        type: String
    }
});

const Calibration = mongoose.model('Calibration', calibrationSchema);

module.exports = Calibration;

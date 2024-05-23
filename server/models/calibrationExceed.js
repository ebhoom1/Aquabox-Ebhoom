const mongoose = require('mongoose');

const calibrationExceedSchema = new mongoose.Schema({
    commentByUser:{
        type: String 
    },
    commentByAdmin: { type: String },
    parameter:{type:String},
    value:{type:String},
    message:{type:String},
    timestamp: { type: Date, default: Date.now }
});


const CalibrationExceed = mongoose.model('CalibrationExceed', calibrationExceedSchema);

module.exports = CalibrationExceed;

const mongoose = require('mongoose');

const calibrationExceedSchema = new mongoose.Schema({
    commentByUser:{
        type: String,
    },
    commentByAdmin:{
        type: String,
    },
    ph:{
        type:String,
    },
    TDS:{
        type:String,

    },
    turbidity:{
        type:String,
    },
    temprature:{
        type:String,
    },
    BOD:{
        type:String,
    },
    COD:{
        type:String,
    },
    TSS:{
        type:String,
    },
    ORP:{
        type:String,
    },
    nitrate:{
        type:String,
    },
    ammonicalNitrogen:{
        type:String,
    },
    DO:{
        type:String,
    },
    chloride:{
        type:String,
    },
    chloride:{
        type:String,
    },    
    timestamp: {
         type: Date, 
         default: Date.now
    }
});

const CalibrationExceed = mongoose.model('CalibrationExceed', calibrationExceedSchema);

module.exports = CalibrationExceed;

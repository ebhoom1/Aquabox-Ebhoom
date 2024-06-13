const { required } = require('joi');
const mongoose = require('mongoose');

const iotDataSchema = new mongoose.Schema({
   product_id:{
    type:String,
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
    temperature:{
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
    PM10:{
        type:String,
    },
    PM25:{
        type:String,
    },
    NOH:{
        type:String,
    },
    NH3:{
        type:String,
    },
    WindSpeed:{
        type:String,
    },
    WindDir:{
        type:String,
    },
    AirTemperature:{
        type:String,
    },
    Humidity:{
        type:String,
    },
    solarRadiation:{
        type:String,
    },
    DB:{
        type:String,
    },
    date:{
        type:String,
    },
    time:{
        type:String
    },
    userId: {
         type: String 
    },
    topic:{
        type:String,
    },
    userName: {
         type: String
    },
    validationStatus:{
        type:String,
        required: true
    },
    validationMessage:{
        type:String,
        required: true
    },
   
    timestamp: {
         type: Date, 
         default: Date.now
    }
});

const IotData = mongoose.model('IotData', iotDataSchema);

module.exports = IotData;

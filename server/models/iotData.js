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
    Flow:{
        type:String,
    },
    CO:{
        type:String,
    },
    NOX:{type:String},
    Pressure:{type:String},
    Flouride:{type:String},
    PM:{
        type:String,
    },   
    SO2:{
        type:String,
    },
    NO2:{
        type:String
    },
    Mercury:{
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
    inflow:{
        type:Number,
    },
    finalflow:{
        type:Number,
    },
    energy:{
        type:Number,
      
    },
    voltage: {
        type: Number,
    },
    current: {
        type: Number,
    },
    power: {
        type: Number,
    },
    date:{
        type:String,
         required: true
    },
    time:{
        type:String
    },
    topic: { type: String },
    userName: { type: String, required: true },
    companyName: { type: String, required: true },
    industryType: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    validationStatus: { type: String,  },
    validationMessage: { type: String,  },
   
    timestamp: {
        type: Date,  // Store as Date type
        default: () => moment().toDate()
    }
});

const IotData = mongoose.model('IotData', iotDataSchema);

module.exports = IotData;

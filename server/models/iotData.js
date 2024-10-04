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
    stack_2_flow:{
        type:String,
    },
    stack_32_Ammonia_flow:{
        type:String,
    },
    stack_2_CO:{
        type:String,
    },
    stack_2_NOX:{type:String},
    stack_2_Pressure:{type:String},
    stack_2_Flouride:{type:String},
    stack_2_PM:{
        type:String,
    },   
    stack_2_SO2:{
        type:String,
    },
    stack_2_NO2:{
        type:String
    },
    stack_2_Mercury:{
        type:String,
    },
    stack_2_PM10:{
        type:String,
    },
    stack_2_PM25:{
        type:String,
    },
    stack_2_NOH:{
        type:String,
    },
    stack_2_NH3:{
        type:String,
    },
    stack_2_WindSpeed:{
        type:String,
    },
    stack_2_WindDir:{
        type:String,
    },
    stack_2_AirTemperature:{
        type:String,
    },
    stack_2_Humidity:{
        type:String,
    },
    stack_2_solarRadiation:{
        type:String,
    },
    stack_32_Ammonia_CO:{
        type:String,
    },
    stack_32_Ammonia_NOX:{type:String},
    stack_32_Ammonia_Pressure:{type:String},
    stack_32_Ammonia_Flouride:{type:String},
    stack_32_Ammonia_PM:{
        type:String,
    },   
    stack_32_Ammonia_SO2:{
        type:String,
    },
    stack_32_Ammonia_NO2:{
        type:String
    },
    stack_32_Ammonia_Mercury:{
        type:String,
    },
    stack_32_Ammonia_PM10:{
        type:String,
    },
    stack_32_Ammonia_PM25:{
        type:String,
    },
    stack_32_Ammonia_NOH:{
        type:String,
    },
    stack_32_Ammonia_NH3:{
        type:String,
    },
    stack_32_Ammonia_WindSpeed:{
        type:String,
    },
    stack_32_Ammonia_WindDir:{
        type:String,
    },
    stack_32_Ammonia_AirTemperature:{
        type:String,
    },
    stack_32_Ammonia_Humidity:{
        type:String,
    },
    stack_32_Ammonia_solarRadiation:{
        type:String,
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

const mongoose = require('mongoose');
const moment = require('moment');

const saveWaterParamsSchema = new mongoose.Schema({
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
    comapanyName:{
        type:String
    },
    industryType:{
        type:String
    },
    mobileNumber:{
        type:String,
    },
    email:{
        type:String
    },
   
    timestamp: {
        type: Date,  // Store as Date type
        default: () => moment().toDate()
    }
});

const WaterParams = mongoose.model('WaterParams', saveWaterParamsSchema);

module.exports = WaterParams;

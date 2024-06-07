const mongoose = require(`mongoose`);

const averageTypeSchema = new mongoose.Schema({
    value:{
        type:Number,
    },
    time:{
        type:String,
    },
    date:{
        type:String,
    },
},{_id:false});


const averageDataSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
   
    ph: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    TDS: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    turbidity: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    temperature: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    BOD: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    COD: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    TSS: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    ORP: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    nitrate: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    ammonicalNitrogen: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    DO: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    chloride: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    PM10: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    PM25: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    NOH: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    NH3: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    WindSpeed: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    WindDir: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    AirTemperature: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    Humidity: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    solarRadiation: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    DB: {
        hour: averageTypeSchema,
        day: averageTypeSchema,
        week: averageTypeSchema,
        month: averageTypeSchema,
        sixMonth: averageTypeSchema,
        year: averageTypeSchema
    },
    DataIsNotRecieved:{
        type:Boolean
    },
    timestamp: {
        type: Date,
        default: Date.now
    }


});

const AverageData = mongoose.model('AverageData',averageDataSchema)

module.exports = AverageData;

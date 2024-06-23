const mongoose = require('mongoose');

const IotDataAverageSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    interval: {
        type: String,
        required: true,
    },
    ph: {
        type: Number,
        required: true,
    },
    TDS: {
        type: Number,
        required: true,
    },
    turbidity: {
        type: Number,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    BOD: {
        type: Number,
        required: true,
    },
    COD: {
        type: Number,
        required: true,
    },
    TSS: {
        type: Number,
        required: true,
    },
    ORP: {
        type: Number,
        required: true,
    },
    nitrate: {
        type: Number,
        required: true,
    },
    ammonicalNitrogen: {
        type: Number,
        required: true,
    },
    DO: {
        type: Number,
        required: true,
    },
    chloride: {
        type: Number,
        required: true,
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
    timestamp: {
        type: Date,
        default: Date.now,
    },
});


const IotDataAverage = mongoose.model('IotDataAverage', IotDataAverageSchema);

module.exports = IotDataAverage;

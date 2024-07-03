const mongoose = require('mongoose');

const IotDataAverageSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    },
    interval: {
        type: String,
        required: true,
    },
    dateAndTime: {
        type: String,
    },
    ph: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    TDS: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    turbidity: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    temperature: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    BOD: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    COD: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    TSS: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    ORP: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    nitrate: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    ammonicalNitrogen: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    DO: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    chloride: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    PM10: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    PM25: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    NOH: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    NH3: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    WindSpeed: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    WindDir: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    AirTemperature: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    Humidity: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    solarRadiation: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    DB: {
        type: Number,
        get: v => parseFloat(v.toFixed(2))
    },
    inflow: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    finalflow: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    energy: {
        type: Number,
        required: true,
        get: v => parseFloat(v.toFixed(2))
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const IotDataAverage = mongoose.model('IotDataAverage', IotDataAverageSchema);

module.exports = IotDataAverage;

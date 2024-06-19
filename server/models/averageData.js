const mongoose = require('mongoose');

const IotDataAverageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    averageType: { type: String, enum: ['hour', 'day', 'month', 'sixmonth', 'year'], required: true },
    ph: { type: Number, default: null },
    TDS: { type: Number, default: null },
    turbidity: { type: Number, default: null },
    temperature: { type: Number, default: null },
    BOD: { type: Number, default: null },
    COD: { type: Number, default: null },
    TSS: { type: Number, default: null },
    ORP: { type: Number, default: null },
    nitrate: { type: Number, default: null },
    ammonicalNitrogen: { type: Number, default: null },
    DO: { type: Number, default: null },
    chloride: { type: Number, default: null },
    timestamp: { type: Date, default: Date.now }
});

const IotDataAverage = mongoose.model('IotDataAverage', IotDataAverageSchema);

module.exports = IotDataAverage;

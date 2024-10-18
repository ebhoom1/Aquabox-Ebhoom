const mongoose = require('mongoose');

const DifferenceDataSchema = new mongoose.Schema({
    date: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    userName: { type: String, required: true },
    product_id: { type: String },
    stationType: { type: String, required: true },
    stackName: { type: String, required: true },
    initialInflow: { type: Number, required: true },
    finalInflow: { type: Number, required: true },
    inflowDifference: { type: Number, required: true },
    initialFinalflow: { type: Number, required: true },
    finalFinalflow: { type: Number, required: true },
    finalflowDifference: { type: Number, required: true },
    initialEnergy: { type: Number, required: true },
    finalEnergy: { type: Number, required: true },
    energyDifference: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DifferenceData', DifferenceDataSchema);

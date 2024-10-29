const mongoose = require('mongoose');

const TotalPredictionSummarySchema = new mongoose.Schema({
    userName: { type: String, required: true },
    product_id: { type: String, required: true },
    interval: { type: String, required: true },
    intervalType: { type: String, required: true },
    predictedEnergy: { type: Number, default: 0 },
    predictedInflow: { type: Number, default: 0 },
    predictedFinalflow: { type: Number, default: 0 }
});

module.exports = mongoose.model('TotalPredictionSummary', TotalPredictionSummarySchema);

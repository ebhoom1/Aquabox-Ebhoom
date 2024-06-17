const mongoose =require('mongoose');

const paymentSchema = new mongoose.Schema({
    userName:{type:String, ref:'User',required:true},
    razorPayPaymentId:{type:String, required:true},
    amount: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }

})
module.exports = mongoose.model('Payment', paymentSchema);
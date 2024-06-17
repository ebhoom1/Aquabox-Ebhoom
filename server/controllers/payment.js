const Razorpay = require('razorpay');
const Payment = require('../models/payment');
const User = require('../models/user');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  const createOrder = async (req, res) => {
    const { amount, userName } = req.body;

    try {
        const options = {
          amount: amount * 100, // amount in the smallest currency unit
          currency: "INR",
          receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }

const verifyPayment  = async (req,res)=>{
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userName } = req.body;

    try {
        const crypto = require('crypto')
        const hmac =crypto.createHmac('sha256',proccess.env.RAZORPAY_KEY_SECRET);

        hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
        const generatedSignature = hmac.digest('hex');

        if(generatedSignature === razorpaySignature){
            const payment =new Payment({
                userName,
                razorpayPaymentId,
                amount: req.body.amount,
                status: 'success'
            })
            await payment.save();

            //Update the subscription dates
            const user =await User.findOne({userName});
            const subscriptionDate = new Date();
            const endSubscriptionDate = new Date();
            endSubscriptionDate.setDate(subscriptionDate.getDate() + 30);

            user.subscriptionDate = subscriptionDate;
            user.endSubscriptionDate = endSubscriptionDate;
            await user.save();

            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        }else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
          }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


module.exports = { createOrder, verifyPayment };
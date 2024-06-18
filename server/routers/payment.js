const express = require('express');
const { createOrder, verifyPayment,getTransactions } = require('../controllers/payment');
const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/transactions', getTransactions);

module.exports = router;
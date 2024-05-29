const express = require('express');
const { calculateAndSaveAverages } = require('../controllers/iotData');

const router = express.Router();

// Route to trigger calculateAndSaveAverages
router.get('/calculate-averages', async (req, res) => {
    try {
        await calculateAndSaveAverages();
        res.status(200).json({ message: 'Averages calculated and saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating averages', error: error.message });
    }
});

module.exports = router;

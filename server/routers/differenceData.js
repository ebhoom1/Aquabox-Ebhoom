const express = require('express');
const router = express.Router();
const { 
    calculateAndSaveDailyDifferences,
    getDailyDifferencesByUserName,
    downloadDifferenceDataByUserName,
    calculateAndSaveDailyDifferenceCheck
} = require('../controllers/differenceData'); // Adjust path as needed

// Route to trigger the calculation manually
router.get('/calculate-daily-differences', async (req, res) => {
    try {
        console.log('Manual trigger: Calculating daily differences.');
        await calculateAndSaveDailyDifferences();
        res.status(200).json({ message: 'Daily differences calculated and saved successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to calculate daily differences.' });
    }
});

// Route handler to trigger the dummy calculation
const triggerDummyCalculation = async (req, res) => {
    try {
        await calculateAndSaveDailyDifferenceCheck();
        res.status(200).json({ message: 'Dummy calculation completed successfully.' });
    } catch (error) {
        console.error('Error triggering dummy calculation:', error);
        res.status(500).json({ error: 'Failed to complete dummy calculation.' });
    }
};

// Route to trigger the dummy calculation
router.get('/dummy-calculate', triggerDummyCalculation);

// Route to fetch daily differences by userName
router.get('/daily-differences/:userName', async (req, res) => {
    const { userName } = req.params;
    try {
        const data = await getDailyDifferencesByUserName(userName);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: `No data found for user: ${userName}` });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch daily differences.' });
    }
});

// Route to download difference data by userName
router.get('/download-difference-data', downloadDifferenceDataByUserName);

module.exports = router;

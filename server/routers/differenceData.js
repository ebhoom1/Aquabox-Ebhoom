const express = require('express');
const router = express.Router();
const { 
  getDifferenceDataByUserNameAndInterval, 
  getAllDifferenceDataByUserName,
  getDifferenceDataByTimeRange,
    downloadDifferenceDataAsCSV,
    downloadDifferenceDataAsPDF
} = require('../controllers/differenceData');

// Route to get difference data by userName and interval (daily/hourly)
router.get('/difference/:userName', async (req, res) => {
  const { userName } = req.params;
  const { interval } = req.query; // 'hourly' or 'daily'

  try {
    const data = await getDifferenceDataByUserNameAndInterval(userName, interval);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${interval} difference data found for user ${userName}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${interval} difference data for ${userName} fetched successfully.`,
      data,
    });
  } catch (error) {
    console.error('Error fetching difference data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
});

// Route to get all difference data (both hourly and daily) by userName
router.get('/differenceByUserName/:userName', async (req, res) => {
  const { userName } = req.params;

  try {
    const data = await getAllDifferenceDataByUserName(userName);

    if (!data.daily.length && !data.hourly.length) {
      return res.status(404).json({
        success: false,
        message: `No difference data found for user ${userName}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `All difference data for ${userName} fetched successfully.`,
      data,
    });
  } catch (error) {
    console.error('Error fetching all difference data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
});

// Route to fetch data by userName, interval, and time range
// Route to fetch data by time range
router.get('/data/:userName/:interval/:fromDate/:toDate', async (req, res) => {
    const { userName, interval, fromDate, toDate } = req.params;
    try {
        const data = await getDifferenceDataByTimeRange(userName, interval, fromDate, toDate);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch data' });
    }
});

// Route to download data as CSV
router.get('/download/csv/:userName/:interval/:fromDate/:toDate', downloadDifferenceDataAsCSV);

// Route to download data as PDF
router.get('/download/pdf/:userName/:interval/:fromDate/:toDate', downloadDifferenceDataAsPDF);


module.exports = router;

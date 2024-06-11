const express = require('express');
const { calculateAndSaveAverages,
        getAllIotData,
        getIotDataByUserName,
        getLatestIoTData
} = require('../controllers/iotData');

const router = express.Router();

//Route to get the IOT values from DB
router.get('/get-all-iot-values',getAllIotData);

//Route to find a IoT data using UserName
router.get('/get-IoT-Data-by-userName/:userName',getIotDataByUserName);

//Route for getting the latest IoT Data
router.get('/latest-iot-data/:userName',getLatestIoTData);
  
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


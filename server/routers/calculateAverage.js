const express = require('express');
const { 
        getAllIotData,
        getIotDataByUserName,
        getLatestIoTData,
        getAverageDataByUserName,
        downloadIotData
        
} = require('../controllers/iotData');

const router = express.Router();

//Route to get the IOT values from DB
router.get('/get-all-iot-values',getAllIotData);

//Route to find a IoT data using UserName
router.get('/get-IoT-Data-by-userName/:userName',getIotDataByUserName);

//Route for getting the latest IoT Data
router.get('/latest-iot-data/:userName',getLatestIoTData);
  


// Route to get average data by userName and interval
router.get('/averageData/:userName', getAverageDataByUserName);



//Route to download the Iot VAlue
router.get('/downloadIotData',downloadIotData)



module.exports = router;


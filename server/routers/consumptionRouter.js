const express = require('express');
const router = express.Router();
const {
    getConsumptionDataByUserNameAndStackName,
    getConsumptionDataByUserName,
    getAllConsumptionData,
    getConsumptionDataByUserNameAndStackNameAndInterval
} = require('../controllers/consumptionController');

// Route to get data by userName and stackName
router.get('/consumptionData/:userName/:stackName', getConsumptionDataByUserNameAndStackName);

// Route to get data by userName and stackName and intervalType
router.get('/consumptionData/:userName/:stackName/:intervalType', getConsumptionDataByUserNameAndStackNameAndInterval);

// Route to get data by userName
router.get('/consumptionData/:userName', getConsumptionDataByUserName);

// Route to get all data
router.get('/allConsumptionData', getAllConsumptionData);

module.exports = router;

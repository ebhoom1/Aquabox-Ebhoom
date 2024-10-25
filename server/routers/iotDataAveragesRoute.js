const express = require('express');
const { 
    scheduleAveragesCalculation,
    findAverageDataUsingUserName,
    findAverageDataUsingUserNameAndStackName,
    getAllAverageData,
    findAverageDataUsingUserNameAndStackNameAndIntervalType
      } = require('../controllers/iotDataAverages');
const router = express.Router();


router.get('/schedule-averages', (req, res) => {
    scheduleAveragesCalculation();
    res.status(200).send('Scheduled averages calculations successfully!');
});

// Route to get all average data
router.get('/average/all', getAllAverageData);

// Route to get average data by userName
router.get('/average/user/:userName', findAverageDataUsingUserName);

// Route to get average data by userName and stackName
router.get('/average/user/:userName/stack/:stackName', findAverageDataUsingUserNameAndStackName);

router.get('/average/user/:userName/stack/:stackName/interval/:intervalType', findAverageDataUsingUserNameAndStackNameAndIntervalType);

module.exports = router;

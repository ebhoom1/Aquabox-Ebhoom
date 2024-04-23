const express = require('express')
const {addCalibration,
       viewAllCalibrations,
       findCalibrationByUserName,
       editCalibration,
       deleteCalibration} = require('../controllers/calibration')

const router = express.Router()

// Add calibration
router.post('/add-calibration', addCalibration);

// Edit calibration
router.put('/edit-calibration/:id', editCalibration);

// View all calibrations
router.get('/view-all-calibrations', viewAllCalibrations);

// Delete calibration
router.delete('/delete-calibration/:id', deleteCalibration);

// Find calibration by userId
router.get('/find-calibration-by-userId/:userName', findCalibrationByUserName);

module.exports=router;
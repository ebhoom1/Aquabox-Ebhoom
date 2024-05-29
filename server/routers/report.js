const express = require('express');
const {createReport,findReport,findReportsByUserName,editReport,deletedReport} = require('../controllers/report');


const router = express.Router();

//Add a Report
router.post('/create-report', createReport);

//get All Report
router.get('/get-all-report',findReport);

//get a Report using userName
router.get('/get-a-report/:id',findReportsByUserName);

//edit a Report 
router.patch('/edit-report/:id',editReport);

//Delete a Report
router.delete('delete-report/:id',deletedReport);

module.exports =router;
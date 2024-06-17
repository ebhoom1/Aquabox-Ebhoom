const express =require('express')

const {addComment,getAllExceedData,editComments, getAUserExceedData,getExceedDataByUserName} =require('../controllers/calibrationExceed')

const router =express.Router()

router.post('/add-comments/:id',addComment);

router.get('/get-all-exceed-data',getAllExceedData);

router.put('/edit-comments/:id',editComments); 

router.get('/get-user-exceed-data/:userName',getExceedDataByUserName); 

router.get('/user-exceed-data',getAUserExceedData)  

module.exports =router; 
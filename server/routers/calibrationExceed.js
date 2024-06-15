const express =require('express')

const {addComment,getAllExceedData,editComments, getAUserExceedData} =require('../controllers/calibrationExceed')

const router =express.Router()

router.post('/add-comments',addComment);

router.get('/get-all-exceed-data',getAllExceedData);

router.put('/edit-comments/:id',editComments); 

router.get('/user-exceed-data',getAUserExceedData)  

module.exports =router; 
const express =require('express')

const {addComment,viewAllComments,editComments, getAcomment} =require('../controllers/calibrationExceed')

const router =express.Router()

router.post('/add-comments',addComment);

router.get('/get-all-values',viewAllComments);

router.put('/edit-comments/:id',editComments);

router.get('/get-a-value',getAcomment)

module.exports =router;
const express =require('express')

const {addComment,viewAllComments,editComments, getAcomment} =require('../controllers/calibrationExceed')

const router =express.Router()

router.post('/add-comments',addComment);

router.get('/get-all-comments',viewAllComments);

router.put('/edit-comments/:id',editComments);

router.get('/get-a-comment',getAcomment)

module.exports =router;
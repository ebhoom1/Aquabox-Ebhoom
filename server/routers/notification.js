const express = require('express')
const {
    addNotification,
    viewNotification,
    deleteNotification
} = require('../controllers/notification')

const router =express.Router()

//Add Notification
router.post('/add-notificaiton',addNotification);

//view All Notification
router.get('/view-notification',viewNotification);

//delete Notification
router.delete('/delete-notification/:id',deleteNotification);

module.exports =router;

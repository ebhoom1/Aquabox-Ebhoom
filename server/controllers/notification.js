const mongoose = require('mongoose');
const Notification = require('../models/notification');

//Add Notification 
const addNotification = async (req,res) =>{
    try {
        const {message} =req.body

        //Create New Notification
        const newNotification = new Notification({message})
        //Save the New Notification
        await newNotification.save()

        res.status(201).json({
            success:true,
            message:"New Notification is added",
            notification:newNotification
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error from Catch",
            error:error.message
        })
    }
}

//View Notification
const viewNotification = async (req,res)=>{
    try {
        //Retrieve All Notification from database
        const allNotification = await Notification.find()

        res.status(200).json({
            success:true,
            message:"All Notification are successfully fetched",
            notification:allNotification
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error in Fetching all Notification",
            error:error.message
        })
    }
}

//Delete Notification

const deleteNotification = async(req,res)=>{
    try {
        const {id} = req.params;

        //find the Notification by Id and delete it
        const deletedNotification = await Notification.findByIdAndDelete(id)
        
        if(!deleteNotification){
            return res.status(404).json({
                success:false,
                meesage:"Notifications are not found"
            })
            
        }
        res.status(200).json({
            success:true,
            message:"Notification Deleted successfully",
            notification:deleteNotification
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'failed to delete Notification',
            error:error.message
        })
    }
}

module.exports ={addNotification,viewNotification,deleteNotification};
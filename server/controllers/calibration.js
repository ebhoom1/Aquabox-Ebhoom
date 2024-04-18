const mongoose = require('mongoose');
const Calibration = require('../models/calibration'); // Import the Calibration model

// Controller function to add a calibration
const addCalibration = async (req, res) => {
    try {
        const {
            date,
            userType,
            userName,
            fname,
            equipmentName,
            before,
            after,
            technician,
            notes
        } = req.body;

        // Create a new calibration object
        const newCalibration = new Calibration({
            date,
            userType,
            userName,
            fname,
            equipmentName,
            before,
            after,
            technician,
            notes
        });

        // Check if a Calibration with the same userName already exists
        const existingCalibration= await Calibration.findOne({userName})

        if(existingCalibration){
            return res.status(400).json({
                success:false,
                message:'Calibration with this userName already exists'
            })
        }

        // Save the new calibration to the database
        await newCalibration.save();

        res.status(201).json({
            success: true,
            message: 'Calibration added successfully',
            calibration: newCalibration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add calibration',
            error: error.message
        });
    }
};


// Controller function to view all calibrations
const viewAllCalibrations = async (req, res) => {
    try {
        // Retrieve all calibrations from the database
        const allCalibrations = await Calibration.find();

        res.status(200).json({
            success: true,
            message: 'Calibrations retrieved successfully',
            calibrations: allCalibrations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve calibrations',
            error: error.message
        });
    }
};

// Controller function to find calibration by UserId
const findCalibrationById = async (req, res) => {
    try {
        const userId=req.params.id

        const calibration=await Calibration.findById(userId);

        if(!calibration){
            return res.status(404).json({status:404, message:"User Not Found"})
        }else{
            return res.status(200).json({
                success: true,
                message: 'found the calibration data using the Id',
                calibration: calibration
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to find calibration',
            error: error.message
        });
    }
   
    
};
// Controller function to edit a calibration
const editCalibration = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        // Find the calibration by ID and update it
        const updatedCalibration = await Calibration.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedCalibration) {
            return res.status(404).json({
                success: false,
                message: 'Calibration not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Calibration updated successfully',
            calibration: updatedCalibration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update calibration',
            error: error.message
        });
    }
};
// Controller function to delete a calibration
const deleteCalibration = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the calibration by ID and delete it
        const deletedCalibration = await Calibration.findByIdAndDelete(id);

        if (!deletedCalibration) {
            return res.status(404).json({
                success: false,
                message: 'Calibration not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Calibration deleted successfully',
            calibration: deletedCalibration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete calibration',
            error: error.message
        });
    }
};


module.exports = { addCalibration,viewAllCalibrations,findCalibrationById,editCalibration,deleteCalibration};

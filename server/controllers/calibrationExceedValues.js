const CalibrationExceedValues = require('../models/calibrationExceedValues');

//Add Calibration Exceed Values
const AddCalibrationExceedValues = async (req, res) => {
    try {
        const { product_id, ph, tds, turbidity, temperature, bod, cod,
            tss, orp, nitrate, ammonicalNitrogen, DO, chloride, PM10, PM25, NOH, NH3, WindSpeed,
            WindDir, AirTemperature, Humidity, solarRadiation, DB, date, time, userName } = req.body;

        const newCalibrationExceedValues = new CalibrationExceedValues({
            product_id, ph, tds, turbidity, temperature, bod, cod,
            tss, orp, nitrate, ammonicalNitrogen, DO, chloride, PM10, PM25, NOH, NH3, WindSpeed,
            WindDir, AirTemperature, Humidity, solarRadiation, DB, date, time, userName
        });

        await newCalibrationExceedValues.save();

        res.status(201).json({
            success: true,
            message: 'The Calibration Exceed Values are saved successfully',
            calibrationExceedValues: newCalibrationExceedValues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error from Catch",
            error: error.message
        });
    }
};

// Get calibration Exceed Values by userName
const getCalibrationExceedValues = async (req, res) => {
    try {
        const { userName } = req.params;

        const userCalibrationExceedValues = await CalibrationExceedValues.find({ userName });

        res.status(200).json({
            status: 200,
            success: true,
            message: `Calibration Exceed Values of ${userName} fetched Successfully`,
            userCalibrationExceedValues,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error in fetching the calibration Exceed values`,
            error: error.message,
        });
    }
};

//Edit Calibration Exceed Values

const editCalibrationExceedValues = async( req,res)=>{
    try {
        const {userName} =req.params;
        const updateFields = req.body;
    
        //Find the calibration Exceed value by userName and update It
        const updateCalibrationExceedValue = await CalibrationExceedValues.findOneAndUpdate({userName:userName},updateFields,{new:true})
    
        if(!updateCalibrationExceedValue){
            return res.status(404).json({
                success:false,
                message:'Calibration Exceed Value is not found'
            })
        }
        res.status(200).json({
            success:true,
            message:`Calibration Exceed Value Upadate successfully`,
            calibrationExceedValue : updateCalibrationExceedValue
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Failed to update to Calibration Exceed Values',
            error:error.message
        })
    }
  
}

// Delete Calibration Exceed Values

const deleteCalibrationExceedValues = async (req,res)=>{
    try {
        const {_id} = req.params;

        // find the Calibration exceed Value by Id and Delete it
        const deletedCalibrationExceedValue = await CalibrationExceedValues.findByIdAndDelete(_id);

        if(!deletedCalibrationExceedValue){
            return res.status(404).json({
                success:false,
                message:'Calibration Exceed Value not found'
            })
        }
        res.status(200).json({
            success:true,
            message:'Calibration Exceed Value Deleted Successfully',
            calibrationExceedValue:deletedCalibrationExceedValue
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Failed to delete Calibration Exceed Value',
            error:error.message
        })
        
    }
}
module.exports = { getCalibrationExceedValues, AddCalibrationExceedValues,editCalibrationExceedValues,deleteCalibrationExceedValues };

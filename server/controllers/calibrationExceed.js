const CalibrationExceed = require('../models/calibrationExceed')

const addComment = async (req,res)=>{
    try{
        const {commentByUser,commentByAdmin}=req.body

        const newComment = new CalibrationExceed({commentByUser,commentByAdmin})
        await newComment.save()
        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            calibration: newComment
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Failed to add comment',
            error: error.message
        });
    }
}
const viewAllComments = async(req,res)=>{
    try {
        const allComments =await CalibrationExceed.find();
        
        res.status(200).json({
            success:true,
            message:'All comment are finded',
            comments:allComments
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Failed fetch the comments',
            error:error.message
        })
    }
}

const getAcomment =  async (req, res) => {
    try {
        const { id } = req.params;  // Assuming you're passing the ID as a parameter in the URL

        const comment = await CalibrationExceed.findOne({ _id: id });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comment retrieved successfully',
            comment: comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve the comment',
            error: error.message
        });
    }
};

const editComments =async(req,res)=>{
    try {
        const {id}=req.params;
        const updateField = req.body;

        const updateComments = await CalibrationExceed.findByIdAndUpdate(id,updateField,{new:true})

        if(!updateComments){
            return res.status(404).json({
                success:false,
                message:'Comment not edited'
            });
        }
        res.status(200).json({
            success:true,
            message:'Comments updated successfully',
            comments:updateComments
        })
    } catch (error) {
        res.status(500).json({
            succes:false,
            message:'Failed to update the comment',
            error:error.message
        })
    }
}
const handleExceedValues = async (data)=>{
    try {
        //Check if the pH exceeds the threshold
        if(data.ph > 25){
            await saveExceedValue(`pH`,data.ph);
        }
        // Check if  the turbitiy exceed the threshold
        if(data.turbidity > 105){
            await saveExceedValue(`Turbidity`,data.turbidity);
        }
        // Check if the ORP exceeds the threshold
        if (data.orp > 1500){
            await saveExceedValue(`ORP`,data.orp)
        }
    } catch (error) {
        console.error(`Error handling exceed values:`,error);
    }
};
const saveExceedValue = async (parameter,value)=>{
    try {
        //Create a new document in the Calibration exceed collection
        const newEntry = new CalibrationExceed({
            parameter,
            value,
            message:`Value Exceed in ${parameter} of ${value}`
        })

        //Save the document to DB
        await newEntry.save();
        return {
            success: true,
            message: "calibration Exceed value saved successfully",
            newEntry
        };
    } catch (error) {
        return {
            success: false,
            message: "Error saving data to MongoDB",
            error: error.message
        };
    }
}
module.exports ={addComment,viewAllComments,editComments,getAcomment, handleExceedValues};
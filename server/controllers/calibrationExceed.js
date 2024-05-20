const calibrationExceed = require('../models/calibrationExceed')

const addComment = async (req,res)=>{
    try{
        const {commentByUser,commentByAdmin}=req.body

        const newComment = new calibrationExceed({commentByUser,commentByAdmin})
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
        const allComments =await calibrationExceed.find();
        
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

        const comment = await calibrationExceed.findOne({ _id: id });

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

        const updateComments = await calibrationExceed.findByIdAndUpdate(id,updateField,{new:true})

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

module.exports ={addComment,viewAllComments,editComments,getAcomment};
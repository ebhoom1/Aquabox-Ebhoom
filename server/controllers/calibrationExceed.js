const CalibrationExceed = require('../models/calibrationExceed')
const moment = require('moment')
const twilio = require('twilio');
const nodemailer = require('nodemailer');

//Create a new Twilio client

const accountsid = process.env.ACCOUNTSID
const authtoken =process.env.AUTHTOKEN

const client = new twilio(accountsid,authtoken);

//function to send sms notification for exceed calibration
const sendSMS = async(to,message)=>{
    try{
        //send SMS
        await client.messages.create({
            body:message,
            from:process.env.PHONE_NUMBER,
            to:to
        })
        console.log(`SMS sent successfully`);
    }catch(error){
        console.error(`Error sending SMS:`, error)
    }
}

//email config
const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    service:'gmail',
    auth:{
        user:process.env.EMAIl,
        pass:process.env.PASSWORD
    }
})

//Funtion to send email
const sendEmail = async( to, subject, text)=>{
    try {
        //Send mail with defined transport object
        await transporter.sendMail({
            from:process.env.EMAIl,
            to:to,
            subject:subject,
            text:text
        })
        console.log(`Email Sent Successfully`);

    } catch (error) {
        console.error(`Error sending email:`,error)
    }
}

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
            await sendNotification(`pH`,data.ph);
        }
        // Check if  the turbitiy exceed the threshold
        if(data.turbidity > 105){
            await saveExceedValue(`Turbidity`,data.turbidity);
            await sendNotification('Turbidity', data.turbidity);

        }
        // Check if the ORP exceeds the threshold
        if (data.orp > 1500){
            await saveExceedValue(`ORP`,data.orp)
            await sendNotification('ORP', data.orp);
        }
    } catch (error) {
        console.error(`Error handling exceed values:`,error);
    }
};
const sendNotification =async(parameter,value)=>{
    try {
        const message = `Your calibration for ${parameter} exceed the threshold the value is ${value}`

        //Send email notification
        await sendEmail('info.ebhoom@gmail.com','Calibration Exceed Notification',message)

        //Send SMS notification
        await sendSMS('+917736538040',message)
    } catch (error) {
        console.error(`Error sending notification:`, error);
    }
}
const saveExceedValue = async (parameter,value)=>{
    try {

         // Format the current date and time
         const currentDate = moment().format('DD/MM/YYYY');
         const currentTime = moment().format('HH:mm:ss');

        //Create a new document in the Calibration exceed collection
        const newEntry = new CalibrationExceed({
            parameter,
            value,
            timestamp: moment().toDate(), // Store current date and time
            formattedDate: currentDate, // Store formatted date
            formattedTime: currentTime, // Store formatted time
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
const CalibrationExceed = require('../models/calibrationExceed');
const moment = require('moment');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const userdb = require('../models/user');
const { createNotification } = require('../controllers/notification');
const CalibrationExceedValues = require('../models/calibrationExceedValues');

// Create a new Twilio client
const accountsid ="AC16116151f40f27195ca7e326ada5cb83"
const authtoken = "d7ea43981a772f6b6c9bddb41a6a87ff"

const client = new twilio(accountsid, authtoken);

// Function to send SMS notification for exceed calibration
const sendSMS = async (to, message) => {
    try {
        // Send SMS
        await client.messages.create({
            body: message,
            from: "+14423428965",
            to: to
        });
        console.log(`SMS sent successfully`);
    } catch (error) {
        console.error(`Error sending SMS:`, error);

        if (error.code === 20003) {
            console.error(`Authentication error: Check your Twilio credentials.`);
        } else {
            console.error(`Twilio error:`, error.message);
        }
    }
}

// Email config
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIl,
        pass: process.env.PASSWORD
    }
})

// Function to send email
const sendEmail = async (to, subject, text) => {
    try {
        // Send mail with defined transport object
        await transporter.sendMail({
            from: process.env.EMAIl,
            to: to,
            subject: subject,
            text: text
        });
        console.log(`Email sent successfully`);
    } catch (error) {
        console.error(`Error sending email:`, error);
    }
}

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
       
        const updateFields = req.body;
      
        if (!updateFields.commentByUser) {
            updateFields.commentByUser = 'N/A';
        }
        if (!updateFields.commentByAdmin) {
            updateFields.commentByAdmin = 'N/A';
        }
    
        const calibrationExceedcomments = await CalibrationExceed.findByIdAndUpdate(
            id,
          { $set: updateFields },
          { new: true }
        );
    
        if (!calibrationExceedcomments) {
          return res.status(404).json({ message: 'Calibration Exceed comments not found' });
        }
    
        res.status(200).json({
          success: true,
          message: 'Comment added successfully',
          calibrationExceedcomments
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to add comment',
          error: error.message
        });
    }
}

const editComments = async (req, res) => {
    try {
        const { id } = req.params;
        const { commentByUser, commentByAdmin } = req.body;
        const updateFields = {};
        if (commentByUser) updateFields.commentByUser = commentByUser;
        if (commentByAdmin) updateFields.commentByAdmin = commentByAdmin;

        if (!updateFields.commentByUser) {
            updateFields.commentByUser = 'N/A';
        }
        if (!updateFields.commentByAdmin) {
            updateFields.commentByAdmin = 'N/A';
        }

        const updateComments = await CalibrationExceed.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        if (!updateComments) {
            return res.status(404).json({
                success: false,
                message: 'Comment not edited'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Comments updated successfully',
            comments: updateComments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update the comment',
            error: error.message
        });
    }
};

const getAllExceedData = async (req, res) => {
    try {
        const allComments = await CalibrationExceed.find();
        res.status(200).json({
            success: true,
            message: 'All comments are found',
            userExceedData: allComments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch the comments',
            error: error.message
        });
    }
}

const getAUserExceedData = async (req, res) => {
    try {
        const { userName, industryType, companyName, fromDate, toDate } = req.query;

        // Construct the query object
        let query = {};

        if (userName) {
            query.userName = userName;
        }

        if (industryType) {
            query.industryType = industryType;
        }

        if (companyName) {
            query.companyName = companyName;
        }

        if (fromDate && toDate) {
            query.timestamp = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }

        // Fetch and sort the data with allowDiskUse
        const comments = await CalibrationExceed.find(query)
            .sort({ timestamp: -1 })
            .allowDiskUse(true);

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No comments found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            comments: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve the comments',
            error: error.message
        });
    }
};

  
const getExceedDataByUserName = async(req,res)=>{
    try {
        const {userName}=req.params;
        
        //Retrive Exceed Data using UserName
        const userExceedData= await CalibrationExceed.find({userName});

        res.status(200).json({
            status:200,
            success:true,
            message:`Calibration Exceed data of User ${userName} fetched successfully`,
            userExceedData
        })

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: `Error in Fetching User Exceed Data`,
            error: error.message,
          });
    }
} 
  

const handleExceedValues = async (req, res) => {
    const data = req.body;

    try {
        const user = await userdb.findById(data.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.userType === 'user') {
            if (!user.industryType) {
                return res.status(400).json({
                    success: false,
                    message: `User with ID ${user._id} has no industry type specified.`
                });
            }

            const industryThresholds = await CalibrationExceedValues.findOne({ industryType: user.industryType });

            if (!industryThresholds) {
                return res.status(404).json({
                    success: false,
                    message: `No thresholds found for industry type: ${user.industryType}`
                });
            }

            const exceedParameters = [
                { parameter: 'ph', value: data.ph, threshold: industryThresholds.phBelow },
                { parameter: 'ph', value: data.ph, threshold: industryThresholds.phAbove },
                { parameter: 'turbidity', value: data.turbidity, threshold: industryThresholds.turbidity },
                { parameter: 'ORP', value: data.orp, threshold: industryThresholds.ORP },
                { parameter: 'TDS', value: data.tds, threshold: industryThresholds.TDS },
                { parameter: 'temperature', value: data.temperature, threshold: industryThresholds.temperature },
                { parameter: 'BOD', value: data.bod, threshold: industryThresholds.BOD },
                { parameter: 'COD', value: data.cod, threshold: industryThresholds.COD },
                { parameter: 'TSS', value: data.tss, threshold: industryThresholds.TSS },
            ];

            for (const { parameter, value, threshold } of exceedParameters) {
                if (value >= threshold) {
                    await saveExceedValue(parameter, value, user);
                    await sendNotification(parameter, value, user);
                }
            }
        }

        res.status(200).json({
            success: true,
            message: 'Exceed values handled successfully'
        });
    } catch (error) {
        console.error(`Error handling exceed values:`, error);
        res.status(500).json({
            success: false,
            message: 'Error handling exceed values',
            error: error.message
        });
    }
};
   
    


const sendNotification = async (parameter, value, user) => {
    try {
        const message = `Your calibration for ${parameter} exceeds the threshold. The value is ${value} for userId ${user._id} and userName ${user.userName}`;
        const currentDate = moment().format('DD/MM/YYYY');
        const currentTime = moment().format('HH:mm:ss');

     //   console.log(`Sending notification with message: ${message}`); // Debugging statement

        //Send email notification
       // await sendEmail(user.email, 'Calibration Exceed Notification', message);

        // Send SMS notification
        // if (user.mobileNumber) {
        //     await sendSMS(user.mobileNumber, message);
        // }

        // Add notification to the database
        //await createNotification(message, user._id, user.userName, currentDate, currentTime);
    } catch (error) {
        console.error(`Error sending notification:`, error);
    }
};

const saveExceedValue = async (parameter, value, user) => {
    try {
        // console.log(`Saving exceed value for parameter: ${parameter}, value: ${value}, user:`, user); // Debugging statement

        // Format the current date and time
        const currentDate = moment().format('DD/MM/YYYY');
        const currentTime = moment().format('HH:mm:ss');

        // Generate a serial number
        const lastEntry = await CalibrationExceed.findOne().sort({ sl_No: -1 });
        const newSerialNumber = lastEntry ? lastEntry.sl_No + 1 : 1;

        // Create a new document in the CalibrationExceed collection
        const newEntry = new CalibrationExceed({
             sl_No: newSerialNumber,
            parameter,
            value,
            timestamp: moment().toDate(), // Store current date and time
            formattedDate: currentDate, // Store formatted date
            formattedTime: currentTime, // Store formatted time
            message: `Value Exceed in ${parameter} of ${value} for userId ${user.userName}`,
            userId: user._id,
            userName: user.userName,
            industryType: user.industryType,
            companyName: user.companyName,
            commentByUser:'N/A',
            commentByAdmin:'N/A',
        });

        // Save the document to DB
         await newEntry.save();
        //  console.log(`Exceed value saved successfully`); // Debugging statement

        return {
            success: true,
            message: "Calibration Exceed value saved successfully",
            newEntry
        };
    } catch (error) {
        console.error(`Error saving exceed value:`, error); // Debugging statement

        return {
            success: false,
            message: "Error saving data to MongoDB",
            error: error.message
        };
    }
}

module.exports = { addComment, getAllExceedData, editComments, getAUserExceedData, handleExceedValues,getExceedDataByUserName }
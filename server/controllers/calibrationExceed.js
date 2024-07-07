const CalibrationExceed = require('../models/calibrationExceed');
const moment = require('moment');
const twilio = require('twilio');
const axios = require('axios');
const nodemailer = require('nodemailer');
const userdb = require('../models/user');
const { createNotification } = require('../controllers/notification');
const CalibrationExceedValues = require('../models/calibrationExceedValues');
const IotData = require('../models/iotData')

// Create a new Twilio client
const accountsid ="AC16116151f40f27195ca7e326ada5cb83"
const authtoken = "d7ea43981a772f6b6c9bddb41a6a87ff"

const client = new twilio(accountsid, authtoken);

// // Function to send SMS notification for exceed calibration
// const sendSMS = async (to, message) => {
//     try {
//         // Send SMS
//         await client.messages.create({
//             body: message,
//             from: "+14423428965",
//             to: to
//         });
//         console.log(`SMS sent successfully`);
//     } catch (error) {
//         console.error(`Error sending SMS:`, error);

//         if (error.code === 20003) {
//             console.error(`Authentication error: Check your Twilio credentials.`);
//         } else {
//             console.error(`Twilio error:`, error.message);
//         }
//     }
// }
// Function to send SMS notification for exceed calibration using TextBelt API
// Function to send SMS notification using Fast2SMS API
const sendSMS = async (to, message) => {
    try {
        const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            route: 'q',
            message: message,
            language: 'english',
            flash: 0,
            numbers: to,
        }, {
            headers: {
                'authorization': '0J3goAnZwakj9eNfLK8IPz4yOXGlBvHtD5xisrdhVpbuc6WETCrUJGXQjTd7qF2Sv5nZmbgYWBhiyt0u',
                'Content-Type': 'application/json'
            }
        });
        if (response.data.return) {
            console.log(`SMS sent successfully: ${response.data}`);
        } else {
            console.error(`Error sending SMS: ${response.data.message}`);
        }
    } catch (error) {
        console.error(`Error sending SMS:`, error.response ? error.response.data : error.message);
    }
};



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
  
const handleExceedValues = async () => {
    try {
        // Fetch the latest IoT data entry
        const latestData = await IotData.findOne().sort({ timestamp: -1 });
        console.log('latestData:', latestData);
        if (!latestData) {
            console.error('No IoT data found');
            return;
        }

        // Find the user based on the latestData's userName
        const user = await userdb.findOne({ userName: latestData.userName });
        console.log('User:', user);

        if (!user) {
            console.error('User not found');
            return;
        }

        if (user.userType === 'user') {
            if (!user.industryType) {
                console.error(`User with ID ${user.userName} has no industry type specified.`);
                return;
            }

            // Fetch the industry thresholds
            const industryThresholds = await CalibrationExceedValues.findOne({ industryType: user.industryType });
            console.log('Industry Thresholds:', industryThresholds);

            if (!industryThresholds) {
                console.error(`No thresholds found for industry type: ${user.industryType}`);
                return;
            }

            // Define parameters to be checked
            const exceedParameters = [
                { parameter: 'ph', value: latestData.ph, aboveThreshold: industryThresholds.phAbove, belowThreshold: industryThresholds.phBelow },
                { parameter: 'turbidity', value: latestData.turbidity, threshold: industryThresholds.turbidity },
                { parameter: 'ORP', value: latestData.ORP, threshold: industryThresholds.ORP },
                { parameter: 'TDS', value: latestData.TDS, threshold: industryThresholds.TDS },
                { parameter: 'temperature', value: latestData.temperature, threshold: industryThresholds.temperature },
                { parameter: 'BOD', value: latestData.BOD, threshold: industryThresholds.BOD },
                { parameter: 'COD', value: latestData.COD, threshold: industryThresholds.COD },
                { parameter: 'TSS', value: latestData.TSS, threshold: industryThresholds.TSS },
                // Add other parameters if needed
            ];

            // Check if any parameter exceeds the threshold
            const exceedances = [];
            for (const { parameter, value, aboveThreshold, belowThreshold, threshold } of exceedParameters) {
                if ((aboveThreshold && value >= aboveThreshold) || (belowThreshold && value <= belowThreshold) || (threshold && value >= threshold)) {
                    console.log(`Exceed detected for parameter: ${parameter}, value: ${value}, user: ${user.userName}`);
                    exceedances.push({ parameter, value });
                }
            }

            // Save all exceedances and send notifications
            for (const exceed of exceedances) {
                await saveExceedValue(exceed.parameter, exceed.value, user);
                await sendNotification(exceed.parameter, exceed.value, user);
            }
        }

        console.log('Exceed values handled successfully');
    } catch (error) {
        console.error('Error handling exceed values:', error);
    }
};
   
const sendNotification = async (parameter, value, user) => {
    try {
        const message = `Your calibration for ${parameter} exceeds the threshold. The value is ${value} for userId ${user._id} and userName ${user.userName}`;
        const currentDate = moment().format('DD/MM/YYYY');
        const currentTime = moment().format('HH:mm:ss');

        // Send SMS notification
        const today = moment().startOf('day');
        const lastExceedEntry = await CalibrationExceed.findOne({ userName: user.userName }).sort({ timestamp: -1 });

        if (!lastExceedEntry || moment(lastExceedEntry.timestamp).startOf('day').isBefore(today)) {
            if (user.mobileNumber) {
                await sendSMS(user.mobileNumber, message);
            }
        }

        // Send email notification
        if (user.email) {
            await sendEmail(user.email, 'Calibration Exceed Notification', message);
        }

        // Add notification to the database
        // await createNotification(message, user._id, user.userName, currentDate, currentTime);
    } catch (error) {
        console.error(`Error sending notification:`, error);
    }
};
 
const saveExceedValue = async (parameter, value, user) => {
    try {
        console.log(`Saving exceed value for parameter: ${parameter}, value: ${value}, user:`, user);

        const currentDate = moment().format('DD/MM/YYYY');
        const currentTime = moment().format('HH:mm:ss');

        const lastEntry = await CalibrationExceed.findOne().sort({ sl_No: -1 });
        const newSerialNumber = lastEntry ? lastEntry.sl_No + 1 : 1;

        const newEntry = new CalibrationExceed({
            sl_No: newSerialNumber,
            parameter,
            value,
            timestamp: moment().toDate(),
            formattedDate: currentDate,
            formattedTime: currentTime,
            message: `Value Exceed in ${parameter} of ${value} for userId ${user.userName}`,
            userName: user.userName,
            industryType: user.industryType,
            companyName: user.companyName,
            commentByUser: 'N/A',
            commentByAdmin: 'N/A',
        });    

        await newEntry.save();
        console.log(`Exceed value saved successfully`);

        return {
            success: true,
            message: "Calibration Exceed value saved successfully",
            newEntry
        };
    } catch (error) {
        console.error(`Error saving exceed value:`, error);

        return {
            success: false,
            message: "Error saving data to MongoDB",
            error: error.message
        };
    }
};

handleExceedValues();

module.exports = { addComment, getAllExceedData, editComments, getAUserExceedData, handleExceedValues,getExceedDataByUserName }
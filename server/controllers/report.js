const CalibrationExceeded = require('../models/calibrationExceed');
const User = require('../models/user');
const Report = require('../models/report');


// Create Report

const createReport = async (req,res)=>{
    const {userName,industryType,companyName, fromDate,toDate, engineerName, reportApproved} = req.body;

        try{
            //find user matching criteria
            const user = await User.findOne({userName, industryType, companyName});

            if(!user){
                return res.status(404).json({message:'User Not Found'});
            }

            //Fetch calibration exceeds within date range

            const calibrationExceeds =await  CalibrationExceeded.find({
                userId:user._id,
                timestamp:{ $gte: new Date(fromDate), $lte: new Date(toDate) }

            });

           //Create and save the report
           const report = new Report({
            industryType,
            companyName,
            fromDate,
            toDate,
            engineerName,
            userName,
            calibrationExceeds,
            reportApproved
           })

           await report.save()

           res.status(201).json({
            status:201,
            success:true,
            message:'Report Created Successfully',
            report
           })
        }catch(error){
            res.status(500).json({
                status:500,
                success:false,
                message:'Error in creating report',
                error:error.message
            })
        }
};


//Find all the report

const findReport = async (req,res)=>{
    try {
        const report =await Report.find();
        
        if(!report){
            return res.status(404).json({
                
                message:'Report Not Found', 
            })
            
        }
        res.status(200).json({
            status:200,
            success:true,
            message:'All reports are fetched',
            report,
          })
    } catch (error) {
        res.status(500).json({
            status:500,
            success:true,
            message:'Internal server error',
            error:error.message
          })
    }
}

// Find reports by userName

const findReportsByUserName=async(req,res)=>{
    try {
        const userName =req.params.userName

        const reports = await Report.find({userName})
        if(reports.length === 0){
            return res.status(404).json({
                message:"No Reports found for this USER"
            })
        }
        res.status(200).json({
            status:200,
            success:true,
            message:'Report fetched successfully',
            reports
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            success:true,
            message:'Internal server error',
            error:error.message
          })
          
    }
}

// Edit a report  
const editReport = async(req,res)=>{
    try {
        const userId = req.params._id
        const updatedFields = req.body

        const updateReport =await Report.findByIdAndUpdate(userId,updatedFields)

        if(!updateReport){
            return res.status(404).json({message:'Report not found'})
        }
        res.status(200).json({
            status:200,
            success:true,
            message:'Report updated successfully',
            reports:updateReport
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            success:true,
            message:'Error in Edit your Report',
            error:error.message
          })
    }
}

//Delete a report

const deletedReport = async(req,res)=>{
    try{
        const userId =req.params._id

        const deleteReport =await Report.findByIdAndDelete(userId);
        
        if(!deleteReport){
            return res.status(404).json({message:'Report not found'})
        }
        res.status(200).json({
            status:200,
            succes:true,
            message:'Report Deleted Successfully',
            deletedReport
        })
    }catch(error){
        res.status(500).json({
            status:500,
            success:true,
            message:'Error in Deleting report',
            error:error.message
          })
    }
}



module.exports = {createReport,findReport,findReportsByUserName,editReport,deletedReport};

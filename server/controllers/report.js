const CalibrationExceeded = require('../models/calibrationExceed');
const User = require('../models/user');
const Report = require('../models/report');

const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const fs = require('fs');

// Create Report

const createReport = async (req, res) => {
  const { userName, industryType, companyName, fromDate, toDate, engineerName, reportApproved } = req.body;

  try {
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

    // Fetch and sort the data
    const calibrationExceeds = await CalibrationExceeded.find(query).sort({ timestamp: -1 });

    if (!calibrationExceeds || calibrationExceeds.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No exceeds found'
      });
    }

    // Create and save the report
    const report = new Report({
      industryType,
      companyName,
      fromDate,
      toDate,
      engineerName,
      userName,
      calibrationExceeds,
      reportApproved
    });

    await report.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Report Created Successfully',
      report
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error in creating report',
      error: error.message
    });
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
        const {userName} =req.params;
        const updatedFields = req.body

        const updateReport =await Report.findOneAndUpdate({userName:userName},updatedFields,{new:true})

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
        const { userId }  =req.params

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
            success:false,
            message:'Error in Deleting report',
            error:error.message
          })
    }
}

//Funtion to generate PDF
const generatePDF = (report,res)=>{
    const doc = new PDFDocument();

    doc.pipe(res);

    doc.fontSize(16).text(`Report Details`,{align:'center'});

    doc.moveDown();

    doc.fontSize(12).text(`Industry Type: ${report.industryType}`);
    doc.fontSize(12).text(`Company Name: ${report.companyName}`);
    doc.fontSize(12).text(`From Date: ${report.fromDate}`);
    doc.fontSize(12).text(`To Date: ${report.toDate}`);
    doc.fontSize(12).text(`Engineer Name: ${report.engineerName}`);
    doc.fontSize(12).text(`User Name: ${report.userName}`);
    doc.fontSize(12).text(`Report Approved: ${report.reportApproved ? 'Approved' : 'Deined'}`);

    doc.moveDown();
    doc.fontSize(14).text('Calibration Exceeds:', { underline: true });

    report.calibrationExceeds.forEach((exceed, index) => {
        doc.moveDown();
        doc.fontSize(12).text(`Exceed ${index + 1}:`);
        doc.fontSize(12).text(`  Parameter: ${exceed.parameter}`);
        doc.fontSize(12).text(`  Value: ${exceed.value}`);
        doc.fontSize(12).text(`  Date: ${exceed.formattedDate}`);
        doc.fontSize(12).text(`  Time: ${exceed.formattedTime}`);
        doc.fontSize(12).text(`  Message: ${exceed.message}`);
    });

    doc.end();
};

//Function to generate CSV
const generateCSV = (report,res)=>{
    const fields = [
        'industryType', 'companyName', 'fromDate', 'toDate', 'engineerName', 'userName', 'reportApproved'
    ];
    const calibrationFields =[
        'parameter','value','formattedDate', 'formattedTime', 'message'
    ];

    const csvParser =new Parser({fields});
    const csvCalibrationParser = new Parser({fields: calibrationFields})

    const csvData = csvParser.parse(report)

    let csvCalibrationData = '';
    report.calibrationExceeds.forEach((exceed,index)=>{
        csvCalibrationData += csvCalibrationParser.parse(exceed) +'/n';

    })
    res.header('Content-Type','text/csv');
    res.attachment('report.csv');
    res.send(`${csvData}\n\nCalibration Exceeds:\n ${csvCalibrationData}`);

}

//Download Report as PDF

const downloadReportAsPDF =async(req,res)=>{
    try {
        const {userId} = req.params
        const report = await Report.findById(userId);
        if(!report){
            return res.status(404).json({message:'Report not found'});
        }

        res.header('Content-Type','application/pdf');
        res.attachment('report.pdf');
        generatePDF(report,res);
    } catch (error) {
        res.status(500).json({
            status:500,
            success:false,
            message:'Error downloading report',
            error:error.message
        })
    }
}

//Download report as CSV

const downloadReportAsCSV = async (req,res) =>{
    try {
        const {userId} = req.params
        const report =await Report.findById(userId);
        
        if(!report){
            return res.stauts(404).json({
                message:'Report not found'
            })
        }
        generateCSV(report,res);
    } catch (error) {
        res.status(500).json({
            status:500,
            success:false,
            message:'Erro Downloading Report',
            error:error.message
        })
    }
}

module.exports = {createReport,findReport,findReportsByUserName,editReport,deletedReport,downloadReportAsPDF,downloadReportAsCSV};

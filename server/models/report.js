const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({

    industryType:{
        type:String,
    },
    companyName:{
        type:String,
    },
    fromDate:{
        type:String,
    },
    toDate:{
        type:String,
    },
    engineerName:{
        type:String,
    },
    userName:{
        type:String
    },
    CalibrationExceed:{
        serialNumber:{type:String},
        parameter:{type:String},
        date:{type:String},
        time:{type:String},
        commentByUser:{type: String},
        commentByAdmin: { type: String },

    },
    reportApproved:{
        approved:{
            type:Boolean,
            required:true
        }
    }

})
const Report = mongoose.model('Report',reportSchema);

module.exports =Report
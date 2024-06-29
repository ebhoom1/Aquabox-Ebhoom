const WaterParams = require('../models/SaveWaterParams');

const AddWaterParams = async(req,res)=>{
    try {
        const { product_id, ph, tds, turbidity, temperature, bod, cod,
            tss, orp, nitrate, ammonicalNitrogen, DO, chloride, PM10, PM25, NOH, NH3, WindSpeed,
            WindDir, AirTemperature, Humidity, solarRadiation, DB, date, userName,industryType,mobileNumber,email,companyName } = req.body;
            
        const newWaterParams = new WaterParams({ product_id, ph, tds, turbidity, temperature, bod, cod,
            tss, orp, nitrate, ammonicalNitrogen, DO, chloride, PM10, PM25, NOH, NH3, WindSpeed,
            WindDir, AirTemperature, Humidity, solarRadiation, DB, date, userName,industryType,mobileNumber,email,companyName })

        
        await newWaterParams.save()

        res.status(201).json({
            status:201,
            success:true,
            message:"Successfully the WaterParams are saved",
            waterParams:newWaterParams
        })
        
    } catch (error) {
        res.status(500).json({
            status:500,
            success:false,
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const getAllWaterParams = async(req,res)=>{
    try {
        const allWaterParams = await WaterParams.find()

        res.status(200).json({
            status:200,
            success:true,
            message:"Successfully fetched the Water Params",
            allWaterParams:allWaterParams
        })
    } catch (error) {
       res.status(500).json({
        status:500,
        success:false,
        message:"Error in Fetching Water Params",
        error:error.message
       }) 
    }
}

const getWaterParamsByProduct_id = async(req,res)=>{
        try{
            const {product_id} = req.params

            const waterParams = await WaterParams.findOne({product_id})

            if(!waterParams){
                res.status(404).json({message:"Not found the Product_Id"})
            }else{
                res.status(200).json({
                    status:200,
                    success:true,
                    message:"Successfully found by the Product_id",
                    waterParams:waterParams
                })
            }
        }catch(error){
            res.status(500).json({
                status:500,
                success:false,
                message:'Internal Server Error',
                error:error.message
            })
        }
}

const getWaterParamsByUserName = async(req,res)=>{
    try {
        const {userName} = req.params;

        const waterParamsByUserName= await WaterParams.findOne({userName})

        if(!waterParamsByUserName){
            res.status(404).json({message:"Not Found the userName"})
        }else{
            res.status(200).json({
                status:200,
                success:true,
                message:"Successfully fetched by the userName",
                waterParamsByUserName:waterParamsByUserName
            })
        }

    } catch (error) {
        res.status(500).json({
            status:500,
            success:false,
            message:'Internal server Error',
            error:error.message
        })
    }
}

module.exports = {AddWaterParams,getAllWaterParams,getWaterParamsByProduct_id,getWaterParamsByUserName }
const express=require('express');
const userdb=require('../models/user');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const router=express.Router()

const keysecret=process.env.SECRET_KEY

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


//For User Registration

const register=async(req,res)=>{
    const {productID , companyName, fname,email,password,cpassword,subscriptionDate,userType,industryType, dataInteval,district,state,address,longtitude,latitude}=req.body


    try{
        const preuser=await userdb.findOne({email:email})
        if(preuser){
            return res.status(422).json({error:"This Email Already Register"})
        }else if(password !== cpassword){
            return res.status(422).json({error:"Password and Confirm Password not Match"})

        }else {
            const finalUser=new userdb({
                productID , companyName, fname,email,password,cpassword,subscriptionDate,userType,industryType, dataInteval,district,state,address,longtitude,latitude
            });
            const storeData=await finalUser.save();

            return res.status(201).json({ status:201, storeData})
            
        }
    }catch (error){
        console.log(`Error : ${error}`);
        return res.status(400).json(error)
    }

}

// user login

const login = async (req, res) => {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
        return res.status(422).json({ error: "Fill all the details" });
    }

    try {
        const userValid = await userdb.findOne({ email });

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);
            if (!isMatch) {
                return res.status(422).json({ error: "Invalid User" });
            } else {
                const token = await userValid.generateAuthtoken();
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });
                const result = {
                    userValid,
                    token
                };
                return res.status(200).json({ status: 200, result }); // Send success response
            }
        } else {
            return res.status(401).json({ status: 401, message: "Invalid details" }); // Send invalid details response
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" + error});
        console.log(`Error: ${error}`); // Send internal server error response
    }
};


 // user Valid 
 
 const validuser = async(req,res)=>{
        try {
            const validUserOne= await userdb.findOne({_id: req.userId})
            return res.status(201).json({status:201, validUserOne})
        } catch (error) {
            return res.status(401).json({status:401, error})
        }
 }

//user logout
const logout = async(req,res)=>{
    try {
        req.rootUser.tokens=req.rootUser.token.filter((curelem)=>{
            return curelem.token !== req.token
        })
        await req.rootUser.save()

            res.clearCookie("usercookie", {path:"/"});

            return res.status(201).json({status: 201})
        
    } catch (error) {
        return res.status(401).json({status : 401, error})
    }
}

module.exports={register,login,validuser,logout}
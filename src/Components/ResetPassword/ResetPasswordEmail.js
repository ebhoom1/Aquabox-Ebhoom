import { Component, useState } from "react";
import {Link} from 'react-router-dom'
import "./index.css";
import { useForm } from "react-hook-form";
import {ToastContainer,toast} from 'react-toastify';
import axios from 'axios';

const ResetPasswordEmail = () => {
 
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");

  const setVal = (e)=>{
    setEmail(e.target.value)
  }
  const sendLink = async(e)=>{
    e.preventDefault();

    if(email ===""){
      toast.error("email is required")
    }else if(!email.includes("@")){
      toast.warning("Include @ in your email")
    }else {
      try {
        const response = await axios.post('http://localhost:4444/api/sendpasswordlink',{
        email:email
      },{
        headers:{
          "Content-Type":"application/json"
        }
      });
      console.log('Response Status:', response.status);
      if(response.status === 201){
        setEmail("");
        setMessage(true)
        toast.success("Reset Email link Send successfully");
      }else{
        toast.error("Invalid User")
      }
      } catch (error) {
        console.error('Error:',error);
      }
      
    }
  }

    return (
      <>
        <div className="pt-4 pb-4"></div>
        <div className="container">
        <form >
            <div className="row">
                <div className="col-12 col-lg-3"></div>
                <div className="col-12 col-lg-6">
                  <p className="signup-head">Enter Email to receive Reset Password link</p>
                  <input
                    className="input-field mb-4"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={setVal}
                    />
                   {/* <span className="error">Please Enter your Email ID!</span>
                     <span className="error">Please Enter valid Email ID!</span> */}
                {/* <Link className="link" to="/reset-password-otp"><button className="signin-button mb-5">Send OTP</button></Link> */}
                <button className="signin-button mb-5" type="submit"onClick={sendLink}>Reset Email</button> 

                <div className="text-center">
                <Link className="link" to="/"><button className='home-button'>Home</button></Link>
                </div>
                </div>
                <div className="col-12 col-lg-3"></div>
              </div>
        </form>
        <ToastContainer/>
        </div>
      </>
    );
  
}

export default ResetPasswordEmail;

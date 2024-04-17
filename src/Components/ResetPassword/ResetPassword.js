import { Component, useState } from "react";
import {Link,useParams} from 'react-router-dom'
import "./index.css";
import {ToastContainer,toast} from 'react-toastify';
import axios from 'axios';
import { useForm } from "react-hook-form";

import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const ResetPassword = () => { 

 const {id,token}= useParams();
 const history = useNavigate();

 const [data2,setData]=useState("");
 const [password,setPassword]=useState("");
 const [cpassword, setConfirmPassword] = useState("");
 const [message,setMessage]=useState("");

 const userValid = async () =>{
      try {
       const response = await axios.get(`http://localhost:4444/api/forgotpassword/${id}/${token}`,{
          headers:{
            "Content-Type":"application/json",
            "Accept":'application/json'
          }
        });
        const data = response.data;
        if(data.status === 201){
          console.log(`User Valid`);
        }else{
          history("*")
        }
      } catch (error) {
        console.error(`Error:`,error);
      }
 }
 const setVal = (e) => {
  const { name, value } = e.target;
  if (name === "password") {
    setPassword(value);
  } else if (name === "cpassword") {
    setConfirmPassword(value);
  }
}

const sendPassword = async (e) => {
  e.preventDefault();
  if (password === "") {
    toast.error("Password is required");
  } else if (password.length < 8) {
    toast.error("Password must be at least 8 characters long");
  } else if (password !== cpassword) {
    toast.error("Password and Confirm Password do not match");
  } else {
    try {
      const res = await axios.post(
        `http://localhost:4444/api/${id}/${token}`,
        {
          password,
          cpassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = res.data;
      if (data.status === 201) {
        setPassword("");
        setConfirmPassword("")
        setMessage(true);
        toast.success("Password changed successfully");
      } else {
        toast.error("Token expired. Generate a new link.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

useState(()=>{
  userValid()
  setTimeout(()=>{
    setData(true)
  },3000)
},[])
    return (
      <>
     
        <div className="pt-4 pb-4"></div>
        <div className="container">
        <form >
          
            <div className="row">
                <div className="col-12 col-lg-3"></div>
                <div className="col-12 col-lg-6">
                  <p className="signup-head">Reset Password</p>
                  <input
                    className="input-field mb-4"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={setVal}
                  />
                  {/* <span className="error">Minimum 8 Characters required</span>
                   <span className="error">Password is required</span> */}
                  
                  <input
                    className="input-field mb-4"
                    type="password"
                    placeholder="Confirm password"
                    name="cpassword"
                    value={cpassword}
                    onChange={setVal}
                  />
                  {/* <span className="error">Confirm Password is required</span>
                  <span className="error"></span> */}
                
                  
                <button className="signin-button mb-5" type="submit" onClick={sendPassword}>Reset</button>

                <div className="text-center">
                <Link className="link" to="/"> <button className='home-button'>Cancel</button> </Link>
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

export default ResetPassword;

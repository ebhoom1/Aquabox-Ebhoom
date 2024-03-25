import { Component } from "react";
import {Link} from 'react-router-dom'
import "./index.css";
import { useForm } from "react-hook-form";

const ResetPasswordEmail = () => {
 

    return (
      <>
        <div className="pt-4 pb-4"></div>
        <div className="container">
        <form >
            <div className="row">
                <div className="col-12 col-lg-3"></div>
                <div className="col-12 col-lg-6">
                  <p className="signup-head">Enter Email to receive OTP</p>
                  <input
                    className="input-field mb-4"
                    type="text"
                    placeholder="Email"/>
                   <span className="error">Please Enter your Email ID!</span>
                     <span className="error">Please Enter valid Email ID!</span>
                {/* <Link className="link" to="/reset-password-otp"><button className="signin-button mb-5">Send OTP</button></Link> */}
                <button className="signin-button mb-5" type="submit">Send OTP</button> 

                <div className="text-center">
                <Link className="link" to="/"><button className='home-button'>Home</button></Link>
                </div>
                </div>
                <div className="col-12 col-lg-3"></div>
              </div>
        </form>
        </div>
      </>
    );
  
}

export default ResetPasswordEmail;

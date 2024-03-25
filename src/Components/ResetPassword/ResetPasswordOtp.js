import { Component } from "react";
import {Link} from 'react-router-dom'
import "./index.css";

import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const ResetPasswordOtp = () => {

  

    return (
      <>
        <div className="pt-4 pb-4"></div>
        <div className="container">
        <form >
            <div className="row">
                <div className="col-12 col-lg-3"></div>
                <div className="col-12 col-lg-6">
                  <p className="signup-head">Enter 6 digit OTP</p>
                  <input
                    className="input-field-confirmation mb-4"
                    type="password"
                    placeholder="Enter OTP"
                     />
                     <span className="error">Please Enter OTP!</span>
                
                   <button className="signin-button mb-5" type="submit">Continue</button>

                <div className="text-center">
                <Link className="link" to="/"> <button className='home-button'>Home</button></Link>
                </div>
                </div>
                <div className="col-12 col-lg-3"></div>
              </div>
          </form>
        </div>
      </>
    );
  
}

export default ResetPasswordOtp;

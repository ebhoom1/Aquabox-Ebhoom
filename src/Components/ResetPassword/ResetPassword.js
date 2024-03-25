import { Component } from "react";
import {Link} from 'react-router-dom'
import "./index.css";


import { useForm } from "react-hook-form";

import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const ResetPassword = () => { 

 

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
                  />
                  <span className="error">Minimum 8 Characters required</span>
                   <span className="error">Password is required</span>
                  
                  <input
                    className="input-field mb-4"
                    type="password"
                    placeholder="Confirm password"
                    name="confirm_password"
                  />
                  <span className="error">Confirm Password is required</span>
                  <span className="error"></span>
                
                  
                <button className="signin-button mb-5" type="submit">Reset</button>

                <div className="text-center">
                <Link className="link" to="/"> <button className='home-button'>Cancel</button> </Link>
                </div>
                </div>
                <div className="col-12 col-lg-3"></div>
              </div>
              
          </form>
        </div>
      </>
    );
  
}

export default ResetPassword;

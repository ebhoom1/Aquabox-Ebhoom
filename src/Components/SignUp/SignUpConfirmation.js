import { Component, useState } from "react";
import { useForm } from "react-hook-form";
import {Link} from 'react-router-dom'

import { useEffect } from 'react';
import "./index.css";

const SignUpConfirmation = () => {

 
   
    return (
      <>
        <div className="pt-4 pb-4"></div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-3"></div>
                  <div className="col-12 col-lg-6">
                 
                    <div className="alert alert-danger mt-3 mb-0"></div>
                  
                   <form >
                        <p className="signup-head">We’ve send a confirmation code to your email</p>
                        <input
                          className="input-field-confirmation mb-4"
                          type="text"
                          placeholder="Enter confirmation code"
                         
                        /> 
                       <span className="error">This field is required</span>                
                        <button className="signin-button mb-5">Sign Up</button>
                      <div className="text-center">
                      <Link className="link" to="/"> <button className='home-button'>Home</button></Link>
                      </div>
                  </form>
                  </div>
            <div className="col-12 col-lg-3"></div>
          </div>
        </div>
      </>
    );
  
}

export default SignUpConfirmation;

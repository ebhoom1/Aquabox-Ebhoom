import { Component, useState } from "react";
import { Link } from 'react-router-dom'
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useEffect } from 'react';


const SignIn = () => {

  
  return (
    <>
      <div className="pt-4 pb-4"></div>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6 blue-box">
            <h1 className="blue-box-text">
              Monitor and Control <br /> your  <br /> Water Treatment Plant
            </h1>
          </div>
          <div className="col-12 col-lg-6 padd pt-4">

          
              <div className="alert alert-danger mt-3 mb-0"></div>
            
            <form >
              <p className="signin-text mb-5">Sign In</p>
              <span className="error"></span>
              <div className="mb-4">
                <input className="input-field" type="text" placeholder="Email"  />
                 <span className="error">This field is required</span>
              </div>
              <div className="mb-4">
                <input className="input-field" type="password" placeholder="Password"  />
                 <span className="error">This field is required</span>
              </div>
              <Link className="link" to="/reset-password-email"> <p className="forgot">Forgot password?</p></Link>
              <select className="input-field mb-4">
                <option value="company">Company</option>
                <option value="staff">Staff</option>
              </select>
              <Link className="link" to="/dashboard"> <button type="submit" className="signin-button" >Sign In</button></Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;

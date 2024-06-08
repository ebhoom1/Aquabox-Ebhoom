import { useState } from "react";
import { Link } from 'react-router-dom'
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';



const SignUp = () => {


  
  
    return (
      <>
        <div className="pt-4 pb-4"></div>
        <div className="container">
          <div className="row ">
             
                  <div className="col-12 col-lg-3"></div>
                  <div className="col-12 col-lg-6 ">

                  
                      <div className="alert alert-danger mt-3 mb-0"></div>
                    
                    <form >
                        <p className="signup-head">Get yourself an with Product ID</p>
                          <div className="mb-4">
                            <input
                              className="input-field"
                              type="number"
                              placeholder="Product ID"
                              name="product_id"
                             
                            />
                            <span className="error">Product ID required</span>
                          </div>
                          <div className="mb-4">
                            <input
                              className="input-field"
                              type="text"
                              placeholder="First Name"
                              name="firstName"
                              
                            />
                           <span className="error">Minimum 2 Characters required</span>
                            <span className="error">First Name required</span>
                          </div>
                          <div className="mb-4">
                            <input
                              className="input-field"
                              type="text"
                              placeholder="Last Name"
                              name="lastName"
                           
                            />
                           <span className="error">Last Name required</span> 
                          </div>
                          <div className="mb-4">
                            <input
                              className="input-field"
                              type="text"
                              placeholder="Email"
                              name="email"
                              
                            />
                            <span className="error">Email is required</span>
                            <span className="error"></span>
                          </div>
                          <div className="mb-4">
                            <input
                              className="input-field"
                              type="password"
                              placeholder="Password"
                              name="password"
                              
                            />
                           <span className="error">Minimum 8 Characters required</span> 
                             <span className="error">Password is required</span>
                          </div>
                          <div className="mb-4">
                            <input
                              className="input-field"
                              type="password"
                              placeholder="Confirm password"
                              name="confirm_password"
                              
                            />
                            <span className="error">Confirm Password is required</span>
                            <span className="error"></span>
                          </div>

                          <div className="mb-4">
                            <select className="input-field" >
                              <option value="company">Company</option>
                              <option value="staff">Staff</option>
                            </select>
                          </div>
                          <div className="mb-4">
                            <input type="checkbox" id="terms" name="terms" value="terms"
                             />
                            <label className="terms-text">
                              {" "}
                              Agree to our <a href="">terms and conditions</a>
                            </label>
                            <span className="error">Please Accept terms and conditions </span>
                          </div>
                        <button className="signin-button mb-5" type="submit">Continue</button>                    
                        {/* <Link className="link" to="/signup-confirmation"> <button className="signin-button mb-5">Continue</button></Link> */}
      
                      <div className="text-center">
                      <p>Already have an account?</p>
                        <Link className="link" to="/"><button className='signup-button' type="button">Sign In</button></Link>
                      </div>
                   </form>
                  </div>
                <div className="col-12 col-lg-3"></div>
              
          </div>
        </div>
      </>
    );
  }

export default SignUp;

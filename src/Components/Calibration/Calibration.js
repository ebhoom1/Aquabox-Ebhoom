import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import LeftSideBar from "../LeftSideBar/LeftSideBar";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import CalibrationData from './Calibration-Data';



const Calibration = () => { 

    return (
      <div className="main-panel">
        <div className="content-wrapper">
          {/* <!-- Page Title Header Starts--> */}
          <div className="row page-title-header">
            <div className="col-12">
              <div className="page-header">
                <h4 className="page-title">Control and Monitor Dashboard</h4>
                <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                  {/* <!-- <ul className="quick-links">
                <li><a href="#">option 1</a></li>
                <li><a href="#">Own analysis</a></li>
                <li><a href="#"> data</a></li>
              </ul> --> */}
                  <ul className="quick-links ml-auto">
                    <li>
                      <a href="#">Settings</a>
                    </li>
                    <li>
                      <a href="#">Option 1</a>
                    </li>
                    <li>
                      <a href="#">option 2</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Page Title Header Ends--> */}

          <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body ">
                      
                     
                <form >
                      <div className="row">
                          <div className="col-12">
                            <h1>Add Calibration Details</h1>
                             {/* <h1>Update User</h1> */}
                          </div>

                          

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Date of Calibration</label>
                            <input type="date" className="form-control" id="exampleFormControlInput4" placeholder="Date of Calibration" 
                           />
                            {/* <span className="error">Subscription Date required</span> */}
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">User Type</label>
                              <select className="input-field" >
                               
                                <option value="ambientAir">Ambient Air</option>
                                <option value="effluent-water">Effluent/Water</option>
                                <option value="noise">Noise</option>

                              </select>
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">User Number</label>
                              
                                <select className="input-field" >
                               <option>User 1</option>
                               <option>User 2</option>
                               <option>User 3</option>
                              </select>
                             
                          </div>
                          

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">Equipment Name</label>
                            <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="Equipment Name"
                            />
                            {/* <span className="error">District required</span>
                            <span className="error">Invalid District name</span>
                            <span className="error">Minimum 3 Characters required</span>  */}
                          </div>
                          <div className="col-12">
                            <h1>Results</h1>
                             {/* <h1>Update User</h1> */}
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Before</label>
                            <textarea type="text" className="form-control" id="exampleFormControlInput6" placeholder="Before" 
                            />
                            {/* <span className="error">State required</span>
                            <span className="error">Invalid State name</span>
                            <span className="error">Minimum 3 Characters required</span> */}
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">After</label>
                            <textarea type="text" className="form-control" id="exampleFormControlInput6" placeholder="After" 
                            />
                            {/* <span className="error">State required</span>
                            <span className="error">Invalid State name</span>
                            <span className="error">Minimum 3 Characters required</span> */}
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Technician</label>
                            <input type="text" className="form-control" id="exampleFormControlInput6" placeholder="Technician Name" 
                            />
                            {/* <span className="error">State required</span>
                            <span className="error">Invalid State name</span>
                            <span className="error">Minimum 3 Characters required</span> */}
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Notes</label>
                            <textarea type="text" className="form-control" id="exampleFormControlInput6" placeholder="Notes" 
                            />
                            {/* <span className="error">State required</span>
                            <span className="error">Invalid State name</span>
                            <span className="error">Minimum 3 Characters required</span> */}
                          </div>
                         
                          <div className="mt-4 mb-5 p-2">
                            <button type="submit" className="btn btn-primary mb-2"> Add Calibration </button>
                          </div>
                          
                            <div className="mt-4 mb-5 p-2">
                            <button type="button"  className="btn btn-danger mb-2"> Cancel </button>
                            </div>
                            
                          
                      </div>
                  </form>
                 
                </div>
              </div>
            </div>
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body">
                <CalibrationData/>
                </div>
                </div>
                </div>
          </div>

        </div>

        <footer className="footer">
          <div className="container-fluid clearfix">
            <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
              AquaBox Control and Monitor System
            </span>
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
              {" "}
              ©{" "}
              <a href="" target="_blank">
                Ebhoom Solutions LLP
              </a>{" "}
              2022
            </span>
          </div>
        </footer>
      </div>
    )
}


export default Calibration;
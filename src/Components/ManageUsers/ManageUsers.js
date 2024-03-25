import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import LeftSideBar from "../LeftSideBar/LeftSideBar";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';



const AddUsers = () => { 

 
   
    return (
      <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body">
                      
                        <div className="alert alert-danger mt-3 mb-0"></div>
                        
                        {/* {updateError &&
                        <div className="alert alert-danger mt-3 mb-0">{updateError.message}</div>
                        } */}
                <form >
                      <div className="row">
                          <div className="col-12">
                            <h1>Add New User</h1>
                             {/* <h1>Update User</h1> */}
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput1">Product ID</label>
                            <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Enter Product Id"
                            />
                             <span className="error">Product ID required</span>
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput2">Company Name</label>
                            <input type="text" className="form-control" id="exampleFormControlInput2" placeholder="Enter Company Name"
                            />
                            <span className="error">Invalid Company Name</span>
                            <span className="error">Company Name required</span>
                            <span className="error">Minimum 2 Characters required</span>
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">First Name</label>
                            <input type="text" className="form-control" id="exampleFormControlInput3" placeholder="Enter First Name"
                           />
                            <span className="error">First Name required</span>
                            <span className="error">Minimum 2 Characters required</span>
                            <span className="error">Invalid First Name</span>
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Last Name</label>
                            <input type="text" className="form-control" id="exampleFormControlInput3" placeholder="Enter Last Name"
                           />
                            <span className="error">Customer Name required</span>
                            <span className="error">Invalid Last Name</span>
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Email</label>
                            <input type="email" className="form-control" id="exampleFormControlInput3" placeholder="Enter Email"
                            />
                             <span className="error"></span>
                            <span className="error">Email is required</span>
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Password</label>
                            <input type="text" className="form-control" id="exampleFormControlInput3" placeholder="Enter Password"
                           />
                            <span className="error">Password is required</span>
                            <span className="error">Minimum 8 Characters required</span>
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Date of Subscription</label>
                            <input type="date" className="form-control" id="exampleFormControlInput4" placeholder="Enter Subscription date" 
                           />
                            <span className="error">Subscription Date required</span>
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
                            <label htmlFor="exampleFormControlInput5">District</label>
                            <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="Enter District"
                            />
                            <span className="error">District required</span>
                            <span className="error">Invalid District name</span>
                            <span className="error">Minimum 3 Characters required</span> 
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">State</label>
                            <input type="text" className="form-control" id="exampleFormControlInput6" placeholder="Enter State" 
                            />
                            <span className="error">State required</span>
                            <span className="error">Invalid State name</span>
                            <span className="error">Minimum 3 Characters required</span>
                          </div>

                          <div className="mb-3 p-2">
                            <button type="submit" className="btn btn-primary mb-2"> Add User </button>
                          </div>
                          
                            <div className="mb-3 p-2">
                            <button type="button"  className="btn btn-danger mb-2"> Cancel </button>
                            </div>
                            
                          
                      </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
    )
  
}
const DeleteUsers = () => { 



    return (
      <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body">

                       
                        <div className="alert alert-danger mt-3 mb-0">m</div>
                        

                <form >
                    <div className="row">
                        <div className="col-12">
                          <h1>Delete User</h1>
                        </div>
                        <div className="col-12 col-lg-6 col-md-6 mb-3">
                          <label htmlFor="exampleFormControlInput7">Product Id</label>
                          <input type="number" className="form-control" id="exampleFormControlInput7" placeholder="Enter Product Id" 
                          />
                          <span className="error">Product ID required</span>
                        </div>
                        <div className="col-12  mb-3">
                          <button type="submit" className="btn btn-danger mb-2">Delete User</button>
                        </div>
                      </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
    )
}



const ManageUsers = () => { 

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

          <AddUsers/>
          <DeleteUsers/>

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


export default ManageUsers;
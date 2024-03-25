import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import './index.css'
import { useOutletContext } from "react-router-dom";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Link } from 'react-router-dom';
import LeftSideBar from "../LeftSideBar/LeftSideBar";
import { DateRangePicker } from 'rsuite';
import { useForm, Controller } from "react-hook-form";

const UsersLog = () => {

  

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
          <div className="col-12 col-md-6 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h1>Active Users List</h1>
                  </div>
                  <div className="col-12  mb-3">
                    <ul className="list-group">
                      
                        <li>
                          <div className="FloatRight">
                            <a >View</a>
                            <a >Login</a>
                          </div>

                        </li>
                     
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h1>Non Active Users List</h1>
                  </div>

                  <div className="col-12  mb-3">
                    <ul className="list-group">
                      <li className="list-group-item">1.Product ID</li>
                      <li className="list-group-item">2.Product ID</li>
                      <li className="list-group-item">3.Product ID</li>
                      <li className="list-group-item">4.1233242</li>
                      <li className="list-group-item">5.1321312</li>
                    </ul> </div>


                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <form  target="_blank" method="post">
                  <label htmlFor="exampleFormControlInput5">User</label>
                  <select id="pdid" className="input-field" >
                    
                      <option>oo</option>
                   
                  </select>
                  
                  <input type="hidden" name="auth" />
                  <input type="hidden" name="from"  />
                  <input type="hidden" name="to"  />
                  <button type="submit" className="btn btn-primary mb-2"> Download </button>
                </form>

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
  );

}

export default UsersLog;
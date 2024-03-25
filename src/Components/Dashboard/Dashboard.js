import React, { createContext, useEffect, useState } from "react";
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

const Dashboard = () => {

 

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        {/* <!-- Page Title Header Starts--> */}
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">EFFLUENT/WATER DASHBOARD</h4>
              <p></p>
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
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">pH level</h3>
                  </div>
                  <div className="col-12 mb-3">
                    <h1></h1>
                    {/* <h4>Alkaline Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week:  </p>
                    <p>Last Month: </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">TDS</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1> mg/l</h1>
                    {/* <h4>Ideal Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week: </p>
                    <p>Last Month: </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Turbidity</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>NTU</h1>
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week: </p>
                    <p>Last Month: </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Temperature</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>Temperature </h1>
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week: </p>
                    <p>Last Month: </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">BOD</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>bod mg/l</h1>
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week: </p>
                    <p>Last Month:</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">COD</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>cod mg/l</h1>
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week:</p>
                    <p>Last Month:</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">TSS</h3>
                  </div>
                  <div className="col-12 mb-3">
                    <h1>tss mg/l</h1>
                    {/* <h4>Alkaline Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week:</p>
                    <p>Last Month:</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">ORP</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>orp mV</h1>
                    {/* <h4>Ideal Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week:</p>
                    <p>Last Month: </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Nitrate</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>nitrate mg/l</h1>
                    {/* <h4>Ideal Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week:</p>
                    <p>Last Month:</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Ammonical Nitrogen</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>ammonical_nitrogen mg/l</h1>
                    {/* <h4>Ideal Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week:</p>
                    <p>Last Month: </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">DO</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>do mg/l</h1>
                    {/* <h4>Ideal Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week:  </p>
                    <p>Last Month:</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Chloride</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>chloride mmol/l</h1>
                    {/* <h4>Ideal Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week:  </p>
                    <p>Last Month:</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Colour</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>color</h1>
                    {/* <h4>Ideal Water</h4> */}
                  </div>

                  <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week: - </p>
                    <p>Last Month: - </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-12 col-md-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Turbidity</h3>
                  </div> */}

          {/* <div className="col-12 mb-3">
                    <h1>{props.turbidity} NTU</h1>
                  </div> */}

          {/* <div className="col-12">
                    <h5 className="text-dark">Average</h5>
                    <p className="mb-0">Last Week: {dataWeekly.turbidity}</p>
                    <p>Last Month: {dataMonthly.turbidity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

    

        {/* <!-- automtic mode   --> */}

        {/* <div className="row">
          <div className="col-12 col-md-6 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">
                      Automatic Mode{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-clock-history"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                      </svg>
                    </h3>
                  </div>
                  <div className="col-12">  
                    <div className="onoffswitch">  
                      <input
                        type="checkbox"
                        name="automatic_mode"
                        className="onoffswitch-checkbox"
                        id="myonoffswitch"
                        tabIndex="0"
                       
                      /> 
                      <label 
                        className="onoffswitch-label"
                        htmlFor="myonoffswitch"
                      >
                        <span className="onoffswitch-inner"></span>
                        <span className="onoffswitch-switch"></span>
                      </label>
                    </div>
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
                    <h3 className="mb-3">Water Consumption</h3>
                  </div>

                  <div className="col-12">
                    <h3>Inlet :</h3>
                    <h3>Outlet :</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* <!-- automtic mode ends  -->

        <!-- water level  --> */}

        {/* <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h1 className="mb-3">Tank Water Level</h1>
                  </div>
                  <ResponsiveContainer width="95%" height={300}>
                    <BarChart>
                      <Tooltip
                        wrapperStyle={{
                          width: 100,
                          backgroundColor: "#ccc",
                        }}
                        formatter={function (level) {
                          return `${level}%`;
                        }}
                      />
                      <Bar dataKey="level" fill="#236A80" />
                      <CartesianGrid stroke="#ffffff" />
                      <XAxis dataKey="tank" />
                      <YAxis />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* <!-- water level ends  -->


        <!-- pump  --> */}
{/* 
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h1 className="mb-3">Pump controls</h1>
                  </div>
                  <div className="col-lg-2 col-md-4 mt-md-0 mt-4 mb-3">
                    <div className="d-flex">
                      <div className="wrapper">
                        <div className="onoffswitch">
                          <input
                            type="checkbox"
                            name="Pump1"
                            className="onoffswitch-checkbox"
                            id="myonoffswitch1"
                            tabIndex="0"
                            
                          />
                          <label
                            className="onoffswitch-label"
                            htmlFor="myonoffswitch1"
                          >
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                          </label>
                        </div>

                        <h5 className="mb-0 font-weight-medium text-primary text-center">
                          Pump 1
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 mt-md-0 mt-4 mb-3">
                    <div className="d-flex">
                      <div className="wrapper">
                        <div className="onoffswitch">
                        <input
                            type="checkbox"
                            name="Pump2"
                            className="onoffswitch-checkbox"
                            id="myonoffswitch2"
                            tabIndex="0"
                           
                          />
                          <label
                            className="onoffswitch-label"
                            htmlFor="myonoffswitch2"
                          >
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                          </label>
                        </div>

                        <h5 className="mb-0 font-weight-medium text-primary text-center">
                          Pump 2
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 mt-md-0 mt-4 mb-3">
                    <div className="d-flex">
                      <div className="wrapper">
                        <div className="onoffswitch">
                        <input
                            type="checkbox"
                            name="Pump3"
                            className="onoffswitch-checkbox"
                            id="myonoffswitch3"
                            tabIndex="0"
                            
                          />
                          <label
                            className="onoffswitch-label"
                            htmlFor="myonoffswitch3"
                          >
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                          </label>
                        </div>

                        <h5 className="mb-0 font-weight-medium text-primary text-center">
                          Pump 3
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 mt-md-0 mt-4 mb-3">
                    <div className="d-flex">
                      <div className="wrapper">
                        <div className="onoffswitch">
                        <input
                            type="checkbox"
                            name="Pump4"
                            className="onoffswitch-checkbox"
                            id="myonoffswitch4"
                            tabIndex="0"
                          
                          />
                          <label
                            className="onoffswitch-label"
                            htmlFor="myonoffswitch4"
                          >
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                          </label>
                        </div>

                        <h5 className="mb-0 font-weight-medium text-primary text-center">
                          Pump 4
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-2 col-md-4 mt-md-0 mt-4 mb-3">
                    <div className="d-flex">
                      <div className="wrapper">
                        <div className="onoffswitch">
                        <input
                            type="checkbox"
                            name="Pump5"
                            className="onoffswitch-checkbox"
                            id="myonoffswitch5"
                            tabIndex="0"
                            
                          />
                          <label
                            className="onoffswitch-label"
                            htmlFor="myonoffswitch5"
                          >
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                          </label>
                        </div>

                        <h5 className="mb-0 font-weight-medium text-primary text-center">
                          Pump 5
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 mt-md-0 mt-4 mb-3">
                    <div className="d-flex">
                      <div className="wrapper">
                        <div className="onoffswitch">
                        <input
                            type="checkbox"
                            name="Pump6"
                            className="onoffswitch-checkbox"
                            id="myonoffswitch6"
                            tabIndex="0"
                           
                          />
                          <label
                            className="onoffswitch-label"
                            htmlFor="myonoffswitch6"
                          >
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                          </label>
                        </div>

                        <h5 className="mb-0 font-weight-medium text-primary text-center">
                          Pump 6
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-2 col-md-4 mt-md-0 mt-4 mb-3">
                    <div className="d-flex">
                      <div className="wrapper">
                        <div className="onoffswitch">
                        <input
                            type="checkbox"
                            name="Pump7"
                            className="onoffswitch-checkbox"
                            id="myonoffswitch7"
                            tabIndex="0"
                           
                          />
                          <label
                            className="onoffswitch-label"
                            htmlFor="myonoffswitch7"
                          >
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                          </label>
                        </div>

                        <h5 className="mb-0 font-weight-medium text-primary text-center">
                          Pump 7
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 mt-md-0 mt-4 mb-3">
                    <div className="d-flex">
                      <div className="wrapper">
                        <div className="onoffswitch">
                        <input
                            type="checkbox"
                            name="Pump8"
                            className="onoffswitch-checkbox"
                            id="myonoffswitch8"
                            tabIndex="0"
                            
                          />
                          <label
                            className="onoffswitch-label"
                            htmlFor="myonoffswitch8"
                          >
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                          </label>
                        </div>

                        <h5 className="mb-0 font-weight-medium text-primary text-center">
                          Pump 8
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* <!-- pumb ends  -->

        <!-- tab mode   --> */}


      </div>

      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
            Ebhoom Control and Monitor System
          </span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
            {" "}
            ©{" "}
            <a href="" target="_blank">
              Ebhoom Solutions LLP
            </a>{" "}
            2023
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;

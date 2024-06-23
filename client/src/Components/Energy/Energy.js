import React, { useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ToastContainer } from 'react-toastify';
import { data, data7Days, data30Days, data90Days, data6Months, data1Year } from './data';

const Energy = () => {
  const [selectedRange, setSelectedRange] = useState('today');

  const getData = () => {
    switch (selectedRange) {
      case '7-days':
        return data7Days;
      case '30-days':
        return data30Days;
      case '90-days':
        return data90Days;
      case '6-months':
        return data6Months;
      case '1-year':
        return data1Year;
      default:
        return data;
    }
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        {/* Page Title Header Starts */}
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Energy Dashboard</h4>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                <ul className="quick-links ml-auto">
                  <li><a href="#">Settings</a></li>
                  <li><a href="#">Option 1</a></li>
                  <li><a href="#">Option 2</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
       
          
                <div className="card mb-4">
            <div className="card-body">
            <h1>Find Users</h1>
            
            <form className="form-inline  my-2 my-lg-0">
                      <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        
                      />
                      <button className="btn btn-outline-primary my-2 my-sm-0" type="submit"  >
                        Search
                      </button>
                     
                    </form>
                    
            
            <h1></h1>
           
            </div>
         
          </div>
        
        {/* Water Flow Table */}
        <div className="card">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <h2>Energy Flow</h2>
                <div className="table-responsive mt-3">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>SI.No</th>
                        <th>Parameter</th>
                        <th>Acceptable <br/> Limits</th>
                        <th>22-<br/>Jun</th>
                        <th>23-<br/>Jun</th>
                        <th>24-<br/>Jun</th>
                        <th>25-<br/>Jun</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>FL - STP Incomer Energy Consumption, kWh</td>
                        <td>0.0-1000.0</td>
                        <td>592</td>
                        <td>492</td>
                        <td>592</td>
                        <td>492</td>
                      </tr>
                      
                    </tbody>
                  </table>
                </div>
                <ToastContainer />
              </div>
            </div>
          </div>
        </div>


        {/* {Bar Chart for FL-Treated Water} */}
          <div className="card mt-4 mb-5">
            <div className="card-body">
              <div className="row mt-5">
                <div className="col-md-12">
                  <h2 className="m-3">Trending Analysis  - FL - STP Incomer Energy Consumption, kWh</h2>
                  <div className="btn-group mb-5" role="group" aria-label="Date Range">
                    <button
                      type="button"
                      className={`btn btn-primary ${selectedRange === 'today' ? 'active' : ''}`}
                      onClick={() => handleRangeChange('today')}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className={`btn btn-primary ${selectedRange === '7-days' ? 'active' : ''}`}
                      onClick={() => handleRangeChange('7-days')}
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      className={`btn btn-primary ${selectedRange === '30-days' ? 'active' : ''}`}
                      onClick={() => handleRangeChange('30-days')}
                    >
                      30 Days
                    </button>
                    <button
                      type="button"
                      className={`btn btn-primary ${selectedRange === '90-days' ? 'active' : ''}`}
                      onClick={() => handleRangeChange('90-days')}
                    >
                      90 Days
                    </button>
                    <button
                      type="button"
                      className={`btn btn-primary ${selectedRange === '6-months' ? 'active' : ''}`}
                      onClick={() => handleRangeChange('6-months')}
                    >
                      6 Months
                    </button>
                    <button
                      type="button"
                      className={`btn btn-primary ${selectedRange === '1-year' ? 'active' : ''}`}
                      onClick={() => handleRangeChange('1-year')}
                    >
                      1 Year
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      width={500}
                      height={300}
                      data={getData()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pv" fill="#8884d8" />
                      <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                  <ul>
                    <li>Minimum value: 0.0 KLD was on 02AM - 3AM</li>
                    <li>Maximum value: 48.6 KLD was on 10AM - 11AM</li>
                  </ul>
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
    </div>
  );
};

export default Energy;

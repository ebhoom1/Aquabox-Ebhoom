import './index.css';
import React, { createContext, useEffect, useState } from "react";
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

const Noise = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("week"); // Default to week
  const [heading, setHeading] = useState("Week");

  // Mock data for demonstration
  const weekData = [{ name: "Mon", value: 30 }, { name: "Tue", value: 40 },{ name: "wed", value: 20 }];
  const monthData = [{ name: "Week 1", value: 150 }, { name: "Week 2", value: 180 }];

  const handleCardClick = (timeFrame) => {
    setShowPopup(true);
    setTimeFrame(timeFrame);
    setPopupData(timeFrame === "week" ? weekData : monthData);
    setHeading(timeFrame === "week" ? "Week" : "Month");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        {/* <!-- Page Title Header Starts--> */}
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Noise DASHBOARD</h4>
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
            <div className="card" onClick={() => handleCardClick("week")}>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Limits in DB</h3>
                  </div>
                  <div className="col-12 mb-3">
                    <h1> dB</h1>
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
        </div>

        {/* Popup */}
        {/* Popup */}
{showPopup && (
  <div className="popup-container">
    <div className="popup">
      <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
      <h3>{heading}</h3>
      <button className="indicator" onClick={() => handleCardClick("week")}>Week</button>
      <button className="indicator" onClick={() => handleCardClick("month")}>Month</button>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={popupData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
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
};

export default Noise;

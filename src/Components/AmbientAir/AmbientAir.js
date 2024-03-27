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
import Popup from "./popup";

const AmbientAir = () => {

 const [showPopup,setShowPopup]=useState(false);
 const [selectedCard, setSelectedCard]=useState(null);

 // Sample data for demonstration, replace with your actual data
 const weekData = [{ name: "Mon", value: 30 }, { name: "Tue", value: 40 }, { name: "Wed", value: 50 }];
 const monthData = [{ name: "Week 1", value: 100 }, { name: "Week 2", value: 200 }, { name: "Week 3", value: 150 }];

 const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCard(null);
  };
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        {/* <!-- Page Title Header Starts--> */}
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Ambient Air DASHBOARD</h4>
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
            <div className="card" onClick={() =>handleCardClick({ title: "PM 10" })}>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">PM 10</h3>
                  </div>
                  <div className="col-12 mb-3">
                  <h1> pg/m³ </h1>
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
            <div className="card" onClick={() =>handleCardClick({ title: "PM 2.5" })}>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">PM 2.5</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1> pg/m³ </h1>
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
                    <h3 className="mb-3">NOH</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>pg/m³ </h1>
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
                    <h3 className="mb-3">NH3</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>pg/m³ </h1>
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
                    <h3 className="mb-3">Windspeed</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>m/s</h1>
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
                    <h3 className="mb-3">Wind Dir</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>deg</h1>
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
                    <h3 className="mb-3">Temperature</h3>
                  </div>
                  <div className="col-12 mb-3">
                    <h1>℃</h1>
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
                    <h3 className="mb-3">Humidity</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>%</h1>
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
                    <h3 className="mb-3">Solar Radiation</h3>
                  </div>

                  <div className="col-12 mb-3">
                    <h1>w/m²</h1>
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
       
         
        </div>

    

     


      </div>
        {/* Render Popup if showPopup is true */}
        {showPopup && selectedCard && (
        <Popup
          title={selectedCard.title}
          weekData={weekData} // Pass actual week data here
          monthData={monthData} // Pass actual month data here
          onClose={handleClosePopup}
        />
      )}
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

export default AmbientAir;

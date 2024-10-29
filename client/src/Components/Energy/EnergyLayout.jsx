// EnergyDashboard.jsx
import React from "react";
import TreatmentAnalysis from "./TreatmentAnalysis";
import { useOutletContext } from "react-router-dom";
import Energy from "./Energy";
import EnergyFlow from "./EnergyFlow";
import EnergyOverview from "./EnergyOverview";
import CalibrationExceeded from "../Calibration/CalibrationExceeded";

const EnergyDashboard = () => {
  const { searchTerm, userData, userType } = useOutletContext();

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <h3 className="page-title">Energy Dashboard</h3>
          </div>
        </div>
        <div className="row">
          <EnergyFlow />
        </div>
        <div className="row">
          <EnergyOverview/>
        </div>
        <div className="row">
          <Energy searchTerm={searchTerm} userData={userData} userType={userType} />
        </div>
       
        {/* <div className="row">
          <TreatmentAnalysis searchTerm={searchTerm} userData={userData} userType={userType} />
        </div> */}
        <div className="row">
        <CalibrationExceeded />
        </div>
      </div>
      <footer className="footer">
          <div className="container-fluid clearfix">
            <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
              Ebhoom Control and Monitor System
            </span>
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
              {" "}© <a href="" target="_blank">Ebhoom Solutions LLP</a> 2023
            </span>
          </div>
        </footer>
    </div>
  );
};

export default EnergyDashboard;

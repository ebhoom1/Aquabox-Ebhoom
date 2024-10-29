// EnergyDashboard.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import WaterFlow from "./WaterFlow";
import TotalSewageGraph from "./TotalSewageGraph";
import QuantityFlow from "./QuantityFlow";
import EffluentFlowOverview from "./EffluentFlowOverview";
import CalibrationExceeded from "../Calibration/CalibrationExceeded";

const EnergyDashboard = () => {
  const { searchTerm, userData, userType } = useOutletContext();

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <h3 className="page-title">EFFLUENT FLOW DASHBOARD</h3>
          </div>
        </div>
        <div className="row">
          <QuantityFlow />
        </div>
        <div className="row">
          <EffluentFlowOverview />
        </div>
        <div className="row">
          <WaterFlow searchTerm={searchTerm} userData={userData} userType={userType} />
        </div>
        {/* <div className="row col-lg-12">
          <TotalSewageGraph searchTerm={searchTerm} userData={userData} userType={userType} />
        </div> */}
        <div className="mt-5">
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

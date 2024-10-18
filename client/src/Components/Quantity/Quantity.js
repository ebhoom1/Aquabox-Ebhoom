// EnergyDashboard.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import WaterFlow from "./WaterFlow";
import TotalSewageGraph from "./TotalSewageGraph";

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
          <WaterFlow searchTerm={searchTerm} userData={userData} userType={userType} />
        </div>
        <div className="row col-lg-12">
          <TotalSewageGraph searchTerm={searchTerm} userData={userData} userType={userType} />
        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;

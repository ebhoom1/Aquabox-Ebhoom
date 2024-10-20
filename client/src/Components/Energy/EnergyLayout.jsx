// EnergyDashboard.jsx
import React from "react";
import TreatmentAnalysis from "./TreatmentAnalysis";
import { useOutletContext } from "react-router-dom";
import Energy from "./Energy";
import EnergyFlow from "./EnergyFlow";

const EnergyDashboard = () => {
  const { searchTerm, userData, userType } = useOutletContext();

  return (
      <div className="content-wrapper">
       
        <div className="row">
        <EnergyFlow/>
        </div>
        <div className="row">
          <Energy searchTerm={searchTerm} userData={userData} userType={userType} />
        </div>
        <div className="row">
          <TreatmentAnalysis searchTerm={searchTerm} userData={userData} userType={userType} />
        </div>
      </div>
  );
};

export default EnergyDashboard;

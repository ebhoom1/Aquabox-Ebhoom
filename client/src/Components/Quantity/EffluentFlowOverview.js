import React from 'react';

const EffluentFlowOverview = () => {
  return (
    <div className="row mt-4">
      {/* First Division: Total Inflow and Outflow */}
      <div className="col-md-12">
        <h3 className="text-center">Total Inflow and Outflow</h3>
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Total Inflow</h5>
                <p className="text-center display-4">12,350 m³</p> {/* Example Value */}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Total Final Flow</h5>
                <p className="text-center display-4">11,950 m³</p> {/* Example Value */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Division: Prediction for Next Month */}
      <div className="col-md-12">
        <h3 className="text-center">Prediction for Next Month</h3>
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Prediction Inflow</h5>
                <p className="text-center display-4">13,200 m³</p> {/* Example Value */}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Prediction Outflow</h5>
                <p className="text-center display-4">12,900 m³</p> {/* Example Value */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffluentFlowOverview;

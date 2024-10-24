import React from 'react';

const EnergyOverview = () => {
  return (
   
    <div className="row mt-4">
      {/* First Division: Energy Consumption */}
      <div className="col-md-6">
        <h3 className="text-center">Energy Consumption</h3>
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Last Entered Energy</h5>
                <p className="text-center display-4">608 kWh</p> {/* Example Value */}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Total Energy Usage</h5>
                <p className="text-center display-4">15,462 kWh</p> {/* Example Value */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Division: Prediction */}
      <div className="col-md-6">
        <h3 className="text-center">Prediction</h3>
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Next Usage Prediction</h5>
                <p className="text-center display-4">650 kWh</p> {/* Example Value */}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Carbon Emission (Last Month)</h5>
                <p className="text-center display-4">320 kg CO₂</p> {/* Example Value */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default EnergyOverview;

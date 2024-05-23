import './index.css';
import React, { useEffect, useState } from "react";
import NoisePopup from './NoisePopup';
import CalibrationPopup from '../Calibration/CalibrationPopup';
import axios from 'axios';

const Noise = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCalibrationPopup, setShowCalibrationPopup] = useState(false);
  const [fetchvalue, setFetchValues] = useState([]);

  const fetchValue = async () => {
    try {
      const response = await axios.get('http://localhost:4444/api/get-all-values', {
        headers: {
          'Content-Type': "application/json",
          'Authorization': localStorage.getItem("userdatatoken"),
          Accept: 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        const data = response.data.comments;
        setFetchValues(data);
        console.log("Fetched data:", data);
      } else {
        console.log("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchValue(); // Fetch data initially
    const interval = setInterval(fetchValue, 1000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCard(null);
  };

  const handleOpenCalibrationPopup = () => {
    setShowCalibrationPopup(true);
  }

  const handleCloseCalibrationPopup = () => {
    setShowCalibrationPopup(false);
  }

  const latestValue = fetchvalue.length > 0 ? fetchvalue[fetchvalue.length - 1] : null;

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Noise DASHBOARD</h4>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                <ul className="quick-links ml-auto">
                  <h5>Data Interval:</h5>
                </ul>
                <ul className="quick-links ml-auto">
                  <button type="submit" onClick={handleOpenCalibrationPopup} className="btn btn-primary mb-2 mt-2"> Calibration </button>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-4 grid-margin">
            <div className="card" onClick={() => handleCardClick({ title: "Limits in DB" })}>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Limits in DB</h3>
                  </div>
                  <div className="col-12 mb-3">
                    <h1> dB</h1>
                  </div>
                  <div className="col-12">
                    {latestValue ? (
                      <>
                        <h5 className="text-dark">pH: {latestValue.ph}</h5>
                        <h5 className="text-dark">Turbidity: {latestValue.turbidity}</h5>
                        <h5 className="text-dark">ORP: {latestValue.ORP}</h5>
                        <p className="mb-0">Last Week: </p>
                        <p>Last Month: </p>
                      </>
                    ) : (
                      <p>No data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {showPopup && selectedCard && (
          <NoisePopup
            title={selectedCard.title}
            weekData={weekData} // Pass actual week data here
            monthData={monthData} // Pass actual month data here
            dayData={dayData}
            sixMonthData={sixMonthData}
            yearData={yearData}
            onClose={handleClosePopup}
          />
        )} */}

        {showCalibrationPopup && (
          <CalibrationPopup
            onClose={handleCloseCalibrationPopup}
          />
        )}
      </div>

      <div className="p-5"></div>
      <div className="p-5"></div>

      <div className="col-md-12 grid-margin mt-5">
        <div className="card">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <h2>Calibration Exceeded</h2>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>SI.No</th>
                        <th>Exceeded Parameter</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>ph 2.1</td>
                        <td>31/03/2024</td>
                        <td>07:17</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
            Ebhoom Control and Monitor System
          </span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
            ©
            <a href="" target="_blank">
              Ebhoom Solutions LLP
            </a>
            2023
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Noise;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchIotDataByUserName, fetchLatestIotData } from "../../redux/features/iotData/iotDataSlice";
import AirGraphPopup from "./AirGraphPopup";
import './index.css';
import CalibrationPopup from "../Calibration/CalibrationPopup";
import CalibrationExceeded from '../Calibration/CalibrationExceeded';
import { useOutletContext } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import DailyHistoryModal from "../Water/DailyHistoryModal";

const AmbientAir = () => {
  const dispatch = useDispatch();
  const { userData, userType } = useSelector((state) => state.user);
  const { latestData, error } = useSelector((state) => state.iotData);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCalibrationPopup, setShowCalibrationPopup] = useState(false);
  const { searchTerm } = useOutletContext();
  const [searchResult, setSearchResult] = useState(null);
  const [selectedStack, setSelectedStack] = useState("all"); // 'all' means show all stacks initially
  const [searchError, setSearchError] = useState("");
  const [currentUserName, setCurrentUserName] = useState(userType === 'admin' ? "KSPCB001" : userData?.validUserOne?.userName);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchData = async (userName) => {
    setLoading(true);
    try {
      const result = await dispatch(fetchLatestIotData(userName)).unwrap();
      setSearchResult(result);
      setCompanyName(result?.companyName || "Unknown Company");
      setSearchError("");
    } catch (err) {
      setSearchResult(null);
      setCompanyName("Unknown Company");
      setSearchError(err.message || 'No Result found for this userID');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchData(searchTerm);
    } else {
      fetchData(currentUserName);
    }
  }, [searchTerm, currentUserName, dispatch]);

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
  };

  const fetchHistoryData = async (fromDate, toDate) => {
    // Logic to fetch history data based on the date range
    console.log('Fetching data from:', fromDate, 'to:', toDate);
  };

  const downloadHistoryData = (fromDate, toDate) => {
    // Logic to download history data based on the date range
    console.log('Downloading data from:', fromDate, 'to:', toDate);
  };

  const handleCloseCalibrationPopup = () => {
    setShowCalibrationPopup(false);
  };

  const handleNextUser = () => {
    const userIdNumber = parseInt(currentUserName.replace(/[^\d]/g, ''), 10);
    if (!isNaN(userIdNumber)) {
      const newUserId = `KSPCB${String(userIdNumber + 1).padStart(3, '0')}`;
      setCurrentUserName(newUserId);
    }
  };

  const handlePrevUser = () => {
    const userIdNumber = parseInt(currentUserName.replace(/[^\d]/g, ''), 10);
    if (!isNaN(userIdNumber) && userIdNumber > 1) {
      const newUserId = `KSPCB${String(userIdNumber - 1).padStart(3, '0')}`;
      setCurrentUserName(newUserId);
    }
  };

  const handleStackChange = (event) => {
    setSelectedStack(event.target.value); // 'all' for all stacks, or stack name
  };

  const airParameters = [
    { parameter: "Flow", value: 'm/s', name: "Flow" },
    { parameter: "CO", value: 'µg/Nm³', name: "CO" },
    { parameter: "NOX", value: 'µg/Nm³', name: "NOX" },
    { parameter: "Pressure", value: 'Pa', name: "Pressure" },
    { parameter: "PM", value: 'µg/m³', name: "PM" },
    { parameter: "SO2", value: 'µg/m³', name: "SO2" },
    { parameter: "NO2", value: 'µg/m³', name: "NO2" },
    { parameter: "Mercury", value: 'µg/m³', name: "Mercury" },
    { parameter: "PM 10", value: 'µg/m³', name: "PM10" },
    { parameter: "PM 2.5", value: 'µg/m³', name: "PM25" },
    { parameter: "Windspeed", value: 'm/s', name: "WindSpeed" },
    { parameter: "Wind Dir", value: 'deg', name: "WindDir" },
    { parameter: "Temperature", value: '℃', name: "AirTemperature" },
    { parameter: "Humidity", value: '%', name: "Humidity" },
    { parameter: "Solar Radiation", value: 'w/m²', name: "solarRadiation" },
  ];

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header d-flex justify-content-between">
              {userType === 'admin' ? (
                <>
                  <button className="btn btn-primary" onClick={handlePrevUser} disabled={loading}>Prev</button>
                  <h4 className="page-title">Stack Emission DASHBOARD</h4>
                  <button className="btn btn-primary" onClick={handleNextUser} disabled={loading}>Next</button>
                </>
              ) : (
                <div className="mx-auto">
                  <h4 className="page-title">Stack Emission DASHBOARD</h4>
                </div>
              )}
            </div>
          </div>
        </div>
        <ul className="quick-links ml-auto">
                {latestData && (
                  <>
                    <h5>Analyser Health: </h5>
                    {searchResult?.validationStatus ? (
                      <h5 style={{ color: "green" }}>Good</h5>
                    ) : (
                      <h5 style={{ color: "red" }}>Problem</h5>
                    )}
                  </>
                )}
              </ul>
        <div className="row align-items-center">
        <div className="col-md-4">
    {/* Dropdown for Stack Names */}
    {searchResult?.stackData && searchResult.stackData.length > 0 && (
      <div className="stack-dropdown">
        <label htmlFor="stackSelect" className="label-select">Select Stack:</label>
        <div className="styled-select-wrapper">
          <select
            id="stackSelect"
            className="form-select styled-select"
            value={selectedStack}
            onChange={handleStackChange}
          >
            <option value="all">All Stacks</option> {/* Default option to show all stacks */}
            {searchResult.stackData.map((stack, index) => (
              <option key={index} value={stack.stackName}>
                {stack.stackName}
              </option>
            ))}
          </select>
        </div>
      </div>
    )}
  </div>
  <div className="col-md-4">
    <h3 className="text-center">{companyName}</h3>
  </div>

 

  {/* Buttons for Daily History and Calibration */}
  <div className="col-md-4 d-flex justify-content-end">
    <ul className="quick-links ml-auto">
      <button className="btn btn-primary" onClick={() => setShowHistoryModal(true)}>
        Daily History
      </button>
    </ul>
    {userData?.validUserOne && userData.validUserOne.userType === 'user' && (
      <ul className="quick-links ml-auto">
        <button type="submit" onClick={handleOpenCalibrationPopup} className="btn btn-primary ml-2">
          Calibration
        </button>
      </ul>
    )}
  </div>
  
</div>


        {loading && (
          <div className="spinner-container">
            <Oval
              height={60}
              width={60}
              color="#236A80"
              ariaLabel="Fetching details"
              secondaryColor="#e0e0e0"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        )}

        {!loading && (!searchResult || !searchResult.stackData || searchResult.stackData.length === 0) && (
          <div className="col-12">
            <h5 className="text-center">No Data Available</h5>
          </div>
        )}

<div className="row">
  {!loading && searchResult && searchResult.stackData && (
    <>
      {searchResult.stackData.map((stack, stackIndex) => (
        (selectedStack === "all" || selectedStack === stack.stackName) && (
          <div key={stackIndex} className="col-12 mb-4">
            {/* Stack name as heading */}
            <div className="stack-box">
              <h4 className="text-center">{stack.stackName}</h4>
              <div className="row">
                {airParameters.map((item, index) => {
                  const value = stack[item.name];
                  return value && value !== 'N/A' ? (
                    <div className="col-12 col-md-4 grid-margin" key={index}>
                      <div className="card" onClick={() => handleCardClick({ title: item.parameter })}>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-12">
                              <h3 className="mb-3">{item.parameter}</h3>
                            </div>
                            <div className="col-12 mb-3">
                              <h6>
                                <strong className="strong-value" style={{ color: '#236A80' }}>
                                  {value}
                                </strong> 
                                <span>{item.value}</span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null; // Don't render if value is 'N/A' or undefined
                })}
              </div>
            </div>
          </div>
        )
      ))}
    </>
  )}
</div>


        {showPopup && selectedCard && (
          <AirGraphPopup
            isOpen={showPopup}
            onRequestClose={handleClosePopup}
            parameter={selectedCard.title}
            userName={currentUserName}
          />
        )}

        {showCalibrationPopup && (
          <CalibrationPopup
            userName={userData?.validUserOne?.userName}
            onClose={handleCloseCalibrationPopup}
          />
        )}
        <CalibrationExceeded />

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

        <DailyHistoryModal
          isOpen={showHistoryModal}
          onRequestClose={() => setShowHistoryModal(false)}
          fetchData={fetchHistoryData}
          downloadData={downloadHistoryData}
        />
      </div>
    </div>
  );
};

export default AmbientAir;

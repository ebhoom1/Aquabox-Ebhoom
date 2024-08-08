import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CalibrationPopup from "../Calibration/CalibrationPopup";
import CalibrationExceeded from "../Calibration/CalibrationExceeded";
import { ToastContainer } from "react-toastify";
import WaterGraphPopup from './WaterGraphPopup';
import { useOutletContext } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const API_URL = "http://ocems.ebhoom.com:5555";

const Water = () => {
  const { userData, userType } = useSelector((state) => state.user);
  const { latestData, userIotData, error } = useSelector((state) => state.iotData);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [showCalibrationPopup, setShowCalibrationPopup] = useState(false);
  const { searchTerm, handleSearch } = useOutletContext();
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [currentUserName, setCurrentUserName] = useState("KSPCB001");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (userName) => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/get-IoT-Data-by-userName/${userName}`);
        setSearchResult(response.data);
        setCompanyName(response.data?.companyName || "Unknown Company");
        setSearchError("");
      } catch (err) {
        setSearchResult(null);
        setCompanyName("Unknown Company");
        setSearchError(err.message || 'No Result found for this userID');
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchData(searchTerm);
    } else {
      fetchData(currentUserName);
    }
  }, [searchTerm, currentUserName]);

  const handleCardClick = (parameter) => {
    setSelectedParameter(parameter);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedParameter(null);
  };

  const handleOpenCalibrationPopup = () => {
    setShowCalibrationPopup(true);
  };

  const handleCloseCalibrationPopup = () => {
    setShowCalibrationPopup(false);
  };

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/get-IoT-Data-by-userName/${userId}`);
      if (response.data) {
        setSearchResult(response.data);
        setCompanyName(response.data?.companyName || "Unknown Company");
        setSearchError("");
        setCurrentUserName(userId);
      } else {
        setSearchResult(null);
        setCompanyName("Unknown Company");
        setSearchError('No Result found for this userID');
      }
    } catch (error) {
      setSearchResult(null);
      setCompanyName("Unknown Company");
      setSearchError('No Result found for this userID');
    } finally {
      setLoading(false);
    }
  };

  const handleNextUser = () => {
    const userIdNumber = parseInt(currentUserName.replace(/[^\d]/g, ''), 10);
    if (!isNaN(userIdNumber)) {
      const newUserId = `KSPCB${String(userIdNumber + 1).padStart(3, '0')}`;
      fetchUserData(newUserId);
    }
  };

  const handlePrevUser = () => {
    const userIdNumber = parseInt(currentUserName.replace(/[^\d]/g, ''), 10);
    if (!isNaN(userIdNumber) && userIdNumber > 1) {
      const newUserId = `KSPCB${String(userIdNumber - 1).padStart(3, '0')}`;
      fetchUserData(newUserId);
    }
  };

  const waterParameters = [
    { parameter: "Ph", value: 'pH', name: 'ph' },
    { parameter: "TDS", value: 'mg/l', name: 'TDS' },
    { parameter: "Turbidity", value: 'NTU', name: 'turbidity' },
    { parameter: "Temperature", value: '℃', name: 'temperature' },
    { parameter: "BOD", value: 'mg/l', name: 'BOD' },
    { parameter: "COD", value: 'mg/l', name: 'COD' },
    { parameter: "TSS", value: 'mg/l', name: 'TSS' },
    { parameter: "ORP", value: 'mV', name: 'ORP' },
    { parameter: "Nitrate", value: 'mg/l', name: 'nitrate' },
    { parameter: "Ammonical Nitrogen", value: 'mg/l', name: 'ammonicalNitrogen' },
    { parameter: "DO", value: 'mg/l', name: 'DO' },
    { parameter: "Chloride", value: 'mmol/l', name: 'chloride' },
    { parameter: "Colour", value: 'color', name: 'color' },
  ];

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header d-flex justify-content-between">
              <button className="btn btn-primary" onClick={handlePrevUser} disabled={loading}>Prev</button>
              <h4 className="page-title">EFFLUENT/WATER DASHBOARD</h4>
              <button className="btn btn-primary" onClick={handleNextUser} disabled={loading}>Next</button>
            </div>
            <p></p>
            <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
              <ul className="quick-links ml-auto">
                {userData?.validUserOne && userData.validUserOne.userType === 'user' && (
                  <h5>Data Interval: <span className="span-class">{userData.validUserOne.dataInteval}</span></h5>
                )}
              </ul>
              <ul className="quick-links ml-auto">
                {latestData && (
                  <>
                    <h5>Analyser Health : </h5>
                    {userIotData.validationStatus ? (
                      <h5 style={{ color: "green" }}>Good</h5>
                    ) : (
                      <h5 style={{ color: "red" }}>Problem</h5>
                    )}
                  </>
                )}
              </ul>
              {userData?.validUserOne && userData.validUserOne.userType === 'user' && (
                <ul className="quick-links ml-auto">
                  <button type="submit" onClick={handleOpenCalibrationPopup} className="btn btn-primary mb-2 mt-2"> Calibration </button>
                </ul>
              )}
              <ul className="quick-links ml-auto">
                <Link to={"/download-IoT-Data"}><button type="submit" className="btn btn-primary mb-2 mt-2"> Download </button></Link>
              </ul>
            </div>
          </div>
        </div>
        {searchError && (
          <div className="card mb-4">
            <div className="card-body">
              <h1>{searchError}</h1>
            </div>
          </div>
        )}
        <div className="p-2"></div>
        <div className="p-2"></div>

        <div className="row">
          <div className="col-12">
            <h3 className="text-center">{companyName}</h3>
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

        <div className="row">
          {!loading && waterParameters.map((item, index) => (
            <div className="col-12 col-md-4 grid-margin" key={index}>
              <div className="card" onClick={() => handleCardClick(item.name)}>
                <div className="card-body">
                  <h3 className="mb-3">{item.parameter}</h3>
                  <h6>
                    <strong>
                      {searchResult ? searchResult[item.name] || 'N/A' : 'No Result found for this userID'}
                    </strong> 
                    {item.value}
                  </h6>
                </div>
              </div>
              <ToastContainer />
            </div>
          ))}
        </div>

        {showPopup && (
          <WaterGraphPopup
            isOpen={showPopup}
            onRequestClose={handleClosePopup}
            parameter={selectedParameter}
            userName={currentUserName}
          />
        )}
      </div>

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

export default Water;

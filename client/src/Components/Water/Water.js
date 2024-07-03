import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from "../../redux/features/user/userSlice";
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { Link } from 'react-router-dom';
import CalibrationPopup from "../Calibration/CalibrationPopup";
import CalibrationExceeded from "../Calibration/CalibrationExceeded";
import { ToastContainer } from "react-toastify";
import WaterGraphPopup from './WaterGraphPopup';
import { useOutletContext } from 'react-router-dom';

const Water = () => {
  const dispatch = useDispatch();
  const { userData, userType } = useSelector((state) => state.user);
  const { latestData, userIotData, error } = useSelector((state) => state.iotData);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [showCalibrationPopup, setShowCalibrationPopup] = useState(false);
  const { searchTerm, searchStatus, handleSearch } = useOutletContext();
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const fetchData = async (userName) => {
      try {
        const result = await dispatch(fetchIotDataByUserName(userName)).unwrap();
        setSearchResult(result);
        setSearchError("");
      } catch (err) {
        setSearchResult(null);
        setSearchError(err.message || 'No Result found for this userID');
      }
    };

    if (searchTerm) {
      fetchData(searchTerm);
    } else if (userData && userType === 'user') {
      fetchData(userData.validUserOne.userName);
    }
  }, [searchTerm, userData, userType, dispatch]);

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
            <div className="page-header">
              <h4 className="page-title">EFFLUENT/WATER DASHBOARD</h4>
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
          {waterParameters.map((item, index) => (
            <div className="col-12 col-md-4 grid-margin" key={index}>
              <div className="card" onClick={() => handleCardClick(item.name)}>
                <div className="card-body">
                  <h3 className="mb-3">{item.parameter}</h3>
                  <h6>
                    <strong>
                      {searchStatus === 'success' && searchResult ? searchResult[item.name] || 'N/A' : 'No Result found for this userID'}
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
            userName={searchTerm || userData?.validUserOne?.userName}
          />
        )}
      </div>

      {showCalibrationPopup && (
        <CalibrationPopup
          userName={userData.validUserOne.userName}
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

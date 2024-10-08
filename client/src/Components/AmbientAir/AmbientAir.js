import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
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
  const [searchError, setSearchError] = useState("");
  const [currentUserName, setCurrentUserName] = useState(userType === 'admin' ? "KSPCB001" : userData?.validUserOne?.userName);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchData = async (userName) => {
    setLoading(true);
    try {
      const result = await dispatch(fetchIotDataByUserName(userName)).unwrap();
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
  const fetchHistoryData = async (fromDate, toDate) => {
    // Logic to fetch history data based on the date range
    console.log('Fetching data from:', fromDate, 'to:', toDate);
    // Example API call:
    // const data = await dispatch(fetchHistoryDataByDate({ fromDate, toDate })).unwrap();
  };
  const downloadHistoryData = (fromDate, toDate) => {
    // Logic to download history data based on the date range
    console.log('Downloading data from:', fromDate, 'to:', toDate);
    // Example API call:
    // downloadData({ fromDate, toDate });
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
    { parameter: "NOH", value: 'µg/m³', name: "NOH" },
    { parameter: "NH3", value: 'µg/m³', name: "NH3" },
    { parameter: "Windspeed", value: 'm/s', name: "Windspeed" },
    { parameter: "Wind Dir", value: 'deg', name: "WindDir" },
    { parameter: "Temperature", value: '℃', name: "AirTemperature" },
    { parameter: "Humidity", value: '%', name: "Humidity" },
    { parameter: "Solar Radiation", value: 'w/m²', name: "solarRadiation" },
    {parameter:"Flouride",value:'µg/m',name:"Flouride"},
    {parameter:"Flouride (II)",value:'µg/m',name:"stack_2_Flouride"},
    { parameter: "PM (II)", value: 'µg/m³', name: "stack_2_PM" },
    { parameter: "NH3 (II)", value: 'µg/m³', name: "stack_2_NH3" },
    {parameter:"Flouride (III)",value:'µg/m',name:"STACK_32_Ammonia_Flouride"},
    { parameter: "PM (III)", value: 'µg/m³', name: "STACK_32_Ammonia_PM" },
    { parameter: "NH3 (III)", value: 'µg/m³', name: "STACK_32_Ammonia_NH3" },
    
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
            <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
              <ul className="quick-links ml-auto">
                {userData?.validUserOne && userData.validUserOne.userType === 'user' && (
                  <h5>Data Interval: <span className="span-class">{userData.validUserOne.dataInteval}</span></h5>
                )}
              </ul>
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
              <ul className="quick-links ml-auto">
                <button className="btn btn-primary" onClick={() => setShowHistoryModal(true)}>
                  Daily History
                </button>
              </ul>
              {userData?.validUserOne && userData.validUserOne.userType === 'user' && (
                <ul className="quick-links ml-auto">
                  <button type="submit" onClick={handleOpenCalibrationPopup} className="btn btn-primary mb-2 mt-2"> Calibration </button>
                </ul>
              )}
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
  {/* Exclude Stack II and Stack III Parameters */}
  {!loading && airParameters.filter(param => !param.name.includes("stack_2") && !param.name.includes("STACK_32_Ammonia")).map((item, index) => (
    <div className="col-12 col-md-4 grid-margin" key={index}>
      <div className="card" onClick={() => handleCardClick({ title: item.parameter })}>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <h3 className="mb-3 ">{item.parameter}</h3>
            </div>
            <div className="col-12 mb-3">
              <h6>
                <strong className="strong-value" style={{color:'#35852a'}}>
                  {searchResult ? searchResult[item.name] || 'N/A' : 'No Result found for this userID'}
                </strong> 
                <span>{item.value}</span>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        <div className="row">
  {/* Heading for Stack II */}
  <div className="col-12">
    <h3 className="text-center mt-4">Stack II</h3>
  </div>

  {/* Stack II Parameters */}
  {!loading && airParameters.filter(param => param.name.includes("stack_2")).map((item, index) => (
    <div className="col-12 col-md-4 grid-margin" key={index}>
      <div className="card" onClick={() => handleCardClick({ title: item.parameter })}>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <h3 className="mb-3">{item.parameter}</h3>
            </div>
            <div className="col-12 mb-3">
              <h6>
                <strong className="strong-value" style={{color:'#2e8023'}}>
                  {searchResult ? searchResult[item.name] || 'N/A' : 'No Result found for this userID'}
                </strong> 
                <span>{item.value}</span>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
<div className="row">
  {/* Heading for Stack II */}
  <div className="col-12">
    <h3 className="text-center mt-4">STACK_32_Ammonia</h3>
  </div>

  {/* Stack II Parameters */}
  {!loading && airParameters.filter(param => param.name.includes("STACK_32_Ammonia")).map((item, index) => (
    <div className="col-12 col-md-4 grid-margin" key={index}>
      <div className="card" onClick={() => handleCardClick({ title: item.parameter })}>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <h3 className="mb-3">{item.parameter}</h3>
            </div>
            <div className="col-12 mb-3">
              <h6>
                <strong className="strong-value" style={{color:'#328023'}}>
                  {searchResult ? searchResult[item.name] || 'N/A' : 'No Result found for this userID'}
                </strong> 
                <span>{item.value}</span>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
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
       {/* Include the Daily History Modal */}
       <DailyHistoryModal
        isOpen={showHistoryModal}
        onRequestClose={() => setShowHistoryModal(false)}
        fetchData={fetchHistoryData}
        downloadData={downloadHistoryData}
      />
    </div>
  );
};

export default AmbientAir;

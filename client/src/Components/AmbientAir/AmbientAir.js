import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { fetchUserLatestByUserName } from "../../redux/features/userLog/userLogSlice";
import AirGraphPopup from "../Water/WaterGraphPopup";
import './index.css';
import CalibrationPopup from "../Calibration/CalibrationPopup";
import CalibrationExceeded from '../Calibration/CalibrationExceeded';
import { useOutletContext } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import DailyHistoryModal from "../Water/DailyHistoryModal";
import { API_URL } from "../../utils/apiConfig";
import { io } from 'socket.io-client';

  // Initialize Socket.IO
  const socket = io(API_URL, { 
    transports: ['websocket'], 
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, // Retry every second
  });

  socket.on('connect', () => console.log('Connected to Socket.IO server'));
  socket.on('connect_error', (error) => console.error('Connection Error:', error));
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
  const [selectedStack, setSelectedStack] = useState("all");
  const [emissionStacks, setEmissionStacks] = useState([]); // Store only emission-related stacks
  const [realTimeData, setRealTimeData] = useState({});

  // Fetch stack names and filter by emission-related station types
  const fetchEmissionStacks = async (userName) => {
    try {
      const response = await fetch(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
      const data = await response.json(); // Parse response data
      const filteredStacks = data.stackNames
        .filter(stack => stack.stationType === 'emission')
        .map(stack => stack.name); // Extract only the stack names
      setEmissionStacks(filteredStacks);
    } catch (error) {
      console.error("Error fetching emission stacks:", error);
    }
  };

  const fetchData = async (userName) => {
    setLoading(true);
    try {
      const result = await dispatch(fetchUserLatestByUserName(userName)).unwrap();
      setSearchResult(result);
      console.log("result IOT : ", result)
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
    const userName = searchTerm || currentUserName;
    fetchData(userName);
    setCurrentUserName(userName); 
    fetchEmissionStacks(userName);
  }, [searchTerm, currentUserName,dispatch]);

  const handleCardClick = (card, stackName) => {
    // Ensure we use the correct userName when admin searches for a user.
    const userName = searchTerm || currentUserName;
    setSelectedCard({ ...card, stackName, userName });
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

  const handleStackChange = (event) => {
    setSelectedStack(event.target.value); // 'all' for all stacks, or specific stack name
  };
  useEffect(() => {
    const userName = searchTerm || currentUserName;
  
    console.log('Joining room:', userName);
    socket.emit('joinRoom', { userId: userName });
  
    socket.on('stackDataUpdate', (data) => {
      console.log('Received real-time stack data:', data);
  
      // Merge new data with existing data similarly to Water.js
      setRealTimeData((prevData) => ({
        ...prevData,
        ...data.stackData.reduce((acc, item) => {
          acc[item.stackName] = { ...prevData[item.stackName], ...item };
          return acc;
        }, {}),
      }));
    });
  
    return () => {
      console.log('Leaving room:', userName);
      socket.emit('leaveRoom', { userId: userName });
      socket.off('stackDataUpdate');
    };
  }, [searchTerm, currentUserName]);
  
  
  const filteredData = selectedStack === "all"
  ? Object.values(realTimeData)
  : Object.values(realTimeData).filter(data => data.stackName === selectedStack);
  const airParameters = [
    { parameter: "Flow", value: 'm3/hr', name: "Flow" },
    { parameter: "CO", value: 'µg/Nm³', name: "CO" },
    { parameter: "NOX", value: 'µg/Nm³', name: "NOX" },
    { parameter: "Pressure", value: 'Pa', name: "Pressure" },
    { parameter: "PM", value: 'mg/Nm3.', name: "PM" },
    { parameter: "SO2", value: 'mg/Nm3', name: "SO2" },
    { parameter: "NO2", value: 'µg/m³', name: "NO2" },
    { parameter: "Mercury", value: 'µg/m³', name: "Mercury" },
    { parameter: "PM 10", value: 'µg/m³', name: "PM10" },
    { parameter: "PM 2.5", value: 'µg/m³', name: "PM25" },
    { parameter: "Windspeed", value: 'm/s', name: "WindSpeed" },
    { parameter: "Wind Dir", value: 'deg', name: "WindDir" },
    { parameter: "Temperature", value: '℃', name: "AirTemperature" },
    { parameter: "Humidity", value: '%', name: "Humidity" },
    { parameter: "Solar Radiation", value: 'w/m²', name: "solarRadiation" },
    { parameter: "Fluoride", value: "mg/Nm3", name: "Fluoride" },
    {parameter: "NH3", value: "mg/Nm3", name: "NH3"},
    { parameter: "pH", value: 'pH', name: 'ph' },
    { parameter: "Ammonical Nitrogen", value: 'mg/l', name: 'ammonicalNitrogen' },
    {parameter:"Totalizer_Flow", value:'m3/Day', name:'Totalizer_Flow'},
    {parameter:"HCl", value:'mg/Nm3', name:'HCl'},
    {parameter:"total_chlorine", value:'mg/Nm3', name:'total_chlorine'},
    {parameter:"chlorine", value:'mg/Nm3', name:'chlorine'},

    

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

        <div className="row align-items-center">
          <div className="col-md-4">
          {searchResult?.stackData && (
  <div className="stack-dropdown">
    <label htmlFor="stackSelect" className="label-select">Select Station:</label>
    <select
      id="stackSelect"
      className="form-select styled-select"
      value={selectedStack}
      onChange={handleStackChange}
    >
      <option value="all">All Stacks</option>
      {searchResult.stackData
        .filter((stack) => emissionStacks.includes(stack.stackName)) // Ensure only emission stacks are shown
        .map((stack, index) => (
          <option key={index} value={stack.stackName}>
            {stack.stackName}
          </option>
        ))}
    </select>
  </div>
)}

          </div>
          <div className="col-md-4">
            <h3 className="text-center">{companyName}</h3>
          </div>

          <div className="col-md-4 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={() => setShowHistoryModal(true)}>Daily History</button>
            {userData?.validUserOne?.userType === 'user' && (
              <button type="button" onClick={handleOpenCalibrationPopup} className="btn btn-primary ml-2">Calibration</button>
            )}
          </div>
        </div>

        {loading && (
  <div className="spinner-container">
    <Oval
      height={60}
      width={60}
      color="#236A80"
      ariaLabel="Fetching data"
      secondaryColor="#e0e0e0"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  </div>
)}
               <div className="row">
  {!loading && Object.values(realTimeData).length > 0 ? (
    <>
      {Object.values(realTimeData)
        .filter((stack) => emissionStacks.includes(stack.stackName)) // Filter emission stacks
        .map((stack, stackIndex) => (
          (selectedStack === "all" || selectedStack === stack.stackName) && (
            <div key={stackIndex} className="col-12 mb-4">
              <div className="stack-box">
                <h4 className="text-center">{stack.stackName}</h4>
                <div className="row">
                  {airParameters.map((param, i) => {
                    const value = stack[param.name];
                    return value && value !== "N/A" ? (
                      <div className="col-12 col-md-4 grid-margin" key={i}>
                        <div
                          className="card"
                          onClick={() =>
                            handleCardClick({ title: param.name }, stack.stackName, currentUserName)
                          }
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-12">
                                <h3 className="mb-3">{param.parameter}</h3>
                              </div>
                              <div className="col-12 mb-3">
                                <h6>
                                  <strong className="strong-value" style={{ color: "#236A80" }}>
                                    {value}
                                  </strong>
                                  <span>{param.value}</span>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )
        ))}
    </>
  ) : (
    <div className="col-12">
      <h5>Waiting for real-time data available</h5>
    </div>
  )}
</div>




        {showPopup && selectedCard && (
          <AirGraphPopup
          isOpen={showPopup}
          onRequestClose={handleClosePopup}
          parameter={selectedCard.title}
          userName={currentUserName}
          stackName={selectedCard.stackName} // Pass stackName
          />
        )}

        <CalibrationExceeded />
        <DailyHistoryModal isOpen={showHistoryModal} onRequestClose={() => setShowHistoryModal(false)} />
      </div>
    </div>
  );
};

export default AmbientAir;

  import React, { useEffect, useState } from "react";
  import { useDispatch, useSelector } from 'react-redux';
  import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
  import WaterGraphPopup from './WaterGraphPopup';
  import CalibrationPopup from '../Calibration/CalibrationPopup';
  import CalibrationExceeded from '../Calibration/CalibrationExceeded';
  import { useOutletContext } from 'react-router-dom';
  import { Oval } from 'react-loader-spinner';
  import DailyHistoryModal from './DailyHistoryModal'; 
  import { API_URL } from "../../utils/apiConfig";
  import { io } from 'socket.io-client';
import Quantity from "../Quantity/Quantity";

  // Initialize Socket.IO
  const socket = io(API_URL, { 
    transports: ['websocket'], 
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, // Retry every second
  });

  socket.on('connect', () => console.log('Connected to Socket.IO server'));
  socket.on('connect_error', (error) => console.error('Connection Error:', error));
  

  const Water = () => {
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
    const [effluentStacks, setEffluentStacks] = useState([]); // New state to store effluent stacks
    const [realTimeData, setRealTimeData] = useState({});
  
    // Fetch stack names and filter effluent stationType stacks
    const fetchEffluentStacks = async (userName) => {
      try {
        const response = await fetch(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
        const data = await response.json(); // Make sure to parse the JSON
        const effluentStacks = data.stackNames
          .filter(stack => stack.stationType === 'effluent')
          .map(stack => stack.name); // Use 'name' instead of 'stackName'
        setEffluentStacks(effluentStacks);
      } catch (error) {
        console.error("Error fetching effluent stacks:", error);
      }
    };
    

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

    useEffect(() => {
      const userName = searchTerm || currentUserName;
      fetchData(userName);
      fetchEffluentStacks(userName);
    }, [searchTerm, currentUserName]);

    useEffect(() => {
      const userName = searchTerm || currentUserName;

      console.log('Joining room:', userName);
      socket.emit('joinRoom', { userId: userName });

      // Listen for stack data updates in real-time
      socket.on('stackDataUpdate', (data) => {
        console.log('Received real-time stack data:', data);

        // Merge new data with the existing data
        setRealTimeData((prevData) => ({
          ...prevData,
          ...data.stackData.reduce((acc, item) => {
            acc[item.stackName] = item;
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

    const handleStackChange = (event) => {
      setSelectedStack(event.target.value);
    };
 


    const filteredData = selectedStack === "all"
      ? Object.values(realTimeData)
      : Object.values(realTimeData).filter(data => data.stackName === selectedStack);
    const waterParameters = [
      { parameter: "pH", value: 'pH', name: 'ph' },
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
      {parameter:"Totalizer_Flow", value:'m3/Day', name:'Totalizer_Flow'},
      { parameter: "Chloride", value: 'mmol/l', name: 'chloride' },
      { parameter: "Colour", value: 'color', name: 'color' },
      { parameter: "Fluoride", value: "mg/l", name: "Fluoride" },
      { parameter: "Flow", value: 'm3/hr', name: "Flow" },


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
                    <h4 className="page-title">EFFLUENT/WATER DASHBOARD</h4>
                    <button className="btn btn-primary" onClick={handleNextUser} disabled={loading}>Next</button>
                  </>
                ) : (
                  <div className="mx-auto">
                    <h4 className="page-title">EFFLUENT/WATER DASHBOARD</h4>
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
    {searchResult?.stackData && searchResult.stackData.length > 0 && (
      <div className="stack-dropdown">
        <label htmlFor="stackSelect" className="label-select">Select Station:</label>
        <div className="styled-select-wrapper">
          <select
            id="stackSelect"
            className="form-select styled-select"
            value={selectedStack}
            onChange={handleStackChange}
          >
            <option value="all">All Stacks</option>
            {searchResult.stackData
              .filter(stack => effluentStacks.includes(stack.stackName)) // Filter only effluent stations
              .map((stack, index) => (
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

            <div className="col-md-4 d-flex justify-content-end">
              <button className="btn btn-primary" onClick={() => setShowHistoryModal(true)}>
                Daily History
              </button>
              {userData?.validUserOne && userData.validUserOne.userType === 'user' && (
                <button type="submit" onClick={handleOpenCalibrationPopup} className="btn btn-primary ml-2">
                  Calibration
                </button>
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

              <div className="row">
                  {!loading && filteredData.length > 0 ? (
                      filteredData.map((stack, stackIndex) => (
                          effluentStacks.includes(stack.stackName) && (
                              <div key={stackIndex} className="col-12 mb-4">
                                  <div className="stack-box">
                                      <h4 className="text-center">{stack.stackName}</h4>
                                      <div className="row">
                                          {waterParameters.map((item, index) => {
                                              const value = stack[item.name];
                                              return value && value !== 'N/A' ? (
                                                  <div className="col-12 col-md-4 grid-margin" key={index}>
                                                      <div className="card" onClick={() => handleCardClick({ title: item.parameter })}>
                                                          <div className="card-body">
                                                              <h5>{item.parameter}</h5>
                                                              <p>
                                                                  <strong style={{ color: '#236A80', fontSize:'24px' }}>{value}</strong> {item.value}
                                                              </p>
                                                          </div>
                                                      </div>
                                                  </div>
                                              ) : null;
                                          })}
                                      </div>
                                  </div>
                              </div>
                          )
                      ))
                  ) : (
                      <div className="col-12">
                          <h5>Waiting real-time data available</h5>
                      </div>
                  )}
              </div>

          {showPopup && selectedCard && (
            <WaterGraphPopup
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
          {/* <CalibrationExceeded /> */}
          {/* <footer className="footer">
            <div className="container-fluid clearfix">
              <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
                Ebhoom Control and Monitor System
              </span>
              <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
                {" "}© <a href="" target="_blank">Ebhoom Solutions LLP</a> 2023
              </span>
            </div>
          </footer> */}

          <DailyHistoryModal 
    isOpen={showHistoryModal} 
    onRequestClose={() => setShowHistoryModal(false)} 
  />

        </div>
        <Quantity/>
      </div>
    );
  };

  export default Water;

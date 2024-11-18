import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { fetchUserLatestByUserName } from "../../redux/features/userLog/userLogSlice";
import EnergyGraph from './EnergyGraph';
import CalibrationPopup from '../Calibration/CalibrationPopup';
import CalibrationExceeded from '../Calibration/CalibrationExceeded';
import { useOutletContext } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import DailyHistoryModal from "../Water/DailyHistoryModal"; 
import { API_URL } from "../../utils/apiConfig";
import { io } from 'socket.io-client';
import axios from "axios";
// At the top of the file, import the new component
import EnergyConsumptionCards from './EnergyConsumptionCards';
import PieChartEnergy from "./PieChartEnergy";
import PrimaryStationSelector from "./PrimaryStationSelector";

// Initialize Socket.IO
const socket = io(API_URL, { 
  transports: ['websocket'], 
  reconnectionAttempts: 5,
  reconnectionDelay: 1000, // Retry every second
});

socket.on('connect', () => console.log('Connected to Socket.IO server'));
socket.on('connect_error', (error) => console.error('Connection Error:', error));


const EnergyFlow = () => {
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
  const [energyStacks, setEnergyStacks] = useState([]); // New state to store energy stacks
  const [realTimeData, setRealTimeData] = useState({})
  
  // Fetch stack names and filter energy stationType stacks
  const fetchEnergyStacks = async (userName) => {
    try {
      const response = await fetch(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
      const data = await response.json(); // Make sure to parse the JSON
      const energyStacks = data.stackNames
        .filter(stack => stack.stationType === 'energy')
        .map(stack => stack.name); // Use 'name' instead of 'stackName'
      setEnergyStacks(energyStacks);
    } catch (error) {
      console.error("Error fetching energy stacks:", error);
    }
  };
  

  const fetchData = async (userName) => {
    setLoading(true);
    try {
      const result = await dispatch(fetchUserLatestByUserName(userName)).unwrap();
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
    setCurrentUserName(userName); 
    fetchEnergyStacks(userName);
    fetchPrimaryStation(userName);
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
    setSelectedStack(event.target.value);
  };



  const filteredData = selectedStack === "all"
    ? Object.values(realTimeData)
    : Object.values(realTimeData).filter(data => data.stackName === selectedStack);
    const energyParameters = [
      { parameter: "Energy", value: "kW/hr", name: "energy" },
      { parameter: "Power", value: "W", name: "power" },
      { parameter: "Voltage", value: "V", name: "voltage" },
      { parameter: "Current", value: "A", name: "current" },
    ];
    const [primaryStation, setPrimaryStation] = useState(""); // State to hold the primary station name
    

    useEffect(() => {
      fetchPrimaryStation(currentUserName); // Fetch primary station on component mount and userName change
    }, [currentUserName]);
  
    const fetchPrimaryStation = async (userName) => {
      try {
        const response = await axios.get(`${API_URL}/api/primary-station/${userName}`);
        setPrimaryStation(response.data?.data?.stackName || 'No primary station selected');
      } catch (error) {
        console.error('Failed to fetch primary station:', error);
        setPrimaryStation('No primary station selected');
      }
    };
    const handleSetPrimaryStation = (stationName) => {
      setPrimaryStation(stationName); // Immediately update local state
      const postData = {
        userName: currentUserName,
        stationType: 'energy', // Assuming 'energy' is always the type for now
        stackName: stationName
      };
      axios.post(`${API_URL}/api/set-primary-station`, postData)
        .then(response => {
          console.log('Primary station set:', response.data);
          // You might want to fetch new data here or ensure the child component reacts to the change
        })
        .catch(error => {
          console.error('Error setting primary station:', error);
        });
    };
    
  
    
   
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header d-flex justify-content-between">
              {userType === 'admin' ? (
                <>
                  <button className="btn btn-primary" onClick={handlePrevUser} disabled={loading}>Prev</button>
                  <h4 className="page-title">Energy DASHBOARD</h4>
                  <button className="btn btn-primary" onClick={handleNextUser} disabled={loading}>Next</button>
                </>
              ) : (
                <div className="mx-auto">
                  <h4 className="page-title">Energy DASHBOARD</h4>
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
            .filter(stack => energyStacks.includes(stack.stackName)) // Filter only energy stations
            .map((stack, index) => (
              <option key={index} value={stack.stackName}>
                {stack.stackName}
              </option>
            ))}
        </select>
      </div>
        {/* Primary station dropdown component */}
        <PrimaryStationSelector
                stations={searchResult.stackData.filter(stack => energyStacks.includes(stack.stackName)).map(stack => stack.stackName)}
                userName={currentUserName}
                setPrimaryStation={setPrimaryStation}
                primaryStation={primaryStation}

              />
    </div>
  )}
</div>
          <div className="col-md-4">
        <div className="col-md-4">
          {/* Pass userName and primaryStation as props */}
          <EnergyConsumptionCards
          userName={currentUserName}
          primaryStation={primaryStation}
        />
        </div>
            <h3 className="text-center card-title">{companyName}</h3>
            
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
                        energyStacks.includes(stack.stackName) && (
                            <div key={stackIndex} className="col-12 mb-4">
                                <div className="stack-box">
                                    <h4 className="text-center">{stack.stackName}</h4>
                                    <div className="row">
                                        {energyParameters.map((item, index) => {
                                            const value = stack[item.name];
                                            return value && value !== 'N/A' ? (
                                                <div className="col-12 col-md-4 grid-margin" key={index}>
<div className="card"   onClick={() =>
                                handleCardClick({ title: item.name }, stack.stackName, currentUserName)
                              }>                                                        <div className="card-body">
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
          <EnergyGraph
          isOpen={showPopup}
          onRequestClose={handleClosePopup}
          parameter={selectedCard.title}
          userName={currentUserName}
          stackName={selectedCard.stackName}
          />
        )}

        {showCalibrationPopup && (
          <CalibrationPopup
            userName={userData?.validUserOne?.userName}
            onClose={handleCloseCalibrationPopup}
          />
        )}
      
      <PieChartEnergy primaryStation={primaryStation} userName={currentUserName} />

        <DailyHistoryModal 
  isOpen={showHistoryModal} 
  onRequestClose={() => setShowHistoryModal(false)} 
/>

      </div>
    </div>
  );
};

export default EnergyFlow;
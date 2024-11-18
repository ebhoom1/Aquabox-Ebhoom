import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
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
  reconnectionDelay: 1000,
});

socket.on('connect', () => console.log('Connected to Socket.IO server'));
socket.on('connect_error', (error) => console.error('Connection Error:', error));

const AmbientAir = () => {
  const dispatch = useDispatch();
  const { userData, userType } = useSelector((state) => state.user);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { searchTerm } = useOutletContext();
  const [currentUserName, setCurrentUserName] = useState(userType === 'admin' ? "KSPCB001" : userData?.validUserOne?.userName);
  const [companyName, setCompanyName] = useState("Unknown Company");
  const [loading, setLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStack, setSelectedStack] = useState("all");
  const [emissionStacks, setEmissionStacks] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});
  const [initialData, setInitialData] = useState({}); // State for initial data
  

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
    {parameter:"NOH", value:'mg/Nm3', name:'NOH'},
  ];

  // Fetch emission stacks by userName
  const fetchEmissionStacks = async (userName) => {
    try {
      const response = await fetch(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
      const data = await response.json();
      const filteredStacks = data.stackNames
        .filter((stack) => stack.stationType === 'emission')
        .map((stack) => stack.name);
      setEmissionStacks(filteredStacks);
    } catch (error) {
      console.error("Error fetching emission stacks:", error);
    }
  };

  const fetchData = async (userName) => {
    setLoading(true);
    try {
      const result = await dispatch(fetchUserLatestByUserName(userName)).unwrap();
      setCompanyName(result?.companyName || "Unknown Company");
      setInitialData(result.stackData || {}); // Store initial data from fetch
    } catch (error) {
      console.error('Error fetching user data:', error);
      setCompanyName("Unknown Company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userName = searchTerm || currentUserName;
    fetchData(userName);
    fetchEmissionStacks(userName);
    setCurrentUserName(userName);
  }, [searchTerm, currentUserName]);

  useEffect(() => {
    const userName = searchTerm || currentUserName;
    console.log('Joining room:', userName);
    socket.emit('joinRoom', { userId: userName });

    socket.on('stackDataUpdate', (data) => {
      setRealTimeData((prevData) => ({
        ...prevData,
        ...data.stackData.reduce((acc, item) => {
          acc[item.stackName] = { ...prevData[item.stackName], ...item };
          return acc;
        }, {}),
      }));
    });

    return () => {
      socket.emit('leaveRoom', { userId: userName });
      socket.off('stackDataUpdate');
    };
  }, [searchTerm, currentUserName]);

  const displayData = Object.keys(realTimeData).length > 0 ? realTimeData : initialData;

    const filteredData = selectedStack === "all"
      ? Object.values(displayData).filter(stack => emissionStacks.includes(stack.stackName))
      : Object.values(displayData).filter(stack => stack.stackName === selectedStack);

  const handleCardClick = (param, stackName) => {
    setSelectedCard({ title: param.name, stackName, userName: currentUserName });
    setShowPopup(true);
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header d-flex justify-content-between">
              {userType === 'admin' ? (
                <>
                  <button className="btn btn-primary" onClick={() => setCurrentUserName(prev => `KSPCB${(parseInt(prev.replace(/[^\d]/g, '')) - 1).toString().padStart(3, '0')}`)}>
                    Prev
                  </button>
                  <h4 className="page-title">Stack Emission DASHBOARD</h4>
                  <button className="btn btn-primary" onClick={() => setCurrentUserName(prev => `KSPCB${(parseInt(prev.replace(/[^\d]/g, '')) + 1).toString().padStart(3, '0')}`)}>
                    Next
                  </button>
                </>
              ) : (
                <h4 className="page-title text-center">Stack Emission DASHBOARD</h4>
              )}
            </div>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-md-4">
            {emissionStacks.length > 0 && (
              <div className="stack-dropdown">
                <label htmlFor="stackSelect">Select Station:</label>
                <select
                  id="stackSelect"
                  className="form-select"
                  value={selectedStack}
                  onChange={(e) => setSelectedStack(e.target.value)}
                >
                  <option value="all">All Stacks</option>
                  {emissionStacks.map((stack, index) => (
                    <option key={index} value={stack}>{stack}</option>
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
          </div>
        </div>

        {loading ? (
          <div className="spinner-container">
            <Oval height={60} width={60} color="#236A80" ariaLabel="Loading" />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="row">
            {filteredData.map((stack, index) => (
              <div key={index} className="col-12 mb-4">
                <div className="stack-box">
                  <h4 className="text-center">{stack.stackName}</h4>
                  <div className="row">
                    {airParameters.map((param, i) => {
                      const value = stack[param.name];
                      return value && value !== "N/A" ? (
                        <div key={i} className="col-md-4">
                          <div className="card" onClick={() => handleCardClick(param, stack.stackName)}>
                            <div className="card-body">
                              <h3>{param.parameter}</h3>
                              <h6>
                                <strong>{value}</strong> {param.value}
                              </h6>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h5 className="text-center mt-5">Waiting for real-time updates...</h5>
        )}

        {showPopup && selectedCard && (
          <AirGraphPopup 
            isOpen={showPopup} 
            onRequestClose={() => setShowPopup(false)} 
            parameter={selectedCard.title}
            userName={currentUserName}
            stackName={selectedCard.stackName}
            {...selectedCard} 
          />
        )}

        <CalibrationExceeded />
        <DailyHistoryModal isOpen={showHistoryModal} onRequestClose={() => setShowHistoryModal(false)} />
      </div>
    </div>
  );
};

export default AmbientAir;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { io } from 'socket.io-client';
import { useOutletContext } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import DailyHistoryModal from '../Water/DailyHistoryModal';
import { API_URL } from "../../utils/apiConfig";

console.log('Connecting to:', API_URL);
const socket = io(API_URL, { transports: ['websocket'], reconnectionAttempts: 5 });

const EnergyFlow = () => {
  const dispatch = useDispatch();
  const { userData, userType } = useSelector((state) => state.user);
  const [realTimeData, setRealTimeData] = useState({}); 
  const [searchResult, setSearchResult] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStack, setSelectedStack] = useState("all"); 
  const [energyStacks, setEnergyStacks] = useState([]);
  const { searchTerm } = useOutletContext();
  const [currentUserName, setCurrentUserName] = useState(
    userType === 'admin' ? "KSPCB001" : userData?.validUserOne?.userName
  );
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Define units for parameters
  const parameterUnits = {
    energy: "kW/hr",
    power: "W",
    voltage: "V",
    current: "A",
  };

  // Fetch energy stacks
  const fetchEnergyStacks = async (userName) => {
    try {
      const response = await fetch(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
      const data = await response.json();
      const stacks = data.stackNames.filter(stack => stack.stationType === 'energy').map(stack => stack.name);
      setEnergyStacks(stacks);
    } catch (error) {
      console.error("Error fetching energy stacks:", error);
    }
  };

  const fetchData = async (userName) => {
    setLoading(true);
    try {
      const result = await dispatch(fetchIotDataByUserName(userName)).unwrap();
      setSearchResult(result);
      setCompanyName(result?.companyName || "Unknown Company");
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResult(null);
      setCompanyName("Unknown Company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userName = searchTerm || currentUserName;
    fetchData(userName);
    fetchEnergyStacks(userName);
  }, [searchTerm, currentUserName]);

  useEffect(() => {
    const userName = searchTerm || currentUserName;
    console.log('Joining room:', userName);

    socket.emit('joinRoom', { userId: userName });

    socket.on('energyDataUpdate', (data) => {
      console.log('Received real-time data:', data);
      setRealTimeData((prevData) => ({
        ...prevData,
        [data.stackName]: data,
      }));
    });

    socket.on('allEnergyDataUpdate', (dataArray) => {
      const newData = dataArray.reduce((acc, item) => {
        acc[item.stackName] = item;
        return acc;
      }, {});
      setRealTimeData(newData);
    });

    return () => {
      console.log('Leaving room:', userName);
      socket.emit('leaveRoom', { userId: userName });
      socket.off('energyDataUpdate');
      socket.off('allEnergyDataUpdate');
    };
  }, [searchTerm, currentUserName]);

  const handleStackChange = (event) => {
    setSelectedStack(event.target.value);
  };

  const handleNextUser = () => {
    const userIdNumber = parseInt(currentUserName.replace(/[^\d]/g, ''), 10);
    if (!isNaN(userIdNumber)) setCurrentUserName(`KSPCB${String(userIdNumber + 1).padStart(3, '0')}`);
  };

  const handlePrevUser = () => {
    const userIdNumber = parseInt(currentUserName.replace(/[^\d]/g, ''), 10);
    if (!isNaN(userIdNumber) && userIdNumber > 1) setCurrentUserName(`KSPCB${String(userIdNumber - 1).padStart(3, '0')}`);
  };

  const filteredData = selectedStack === "all"
    ? Object.values(realTimeData)
    : Object.values(realTimeData).filter(data => data.stackName === selectedStack);

  return (
    <div className="content-wrapper">
      <div className="row page-title-header">
        <div className="col-12">
          <div className="page-header d-flex justify-content-between">
            {userType === 'admin' ? (
              <>
                <button className="btn btn-primary" onClick={handlePrevUser} disabled={loading}>
                  Prev
                </button>
                <h4 className="page-title">Quantity Flow Dashboard</h4>
                <button className="btn btn-primary" onClick={handleNextUser} disabled={loading}>
                  Next
                </button>
              </>
            ) : (
              <div className="mx-auto">
                <h4 className="page-title">Energy Dashboard</h4>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-md-4">
          {searchResult?.stackData && (
            <div className="stack-dropdown">
              <label htmlFor="stackSelect">Select Station:</label>
              <select
                id="stackSelect"
                className="form-select"
                value={selectedStack}
                onChange={handleStackChange}
              >
                <option value="all">All Stations</option>
                {searchResult.stackData
                  .filter(stack => energyStacks.includes(stack.stackName))
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
          <button className="btn btn-primary" onClick={() => setShowHistoryModal(true)}>
            Daily History
          </button>
        </div>
      </div>

      {loading && (
        <div className="spinner-container">
          <Oval height={60} width={60} color="#236A80" ariaLabel="Loading" />
        </div>
      )}

      <div className="row">
        {!loading && filteredData.length > 0 && (
          <div className="col-12 mb-4">
            <div className="stack-box">
              <div className="row">
                {filteredData.map((data, index) => (
                  <div className="col-12 mb-4" key={index}>
                    <div className="card h-100">
                      <div className="card-body">
                        <h3 className="text-center mb-3">{data.stackName}</h3>
                        <div className="d-flex justify-content-around flex-wrap">
                          {Object.entries(data)
                            .filter(([key]) => !key.toLowerCase().includes('timestamp') && key !== 'stackName')
                            .map(([key, value]) => (
                              <div className="p-2" key={key}>
                                <div className="card text-center">
                                  <div className="card-body">
                                    <h5 className="card-title">{key}</h5>
                                    <h6 className="card-text">
                                      <strong>{value || 'N/A'} {parameterUnits[key] || ''}</strong>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <DailyHistoryModal isOpen={showHistoryModal} onRequestClose={() => setShowHistoryModal(false)} />
    </div>
  );
};

export default EnergyFlow;

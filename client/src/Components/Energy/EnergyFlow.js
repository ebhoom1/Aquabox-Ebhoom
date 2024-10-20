import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import EnergyGraphPopup from './EnergyGraphPopup';
import CalibrationPopup from '../Calibration/CalibrationPopup';
import CalibrationExceeded from '../Calibration/CalibrationExceeded';
import { useOutletContext } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import DailyHistoryModal from '../Water/DailyHistoryModal';
import { API_URL } from "../../utils/apiConfig";

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

  const [energyStacks, setEnergyStacks] = useState([]);

  // Fetch energy stacks
  const fetchEnergyStacks = async (userName) => {
    try {
      const response = await fetch(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
      const data = await response.json();
      const energyStacks = data.stackNames
        .filter(stack => stack.stationType === 'energy')
        .map(stack => stack.name);
      setEnergyStacks(energyStacks);
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
      fetchEnergyStacks(searchTerm);
    } else {
      fetchData(currentUserName);
      fetchEnergyStacks(currentUserName);
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

  const handleStackChange = (event) => {
    setSelectedStack(event.target.value);
  };

  const energyParameters = [
    { parameter: "Energy", value: 'kW/hr', name: 'energy' }
  ];

  return (
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header d-flex justify-content-between">
              {userType === 'admin' ? (
                <>
                  <button className="btn btn-primary" onClick={handlePrevUser} disabled={loading}>Prev</button>
                  <h4 className="page-title">Energy Dashboard</h4>
                  <button className="btn btn-primary" onClick={handleNextUser} disabled={loading}>Next</button>
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
                <label htmlFor="stackSelect" className="label-select">Select Station:</label>
                <select
                  id="stackSelect"
                  className="form-select styled-select"
                  value={selectedStack}
                  onChange={handleStackChange}
                >
                  <option value="all">All Stacks</option>
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
            <button className="btn btn-primary" onClick={() => setShowHistoryModal(true)}>Daily History</button>
            {userData?.validUserOne?.userType === 'user' && (
              <button type="button" onClick={handleOpenCalibrationPopup} className="btn btn-primary ml-2">Calibration</button>
            )}
          </div>
        </div>

        {loading && (
          <div className="spinner-container">
            <Oval height={60} width={60} color="#236A80" ariaLabel="Loading" />
          </div>
        )}

        <div className="row">
          {!loading && searchResult && searchResult.stackData && (
            searchResult.stackData
              .filter(stack => energyStacks.includes(stack.stackName))
              .map((stack, index) => (
                (selectedStack === "all" || selectedStack === stack.stackName) && (
                  <div key={index} className="col-12 mb-4">
                    <div className="stack-box">
                      <h4 className="text-center">{stack.stackName}</h4>
                      <div className="row">
                        {energyParameters.map((param, i) => {
                          const value = stack[param.name];
                          return value && value !== "N/A" ? (
                            <div className="col-12 col-md-4 grid-margin" key={i}>
                              <div className="card" onClick={() => handleCardClick({ title: param.parameter })}>
                                <div className="card-body">
                                  <h3>{param.parameter}</h3>
                                  <h6>
                                    <strong>{value}</strong>
                                    <span>{param.value}</span>
                                  </h6>
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
          )}
        </div>

        {showPopup && selectedCard && (
          <EnergyGraphPopup
            isOpen={showPopup}
            onRequestClose={handleClosePopup}
            parameter={selectedCard.title}
            userName={currentUserName}
          />
        )}

        <DailyHistoryModal isOpen={showHistoryModal} onRequestClose={() => setShowHistoryModal(false)} />
      </div>
  );
};

export default EnergyFlow;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom'; // Shared search context
import { Oval } from 'react-loader-spinner'; // Import Oval spinner
import { API_URL } from '../../utils/apiConfig';
import { useSelector } from 'react-redux'; // Redux for userType check
import ConsumptionPredictionGraphEnergy from './ConsumptionPredictionGraphEnergy';

const EnergyOverview = () => {
  const { userType, userData } = useSelector((state) => state.user); // Fetch userType and userData from Redux
  const [summaryData, setSummaryData] = useState({ totalEnergy: 0 });
  const [predictionData, setPredictionData] = useState({ predictedEnergy: 0 });
  const [loading, setLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const { searchTerm } = useOutletContext(); // Get search term from context
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    const userName =
      userType === 'admin'
        ? searchTerm || currentUserName
        : userData?.validUserOne?.userName;

    if (userName) {
      fetchEnergyData(userName);
      fetchPredictionData(userName);
      setCurrentUserName(userName);
    }
  }, [searchTerm, currentUserName, userType, userData]);

  const fetchEnergyData = async (userName) => {
    try {
      const response = await axios.get(`${API_URL}/api/summary/${userName}/daily`);
      const data = response.data[0]; // Assume first entry is relevant

      setSummaryData({
        totalEnergy: data?.totalEnergy || 0,
      });
    } catch (error) {
      console.error('Error fetching energy data:', error);
      setSummaryData({ totalEnergy: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictionData = async (userName) => {
    try {
      const response = await axios.get(`${API_URL}/api/prediction-summary/${userName}/hourly`);
      const prediction = response.data[0]; // Assume first entry is relevant

      setPredictionData({
        predictedEnergy: prediction?.predictedEnergy || 0,
      });
    } catch (error) {
      console.error('Error fetching prediction data:', error);
      setPredictionData({ predictedEnergy: 0 });
    } finally {
      setPredictionLoading(false);
    }
  };

  if (loading || predictionLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
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
    );
  }

  return (
    <div className="container-fluid">
    <div className="row mt-4">
      {/* Left Section */}
      <div className="col-md-6">
        <h3 className="text-center mb-4">Total Energy Usage</h3>
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="card h-100">
            <small className="text-end p-2">{new Date().toLocaleDateString()}</small>
            <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title text-center">Total Energy</h5>
                <p className="text-center display-3">
                  {summaryData.totalEnergy.toLocaleString()} kWh
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <h3 className="text-center mb-4">Prediction for Next Usage</h3>
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="card h-100">
            <small className="text-end p-2">{new Date().toLocaleDateString()}</small>
            <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title text-center">Predicted Energy</h5>
                <p className="text-center display-3">
                  {predictionData.predictedEnergy.toLocaleString()} kWh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Right Section */}
      <div className="col-md-6">
        <div className="card" style={{ height: '100%' }}>
          <ConsumptionPredictionGraphEnergy />
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default EnergyOverview;

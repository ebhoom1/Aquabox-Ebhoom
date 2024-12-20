import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom'; // Shared search context
import { Oval } from 'react-loader-spinner'; // Import Oval spinner
import ConsumptionPredictionGraph from './ConsumptionPredictionGraph';
import { API_URL } from '../../utils/apiConfig';
import { useSelector } from 'react-redux'; // Redux for userType check

const EffluentFlowOverview = () => {
  const { userType, userData } = useSelector((state) => state.user); // Fetch userType and userData from Redux
  const [summaryData, setSummaryData] = useState({ totalInflow: 0, totalFinalflow: 0 });
  const [predictionData, setPredictionData] = useState({ predictedInflow: 0, predictedFinalflow: 0 });
  const [loading, setLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const { searchTerm } = useOutletContext(); // Get search term from context
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    const userName = userType === 'admin' 
      ? searchTerm || currentUserName 
      : userData?.validUserOne?.userName;

    if (userName) {
      fetchData(userName);
      fetchPredictionData(userName);
      setCurrentUserName(userName);
    }
  }, [searchTerm, currentUserName, userType, userData]);

  const fetchData = async (userName) => {
    const intervals = ['monthly', 'daily', 'hourly', '30Minutes', '15Minutes'];
    let data = null;

    try {
      const today = new Date().toISOString().split('T')[0];
      setCurrentDate(
        new Date().toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );

      for (let interval of intervals) {
        const response = await axios.get(`${API_URL}/api/summary/${userName}/hourly`);
        if (response.data && response.data.length > 0) {
          const currentDateData = response.data.find(
            (entry) => new Date(entry.interval).toISOString().split('T')[0] === today
          );
          if (currentDateData) {
            data = currentDateData;
            break;
          }
        }
      }

      setSummaryData(data || { totalInflow: 0, totalFinalflow: 0 });
    } catch (error) {
      console.error('Error fetching data:', error);
      setSummaryData({ totalInflow: 0, totalFinalflow: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictionData = async (userName) => {
    try {
      const response = await axios.get(`${API_URL}/api/prediction-summary/${userName}/hourly`);
      const prediction = response.data[0];

      setPredictionData(prediction || { predictedInflow: 0, predictedFinalflow: 0 });
    } catch (error) {
      console.error('Error fetching prediction data:', error);
      setPredictionData({ predictedInflow: 0, predictedFinalflow: 0 });
    } finally {
      setPredictionLoading(false);
    }
  };

  if (loading || predictionLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Oval height={60} width={60} color="#236A80" ariaLabel="Fetching details" secondaryColor="#e0e0e0" />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mt-4">
       

        {/* Right Section */}
        <div className="col-md-12">
          <div className="card" style={{ height: '100%' }}>
            <ConsumptionPredictionGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffluentFlowOverview;

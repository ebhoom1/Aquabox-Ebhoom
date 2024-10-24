import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../../utils/apiConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewDifference = () => {
  const location = useLocation(); // Retrieve state from the router
  const { userName, stackName, interval, fromDate, toDate } = location.state || {};
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data based on parameters passed via navigation
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/difference/viewData`, {
        params: { userName, stackName, interval, fromDate, toDate },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName && stackName && interval && fromDate && toDate) {
      fetchData();
    } else {
      setError('Invalid parameters. Please go back and try again.');
      setLoading(false);
    }
  }, [userName, stackName, interval, fromDate, toDate]);

  return (
    <div className="container mt-5">
      <h2>Energy Data View</h2>
      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SL. NO</th>
                <th>Stack Name</th>
                <th>Initial Energy</th>
                <th>Last Energy</th>
                <th>Energy Difference</th>
                <th>Date</th>
                <th>Time</th>
                <th>Day</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.stackName}</td>
                  <td>{item.initialEnergy}</td>
                  <td>{item.lastEnergy}</td>
                  <td>{item.energyDifference}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.day}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewDifference;

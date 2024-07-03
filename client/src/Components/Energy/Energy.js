import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAverageDataByUserName, fetchDifferenceDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ToastContainer } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

const Energy = () => {
  const dispatch = useDispatch();
  const { userData, userType } = useSelector((state) => state.user);
  const { averageData, differenceData, loading, error } = useSelector((state) => state.iotData);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [interval, setInterval] = useState("year");
  const { searchTerm, handleSearch } = useOutletContext();

  useEffect(() => {
    const fetchData = async (userName) => {
      try {
        await dispatch(fetchAverageDataByUserName({ userName, interval })).unwrap();
        await dispatch(fetchDifferenceDataByUserName(userName)).unwrap();
        setSearchResult(userName);
        setSearchError("");
      } catch (error) {
        setSearchResult(null);
        setSearchError("No result found for this userID");
      }
    };

    if (searchTerm) {
      fetchData(searchTerm);
    } else if (userData && userType === 'user') {
      fetchData(userData.validUserOne.userName);
    }
  }, [searchTerm, userData, userType, interval, dispatch]);

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    if (searchResult) {
      dispatch(fetchAverageDataByUserName({ userName: searchResult, interval: newInterval }));
    } else if (userData && userType === 'user') {
      dispatch(fetchAverageDataByUserName({ userName: userData.validUserOne.userName, interval: newInterval }));
    }
  };

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    if (interval === "hour") {
      return date.toLocaleTimeString();
    } else if (interval === "day") {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (interval === "week" || interval === "sixmonth") {
      return date.toLocaleDateString();
    } else if (interval === "month") {
      return date.toLocaleString('en-US', { month: 'short' });
    } else if (interval === "year") {
      return date.getFullYear();
    }
    return tickItem;
  };

  const getDatesHeaders = () => {
    if (!differenceData || differenceData.length === 0) return [];
    return Object.keys(differenceData[0]).filter(key => key.startsWith('date'));
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Energy Dashboard</h4>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h1>{searchResult ? `User: ${searchResult}` : searchError}</h1>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <h2>Energy Flow</h2>
                <div className="table-responsive mt-3">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>SI.No</th>
                        <th>Parameter</th>
                        <th>Acceptable <br /> Limits</th>
                        {getDatesHeaders().map((date, index) => (
                          <th key={index}>{date}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(differenceData) && differenceData.length > 0 ? (
                        differenceData.map((data, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td>{index + 1}</td>
                              <td>FL-Inlet raw sewage,KLD</td>
                              {getDatesHeaders().map((date, index) => (
                                <td key={index}>{data[date] ? data[date].inflowDifference : '-'}</td>
                              ))}
                            </tr>
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={getDatesHeaders().length + 3} className="text-center">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <ToastContainer />
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4 mb-5">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <h2 className="m-3">Trending Analysis - FL - STP Incomer Energy Consumption, kWh</h2>
                <div className="btn-group" role="group">
                  <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('hour')}>Hour</button>
                  <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('day')}>Day</button>
                  <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('week')}>Week</button>
                  <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('month')}>Month</button>
                  <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('sixmonth')}>Six Months</button>
                  <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('year')}>Year</button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={searchResult ? averageData : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="energy" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="container-fluid clearfix">
            <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
              AquaBox Control and Monitor System
            </span>
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
              © <a href="" target="_blank">EnviRobotics</a> 2022
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Energy;

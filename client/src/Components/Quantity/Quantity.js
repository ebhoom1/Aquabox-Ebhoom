import React, { useEffect, useState } from "react";
import { fetchUser } from "../../redux/features/user/userSlice";
import { fetchAverageDataByUserName, fetchIotDataByUserName,fetchDifferenceDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { useDispatch, useSelector } from 'react-redux';
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

const Quantity = () => {
  const dispatch = useDispatch();
  const { userData, userType } = useSelector((state) => state.user);
  const { averageData, differenceData, loading, error } = useSelector((state) => state.iotData);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [interval, setInterval] = useState("year");

  const validateUser = async () => {
    const response = await dispatch(fetchUser()).unwrap();
  };

  if (!userData) {
    validateUser();
  }

  useEffect(() => {
    if (userData && userType === 'user') {
      dispatch(fetchAverageDataByUserName({ userName: userData.validUserOne.userName, interval }));
      dispatch(fetchDifferenceDataByUserName(userData.validUserOne.userName))
    }
  }, [userData, userType, interval, dispatch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(fetchIotDataByUserName(searchQuery)).unwrap();
      setSearchResult(searchQuery);
      setSearchError("");
      dispatch(fetchAverageDataByUserName({ userName: searchQuery, interval }));
      dispatch(fetchDifferenceDataByUserName(searchQuery))

    } catch (err) {
      setSearchResult(null);
      setSearchError("No result");
    }
  };

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
        {/* Page Title Header Starts */}
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Quantity Dashboard</h4>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                
              </div>
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h1>Find Users</h1>
            <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">
                Search
              </button>
            </form>
            <h1>{searchResult ? searchResult : searchError}</h1>
          </div>
        </div>

       

        {/* Water Flow Table */}
        <div className="card">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <h2>Water Flow</h2>
                <div className="table-responsive mt-3">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Parameter</th>
                        {getDatesHeaders().map((date, index) => (
                          <th key={index}>{date}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(differenceData) && differenceData.map((data, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>FL-Inlet raw sewage,KLD</td>
                            {getDatesHeaders().map((date, index) => (
                              <td key={index}>{data[date] ? data[date].inflowDifference : '-'}</td>
                            ))}
                          </tr>
                          <tr>
                            <td>{index + 1}</td>
                            <td>FL-Treated Water,KLD</td>
                            {getDatesHeaders().map((date, index) => (
                              <td key={index}>{data[date] ? data[date].finalflowDifference : '-'}</td>
                            ))}
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ToastContainer />
              </div>
            </div>
          </div>
        </div>

        {/* FL-Inlet raw sewage */}
        <div className="card mb-4 mt-4">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <h2 className="m-3">Total FL Sewage Graph</h2>
                <div className="btn-group" role="group">
              <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('hour')}>Hour</button>
              <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('day')}>Day</button>
              <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('week')}>Week</button>
              <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('month')}>Month</button>
              <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('sixmonth')}>Six Months</button>
              <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('year')}>Year</button>
            </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={averageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inflow" fill="#8884d8" />
                    <Bar dataKey="finalflow" fill="#82ca9d" />
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
              {" "}
              ©{" "}
              <a href="" target="_blank">
                Ebhoom Solutions LLP
              </a>{" "}
              2022
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Quantity;

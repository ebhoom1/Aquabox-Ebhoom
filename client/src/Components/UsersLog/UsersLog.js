import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, setFilteredUsers } from "../../redux/features/userLog/userLogSlice";
import KeralaMap from './KeralaMap';
import ValidateData from "../ValidateData/ValidateData";
import { useNavigate } from "react-router-dom";
import './index.css';

const UsersLog = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortCategory, setSortCategory] = useState("");
  const [sortOptions, setSortOptions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, filteredUsers, loading, error } = useSelector((state) => state.userLog);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(user => user.userName.toLowerCase().includes(query));
    dispatch(setFilteredUsers(filtered));
  };

  const handleUserClick = (userName) => {
    navigate('/ambient-air', { state: { userName } });
  };

  const handleSortCategoryChange = (category) => {
    setSortCategory(category);
    if (category === "Industry Type") {
      const uniqueIndustryTypes = [...new Set(users.map(user => user.industryType))];
      setSortOptions(uniqueIndustryTypes);
    } else if (category === "Location") {
      const uniqueLocations = [...new Set(users.map(user => user.district))];
      setSortOptions(uniqueLocations);
    }
  };

  const handleSortOptionSelect = (option) => {
    const sortedUsers = [...users].filter(user =>
      (sortCategory === "Industry Type" ? user.industryType : user.district) === option
    );
    dispatch(setFilteredUsers(sortedUsers));
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Control and Monitor Dashboard</h4>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <KeralaMap users={users} />
          </div>
        </div>

        {/* Divider */}
        <div className="p-2"></div>

        {/* New Box for Listing Users */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">User List</h5>
            <div className="sort-dropdown">
              <label>Sort by: </label>
              <select onChange={(e) => handleSortCategoryChange(e.target.value)}>
                <option value="">Select</option>
                <option value="Industry Type">Industry Type</option>
                <option value="Location">Location</option>
              </select>
              {sortCategory && (
                <select onChange={(e) => handleSortOptionSelect(e.target.value)}>
                  <option value="">Select {sortCategory}</option>
                  {sortOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
            
            {loading && <p>Loading...</p>}
            {error && <p>Error fetching users: {error}</p>}
            {!loading && !error && (
              <div className="user-list-container">
                <table className="userlog-table">
                  <thead>
                    <tr>
                      <th className=" userlog-head">Company Name</th>
                      <th className=" userlog-head">User Name</th>
                      <th className=" userlog-head">Industry Type</th>
                      <th className=" userlog-head">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} onClick={() => handleUserClick(user.userName)}>
                        <td className="userlog-head">{user.companyName}</td>
                        <td className=" userlog-head">{user.userName}</td>
                        <td className=" userlog-head">{user.industryType}</td>
                        <td className=" userlog-head">{user.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="p-2"></div>

        <ValidateData />
      </div>
      
      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
            AquaBox Control and Monitor System
          </span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
            {" "} ©{" "}
            <a href="" target="_blank">
              Ebhoom Solutions LLP
            </a>{" "} 2022
          </span>
        </div>
      </footer>
    </div>
  );
};

export default UsersLog;
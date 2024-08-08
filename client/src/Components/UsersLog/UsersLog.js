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
        <div className="p-2"></div>
        {/* Divider */}

        {/* New Box for Listing Users */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">User List</h5>
            {loading && <p>Loading...</p>}
            {error && <p>Error fetching users: {error}</p>}
            {!loading && !error && (
              <div className="user-list-container">
                <ul className="list-group">
                  {users.map((user) => (
                    <li key={user._id} className="list-group-item" onClick={() => handleUserClick(user.userName)}>
                      {user.userName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="p-2"></div>
        <div className="p-2"></div>
        {/* Divider */}

        <ValidateData />
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
  );
};

export default UsersLog;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationDisplay from './LocationDisplay';
import DownloadData from "../Download-Data/DownloadData";
import KeralaMap from './KeralaMap';
import { ToastContainer } from "react-toastify";
import './index.css';

const UsersLog = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const url = 'http://localhost:4444'
  const deployed_url = 'https://aquabox-ebhoom-3.onrender.com'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${deployed_url}/api/getallusers`);
        const userData = response.data.users;
        setUsers(userData);
      } catch (error) {
        console.error(`Error in fetching users`, error);
      }
    };
    fetchUsers();
  }, []);

  const handleLocationClick = (userId) => {
    const user = users.find(user => user._id === userId);
    if (user) {
      setShowLocationModal(true);
      setSelectedUser(user);
    }
  };

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
    setSelectedUser(null);
  };

  const navigate = useNavigate();

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Control and Monitor Dashboard</h4>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                <ul className="quick-links ml-auto">
                  <li><a href="#">Settings</a></li>
                  <li><a href="#">Option 1</a></li>
                  <li><a href="#">option 2</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <KeralaMap users={users} />
          </div>
        </div>
        <div className="card">
          <div className="card-body">
          
          </div>
        </div>
        <DownloadData />
      </div>
      {showLocationModal && (
        <LocationDisplay
          latitude={selectedUser.latitude}
          longitude={selectedUser.longitude}
          address={selectedUser.address}
          onClose={handleCloseLocationModal}
        />
      )}
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
}

export default UsersLog;

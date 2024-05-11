import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

const LeftSideBar = () => {
  const [userType, setUserType] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate  = useNavigate();
  const deployed_url = 'https://aquabox-ebhoom-3.onrender.com'
  const url ='http://localhost:4444'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userdatatoken");
        const response = await axios.get(`${deployed_url}/api/validuser`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          }
        });
        const responseData = response.data;

        if (responseData.status === 401 || !responseData.validUserOne) {
          console.log("User not valid");
          navigate('/');
        } else {
          console.log("User Verify");
          setUserType(responseData.validUserOne.userType);
          console.log("User Type :::::", responseData.validUserOne.userType);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error("Error Validating user:", error);
        navigate('/');
      }
    };

    fetchData();
  }, []);

  // Define menu items based on userType
  const getMenuItems = () => {
    if (userType === 'admin') {
      return (
        <>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/manage-users">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Manage Users</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/users-log">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Users Log</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/calibration">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Calibration</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/notification">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Notification</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/account">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Account</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/water">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Effluent/Water Dashboard</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/ambient-air">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Ambient Air Dashboard</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/noise">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Noise Dashboard</span>
            </Link>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/account">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Account</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/water">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Effluent/Water Dashboard</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/ambient-air">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Ambient Air Dashboard</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/noise">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Noise Dashboard</span>
            </Link>
          </li>
        </>
      );
    }
  };

  if (!dataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <nav className='sidebar sidebar-offcanvas' id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="#" className="nav-link">
            <div className="text-wrapper">
              <p className="profile-name">Ebhoom Solutions</p>
              <p className="designation">AquaBox Model M</p>
            </div>
          </a>
        </li>
        <li className="nav-item nav-category">Main Menu</li>
        {getMenuItems()}
      </ul>
    </nav>
  );
};

export default LeftSideBar;

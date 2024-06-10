import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { fetchUser, fetchNotifications, logoutUser } from './../../redux/features/user/userSlice';
import LeftSideBar from '../LeftSideBar/LeftSideBar';
import './index.css';

const PrivateLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, notifications, loading, error } = useSelector((state) => state.user);
  const [isDropdownOpenNotification, setIsDropdownOpenNotification] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine ? 'Online' : 'Offline');

  
  const validateUser = async () => {
    try {
      const response = await dispatch(fetchUser()).unwrap();
      console.log('response from PrivateLayout:', response);
      if (!response) {
        navigate('/');
      } else {
        dispatch(fetchNotifications(response.userData.validUserOne._id));
        
      }
    } catch (error) {
      console.error('Error Validating user:', error);
      navigate('/');
    }
  };

  if (!userData) {
    validateUser();
    
  }
  
  const handleOnlineStatusChange = () => {
    setOnlineStatus(navigator.onLine ? 'Online' : 'Offline');
  };

  window.addEventListener('online', handleOnlineStatusChange);
  window.addEventListener('offline', handleOnlineStatusChange);

  const toggleDropdownNotification = () => {
    setIsDropdownOpenNotification(!isDropdownOpenNotification);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  const getDropdownItems = () => {
    const { userType } = userData.validUserOne;
    if (userType === 'admin') {
      return (
        <>
          <li>
            <Link to="/manage-users" onClick={closeDropdown}>Manage Users</Link>
          </li>
          <li>
            <Link to="/users-log" onClick={closeDropdown}>Users Log</Link>
          </li>
          <li>
            <Link to="/calibration" onClick={closeDropdown}>Calibration</Link>
          </li>
          <li>
            <Link to="/notification" onClick={closeDropdown}>Notification</Link>
          </li>
          <li>
            <Link to="/account" onClick={closeDropdown}>Account</Link>
          </li>
          <li>
            <Link to="/report" onClick={closeDropdown}>Report</Link>
          </li>
          <li>
            <Link to="/support-analyzer" onClick={closeDropdown}>List of support analyzer make and model</Link>
          </li>
          <li>
            <Link to="/water" onClick={closeDropdown}>Effluent/Water Dashboard</Link>
          </li>
          <li>
            <Link to="/ambient-air" onClick={closeDropdown}>Ambient Air Dashboard</Link>
          </li>
          <li>
            <Link to="/noise" onClick={closeDropdown}>Noise Dashboard</Link>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <Link to="/account" onClick={closeDropdown}>Account</Link>
          </li>
          <li>
            <Link to="/report" onClick={closeDropdown}>Report</Link>
          </li>
          <li>
            <Link to="/support-analyzer" onClick={closeDropdown}>List of support analyzer make and model</Link>
          </li>
          <li>
            <Link to="/water" onClick={closeDropdown}>Effluent/Water Dashboard</Link>
          </li>
          <li>
            <Link to="/ambient-air" onClick={closeDropdown}>Ambient Air Dashboard</Link>
          </li>
          <li>
            <Link to="/noise" onClick={closeDropdown}>Noise Dashboard</Link>
          </li>
        </>
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container-scroller">
      <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
          <a className="navbar-brand brand-logo" href="#">
            <h1 className="aqualogo">EBHOOM</h1>
            <span className="navbar-brand brand-logo-mini">
              <h1 className="aqualogo">AB</h1>
            </span>
          </a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center">
          <ul className="navbar-nav">
            <li className="nav-item font-weight-semibold d-none d-lg-block">
              User ID : {userData.validUserOne && userData.validUserOne.userName}
            </li>
            <li className="nav-item font-weight-semibold d-none d-lg-block">
              <div>
                {onlineStatus === 'Online' ? (
                  <span className="online">Online</span>
                ) : (
                  <span className="offline">Offline</span>
                )}
              </div>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a className="nav-link count-indicator" onClick={toggleDropdownNotification}>
                <i className="mdi mdi-bell-outline"></i>
                <span className="count">{notifications.length}</span>
              </a>
              {isDropdownOpenNotification && (
                <div className="dropdown-container-notification">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <a className="notification-item" key={index}>
                        <div className="notification-message">
                          <h3 className="notification-message-h3">{notification.message}</h3>
                          <p className="notification-message-p">{notification.timeOfCalibrationAdded}</p>
                          <p className="notification-message-p">{notification.dateOfCalibrationAdded}</p>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p className="empty-notification">No new notifications</p>
                  )}
                </div>
              )}
            </li>
            <li className="nav-item dropdown d-xl-inline-block user-dropdown">
              <a className="nav-link dropdown-toggle" id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                <img className="img-xs rounded-circle" src="assets/images/admin.png" alt="Profile image" />
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                <div className="dropdown-header text-center">
                  <img className="img-md rounded-circle" src="assets/images/admin.png" alt="Profile image" />
                  <p className="font-weight-light text-muted mb-0">{userData.validUserOne && userData.validUserOne.userName}</p>
                </div>
                <a className="dropdown-item" onClick={handleLogout}>
                  Sign Out<i className="dropdown-item-icon ti-power-off"></i>
                </a>
              </div>
            </li>
            
          </ul>
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            onClick={toggleDropdown}
          >
            <span className="mdi mdi-menu"></span>
          </button>
           {/* Dropdown */}
           {isDropdownOpen && (
            <div className="dropdown-menu-right navbar-dropdown toggle-dropdown">
              <ul className="dropdown-list">
                {getDropdownItems()}
              </ul>
            </div>
          )}
        </div>
      </nav>
      
      <div className="container-fluid page-body-wrapper">
      <LeftSideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateLayout;
 

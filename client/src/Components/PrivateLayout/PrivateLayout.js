import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { fetchUser, logoutUser } from './../../redux/features/user/userSlice';
import { fetchIotDataByUserName } from './../../redux/features/iotData/iotDataSlice'; 
import axios from 'axios';
import LeftSideBar from '../LeftSideBar/LeftSideBar';
import './index.css';
import { API_URL } from '../../utils/apiConfig';

const PrivateLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading, error } = useSelector((state) => state.user);
  const [isDropdownOpenNotification, setIsDropdownOpenNotification] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDashboardSubmenuOpen, setIsDashboardSubmenuOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine ? 'Online' : 'Offline');
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await dispatch(fetchUser()).unwrap();
        console.log('User Data:', response);
        if (!response) {
          navigate('/');
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

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [dispatch, navigate, userData]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userData && userData.validUserOne) {
        try {
          const response = await axios.get(`${API_URL}/api/get-notification-of-user/${userData.validUserOne.userName}`);
          setNotifications(response.data.userNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [userData]);

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
    setIsDashboardSubmenuOpen(false); // Close the dashboard submenu as well
  };

  const toggleDashboardSubmenu = () => {
    setIsDashboardSubmenuOpen(!isDashboardSubmenuOpen);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setSubmittedSearchTerm(searchTerm);
    setSearchStatus('loading');
    try {
      const response = await dispatch(fetchIotDataByUserName(searchTerm)).unwrap();
      setSearchResults(response);
      setSearchStatus('success');
    } catch (error) {
      console.error('Error fetching IoT data:', error); // Log the error object to the console
      setSearchStatus('error');
    }
  };

  const getDropdownItems = () => {
    const { userType } = userData.validUserOne;
    if (userType === 'admin') {
      return (
        <>
          <li>
            <a href="#" onClick={toggleDashboardSubmenu}>
              Quality
            </a>
            {isDashboardSubmenuOpen && (
              <ul className="dropdown-submenu">
                <li><Link to="/water" onClick={closeDropdown}>Effluent/Water Dashboard</Link></li>
                <li><Link to="/ambient-air" onClick={closeDropdown}>Ambient Air Dashboard</Link></li>
                <li><Link to="/noise" onClick={closeDropdown}>Noise Dashboard</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/quantity" onClick={closeDropdown}>Quantity</Link></li>
          <li><Link to="/energy" onClick={closeDropdown}>Energy</Link></li>
          <li><Link to="/live-video" onClick={closeDropdown}>Live Emission Video</Link></li>
          <li><Link to="/manage-users" onClick={closeDropdown}>Manage Users</Link></li>
          <li><Link to="/users-log" onClick={closeDropdown}>Users Log</Link></li>
          <li><Link to="/calibration" onClick={closeDropdown}>Calibration</Link></li>
          <li><Link to="/notification" onClick={closeDropdown}>Notification</Link></li>
          <li><Link to="/account" onClick={closeDropdown}>Account</Link></li>
          <li><Link to="/report" onClick={closeDropdown}>Report</Link></li>
          <li><Link to="/subscribe-data" onClick={closeDropdown}>Subscribe</Link></li>
          <li><Link to="/support-analyzer" onClick={closeDropdown}>List of support analyzer <br/>make and model</Link></li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <a href="#" onClick={toggleDashboardSubmenu}>
              Dashboard Components
            </a>
            {isDashboardSubmenuOpen && (
              <ul className="dropdown-submenu">
                <li><Link to="/water" onClick={closeDropdown}>Effluent/Water Dashboard</Link></li>
                <li><Link to="/ambient-air" onClick={closeDropdown}>Ambient Air Dashboard</Link></li>
                <li><Link to="/noise" onClick={closeDropdown}>Noise Dashboard</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/quantity" onClick={closeDropdown}>Quantity</Link></li>
          <li><Link to="/energy" onClick={closeDropdown}>Energy</Link></li>
          <li><Link to="/live-video" onClick={closeDropdown}>Live Emission Video</Link></li>
          <li><Link to="/account" onClick={closeDropdown}>Account</Link></li>
          <li><Link to="/report" onClick={closeDropdown}>Report</Link></li>
          <li><Link to="/transactions" onClick={closeDropdown}>Payment</Link></li>
          <li><Link to="/support-analyzer" onClick={closeDropdown}>List of support analyzer make and model</Link></li>
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
              User ID: {userData.validUserOne && userData.validUserOne.userName}
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
          <ul className="navbar-nav">
            <li className="nav-item font-weight-semibold d-none d-lg-block">
              {userData.validUserOne.userType === 'admin' && (
                <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
                  <input
                    className={`form-control mr-sm-2 ${searchStatus === 'error' ? 'is-invalid' : searchStatus === 'success' ? 'is-valid' : ''}`}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search user data..."
                    style={{ width: "300px" }}
                  />
                  <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
                  {searchStatus === 'error' && <div className="invalid-feedback">No result found</div>}
                  {searchStatus === 'success' && <div className="valid-feedback">Success</div>}
                </form>
              )}
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a className="nav-link count-indicator" onClick={toggleDropdownNotification}>
                <i className="mdi mdi-bell-outline notification-indication"></i>
                <span className="count">{notifications.length}</span>
              </a>
              {isDropdownOpenNotification && (
                <div className="dropdown-container-notification">
                  {notifications.map((notification, index) => (
                    <a key={notification._id} className="notification-item">
                      <div className="notification-message">
                        <h5 className="notification-message-h5">{notification.subject}</h5>
                        <p className="notification-message-p">{notification.message}</p>
                        <p className="notification-message-p">{notification.dateOfNotificationAdded}</p>
                      </div>
                    </a>
                  ))}
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
        <Outlet context={{ searchTerm: submittedSearchTerm, searchStatus, handleSearch }} />
      </div>
    </div>
  );
};

export default PrivateLayout;

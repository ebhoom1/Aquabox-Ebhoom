import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/features/user/userSlice';

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType, loading, error, userData } = useSelector((state) => state.user);

  const validateUser = async () => {
    try {
      const response = await dispatch(fetchUser()).unwrap();
      console.log('response from LeftSideBar:', response);
      if (!response) {
        navigate('/');
      }
    } catch (error) {
      console.error(`Error Validating user: ${error}`);
      navigate('/');
    }
  };

  if (!userData) {
    validateUser();
  }

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
            <Link className="nav-link" to="/calibration-exceed-value">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Calibration Exceed value</span>
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
            <Link className="nav-link" to="/report">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Report</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/subscribe-data">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Subscribe</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/list-of-support-analyser-make-and-model">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">List of supported analyser<br /> make and model</span>
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
            <Link className="nav-link" to="/report">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Report</span>
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link className="nav-link" to="/list-of-support-analyser-make-and-model">
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">List of support analyser<br /> make and model</span>
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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <nav className="sidebar sidebar-offcanvas"  id="sidebar">
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

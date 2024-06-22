import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/features/user/userSlice';

// NavItem component to handle individual list items
const NavItem = ({ to, iconClass, title, subtitle }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <li className="nav-item">
      <Link
        className="nav-link"
        to={to}
        style={{ backgroundColor: isHovered ? '#c8d425' : 'inherit' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <i className={`menu-icon ${iconClass}`}></i>
        <span className="menu-title"style={{
            display: 'inline-block',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
          }}>{title}
           {subtitle && (
            <span style={{ display: 'block', fontSize: '1em' }}>{subtitle}</span>
          )}
          </span>
      </Link>
    </li>
  );
};

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType, loading, error, userData } = useSelector((state) => state.user);
  const [showDashboardSubMenu, setShowDashboardSubMenu] = useState(false);

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

  const handleDashboardClick = () => {
    setShowDashboardSubMenu(!showDashboardSubMenu);
  };

  const getMenuItems = () => {
    if (userType === 'admin') {
      return (
        <>
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleDashboardClick}>
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Dashboard Components</span>
            </a>
            {showDashboardSubMenu && (
              <ul className="nav">
                <NavItem
                  to="/water"
                  iconClass="typcn typcn-document-text"
                  title="Effluent/Water Dashboard"
                />
                <NavItem
                  to="/ambient-air"
                  iconClass="typcn typcn-document-text"
                  title="Ambient Air Dashboard"
                />
                <NavItem
                  to="/noise"
                  iconClass="typcn typcn-document-text"
                  title="Noise Dashboard"
                />
              </ul>
            )}
          </li>
          <NavItem to="/quantity" iconClass="typcn typcn-document-text" title="Quantity" />
          <NavItem to="/energy" iconClass="typcn typcn-document-text" title="Energy" />
          <NavItem to="/manage-users" iconClass="typcn typcn-document-text" title="Manage Users" />
          <NavItem to="/users-log" iconClass="typcn typcn-document-text" title="Users Log" />
          <NavItem to="/calibration" iconClass="typcn typcn-document-text" title="Calibration" />
          <NavItem
            to="/calibration-exceed-value"
            iconClass="typcn typcn-document-text"
            title="Parameter Threshold "
             subtitle="exceedance value"
          />
          <NavItem to="/notification" iconClass="typcn typcn-document-text" title="Notification" />
          <NavItem to="/account" iconClass="typcn typcn-document-text" title="Account" />
          <NavItem to="/report" iconClass="typcn typcn-document-text" title="Report" />
          <NavItem to="/subscribe-data" iconClass="typcn typcn-document-text" title="Subscribe" />
          <NavItem
            to="/list-of-support-analyser-make-and-model"
            iconClass="typcn typcn-document-text"
            title="List of supported analyser "
            subtitle="make and model"
          />
        </>
      );
    } else {
      return (
        <>
        <li className="nav-item">
            <a href="#" className="nav-link" onClick={handleDashboardClick}>
              <i className="menu-icon typcn typcn-document-text"></i>
              <span className="menu-title">Quality</span>
            </a>
            {showDashboardSubMenu && (
              <ul className="nav flex-column sub-menu">
                <NavItem to="/water" iconClass="typcn typcn-document-text" title="Effluent/Water Dashboard" />
                <NavItem to="/ambient-air" iconClass="typcn typcn-document-text" title="Ambient Air Dashboard" />
                <NavItem to="/noise" iconClass="typcn typcn-document-text" title="Noise Dashboard" />
              </ul>
            )}
          </li>
          <NavItem to="/quantity" iconClass="typcn typcn-document-text" title="Quantity" />
          <NavItem to="/energy" iconClass="typcn typcn-document-text" title="Energy" />
          <NavItem to="/account" iconClass="typcn typcn-document-text" title="Account" />
          <NavItem to="/report" iconClass="typcn typcn-document-text" title="Report" />
          <NavItem to="/transactions" iconClass="typcn typcn-document-text" title="Payments" />
          <li className="nav-item">
            <NavItem
              to="/list-of-support-analyser-make-and-model"
              iconClass="typcn typcn-document-text"
              title="List of supported analyser "
              subtitle="make and model"
            />
            {/* <ul className="nav flex-column sub-menu">
              <NavItem to="/water" iconClass="typcn typcn-document-text" title="Effluent/Water Dashboard" />
              <NavItem to="/ambient-air" iconClass="typcn typcn-document-text" title="Ambient Air Dashboard" />
              <NavItem to="/noise" iconClass="typcn typcn-document-text" title="Noise Dashboard" />
            </ul> */}
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
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
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

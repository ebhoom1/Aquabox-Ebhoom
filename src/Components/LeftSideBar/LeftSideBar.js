import React, { useState, useEffect } from 'react';
import Attendence from "../Attendance/Attendence";
import { useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Link } from 'react-router-dom';

const LeftSideBar = () => {

 

  return (
    <nav className='sidebar sidebar-offcanvas'  id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="#" className="nav-link">
            <div className="text-wrapper">
              <p className="profile-name">Ebhoom Solutions</p>
              <p className="designation">AquaBox Model M</p>
            </div>
          </a>
        </li>
        <li className="nav-item nav-category">Main Menu
        </li>
        
         
          <>
            <li className={`nav-item`}>
              <Link className="nav-link" to="/manage-users">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Manage Users</span>
              </Link>
            </li>
            <li className={`nav-item `}>
              <Link className="nav-link" to="/users-log">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Users Log</span>
              </Link>
            </li>
            <li className={`nav-item `}>
              <Link className="nav-link" to="/calibration">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Calibration</span>
              </Link>
            </li>
          </>
        

        
          <>
            <li className={`nav-item `}>
              <Link className="nav-link" to="/water">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Effluent/Water Dashboard</span>
              </Link>
            </li>
            <li className={`nav-item `}>
              <Link className="nav-link" to="/ambient-air">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Ambient Air Dashboard</span>
              </Link>
            </li>
            <li className={`nav-item `}>
              <Link className="nav-link" to="/noise">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Noise Dashboard</span>
              </Link>
            </li>
            
            {/* <li className={`nav-item `}>
              <Link className="nav-link" to="/attendance-report">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Attendance Register</span>
              </Link>
            </li> */}
            <li className={`nav-item `}>
              <Link className="nav-link" to="/account">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Account</span>
              </Link>
            </li>
            {/* <li className={`nav-item ${className == 'report' ? 'active' : ''}`}>
              <Link className="nav-link" to="/">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Report</span>
              </Link>
            </li> */}
          </>
        
      </ul>
    </nav>
  );
};
export default LeftSideBar;
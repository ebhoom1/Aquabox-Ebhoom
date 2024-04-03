import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import './index.css'
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
import LeftSideBar from "../LeftSideBar/LeftSideBar";
import { DateRangePicker } from 'rsuite';
import { useForm, Controller } from "react-hook-form";
import LocationDisplay from './LocationDisplay';
import DownloadData from "../Download-Data/DownloadData";

const UsersLog = () => {

  const [showLocationModal,setShowLocationModal]=useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  
    const users=[
      {
        id: 1, 
        name: "User ID 1",
        latitude:10.02717,
        longitude:76.33512,
        address:'EBHOOM, Ernakulam,Kerala, India'
      },
      {
        id: 1, 
        name: "User ID 1",
        latitude:10.02303,
        longitude:76.33912,
        address:'KERALA Water Authority, Ernakulam,Kerala, India'
      }
    ]
   const handleLocationClick=(userId)=>{
    const user=users.find(user=>user.id ===  userId)
    if(user){
      setShowLocationModal(true);
      setSelectedUser(user);

    }
   }
   const handleCloseLocationModal = () => {
    setShowLocationModal(false);
    setSelectedUser(null);
  };
 
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        {/* <!-- Page Title Header Starts--> */}
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Control and Monitor Dashboard</h4>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                {/* <!-- <ul className="quick-links">
    <li><a href="#">option 1</a></li>
    <li><a href="#">Own analysis</a></li>
    <li><a href="#"> data</a></li>
  </ul> --> */}
                <ul className="quick-links ml-auto">
                  <li>
                    <a href="#">Settings</a>
                  </li>
                  <li>
                    <a href="#">Option 1</a>
                  </li>
                  <li>
                    <a href="#">option 2</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Page Title Header Ends--> */}
        <div className="row">
          <div className="col-12 col-md-6 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h1>Currently Active Users List</h1>
                  </div>
                  <div className="col-12  mb-3">
                    <ul className="list-group">
                    {users.map(user => (  
                    <li className="list-group-item">1.User ID 1
                          <div className="FloatRight">
                           <Link to='/manage-users'><button className="btn btn-primary m-3">View</button></Link>
                            <button className="btn btn-primary m-3">Login</button>
                            <button className="btn btn-primary m-3 " onClick={() => handleLocationClick(user.id)}>Location</button>

                          </div>

                        
                       

                        

                        </li>
                         ))}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h1>Currently  Inactive Users List</h1>
                  </div>

                  <div className="col-12  mb-3">
                    <ul className="list-group">
                      <li className="list-group-item">1.User ID</li>
                      <li className="list-group-item">2.User ID</li>
                      <li className="list-group-item">3.User ID</li>
                      <li className="list-group-item">4.1233242</li>
                      <li className="list-group-item">5.1321312</li>
                    </ul> </div>


                </div>
              </div>
            </div>
          </div>
        </div>
       

       
<DownloadData/>
      </div>

{/* Modal to display Location */}
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
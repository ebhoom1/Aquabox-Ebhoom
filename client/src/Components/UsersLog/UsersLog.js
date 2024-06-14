import React, { useState, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { fetchUsers,setFilteredUsers } from "../../redux/features/userLog/userLogSlice";
import DownloadData from "../ValidateData/ValidateData";
import KeralaMap from './KeralaMap';
import { ToastContainer } from "react-toastify";
import './index.css';
import ValidateData from "../ValidateData/ValidateData";

const UsersLog = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useDispatch()
  const { users, filteredUsers, loading, error } = useSelector((state) => state.userLog);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(()=>{
    dispatch(fetchUsers());
  },[]);



  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(user => user.userName.toLowerCase().includes(query));
    dispatch(setFilteredUsers(filtered));
  };
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Control and Monitor Dashboard fazil</h4>
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
         {/* divider */}
      <div className="p-2"></div>
      <div className="p-2"></div>
      {/* divider */}
        <div className="card">
          <div className="card-body">
          <h1>Find Users</h1>
            <input
              type="text"
              className="form-control"
              placeholder="Search by user name"
              value={searchQuery}
              onChange={handleSearch}
            />
          {users.length > 0 ? (
                  <ul className="list-group">
                    {filteredUsers.map(user => (
                      <li key={user._id} className="list-group-item">
                        <span>{user.userName}<br/>{user.modelName}</span>
                        
                      </li>
                      
                    ))}
                  </ul>
                ) : (
                  <p>No users found</p>
                )}
          </div>
        </div>
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
}

export default UsersLog;

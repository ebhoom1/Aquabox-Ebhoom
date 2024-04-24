import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useLocation, Outlet, Link, useNavigate } from "react-router-dom"
import LeftSideBar from "../LeftSideBar/LeftSideBar";

import './index.css'
import { LoginContext } from '../ContextProvider/Context';
import axios from 'axios';


const PrivateLayout = () => {
  const [isDropdownOpen,setIsDropdownOpen] = useState(false)
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine ? 'Online' : 'Offline');
  const toggleDropdown = () =>{
    setIsDropdownOpen(!isDropdownOpen)
  }
  const closeDropdown = () =>{
    setIsDropdownOpen(false)
  }
  const {loginData,setLoginData} = useContext(LoginContext);

  const history = useNavigate();

  const[anchorE1, setAnchorE1]=useState(null);
  const open = Boolean(anchorE1);
  const [validUserData, setValidUserData] = useState(null);

  useEffect(()=>{
    //Fetch product iD and user status when the component mounts
    
    const fetchData=async()=>{
      try{
          let token = localStorage.getItem("userdatatoken")
          const response =await axios.get('http://localhost:4444/api/validuser',{
            headers:{
              'Content-Type':"application/json",
              'Authorization':token,
              Accept:'application/json'
            },
            withCredentials: true
          })
          const data = response.data;
        console.log(data);

        if (data.status === 201) {
          // Update product ID and user status
          setValidUserData(data.validUserOne);
          console.log(data.validUserOne);
        } else {
          console.log("Error fetching user data");
        }
      }catch(error){
        console.error("Error fetching user data :", error);
      }
    }
    fetchData();
  },[])
  
  const handleClick = (event) =>{
        setAnchorE1(event.currentTarget);
  };
  const handleClose = () =>{
    setAnchorE1(null)
  }
 
  
  const logoutUser = async () =>{
    try {
      let token = localStorage.getItem("userdatatoken");

    const response = await axios.get('http://localhost:4444/api/logout',{
      headers:{
        'Content-type':"application/json",
        'Authorization':token,
        Accept:'application/json'
      },
      withCredentials:true
    });

    const data = response.data
    console.log(data);

    if(data.status === 201){

        console.log('User logged out');
        localStorage.removeItem("userdatatoken");
        setLoginData(false);
        history("/")
    }else{
      console.log("Enter Logging out");
    }
    } catch (error) {
      console.error("Error logging out :", error);
    }
    
  }
 const goDash = () =>{
      history('/')
 }
 const goError = () =>{
  history('*')
 }
 useEffect(() => {
  // Listen for online/offline status changes
  const handleOnlineStatusChange = () => {
    setOnlineStatus(navigator.onLine ? 'Online' : 'Offline');
  };
  window.addEventListener('online', handleOnlineStatusChange);
  window.addEventListener('offline', handleOnlineStatusChange);

  // Clean up event listeners
  return () => {
    window.removeEventListener('online', handleOnlineStatusChange);
    window.removeEventListener('offline', handleOnlineStatusChange);
  };
}, []);
  return (
    <div className="container-scroller">
      {/* <!-- partial:partials/_navbar.html --> */}
      <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
          <a className="navbar-brand brand-logo" href="#">
            <h1 className="aqualogo">EBHOOM</h1>
            <span className="navbar-brand brand-logo-mini">
              <h1 className="aqualogo">AB</h1>
            </span>{" "}
          </a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center">
          <ul className="navbar-nav">
          
           <li className="nav-item font-weight-semibold d-none d-lg-block">User ID : {validUserData && validUserData.userName} </li>
            

            <li className="nav-item font-weight-semibold d-none d-lg-block">
              
            <div>
              {onlineStatus === 'Online' ? (
                <span className='online'>Online</span>
              ) : (
                <span className='offline'>Offline</span>
              )}
            </div>
               
            </li>
          </ul>
          {/* <!-- <form className="ml-auto search-form d-none d-md-block" action="#">
              <div className="form-group">
                <input type="search" className="form-control" placeholder="Search Here" />
              </div>
            </form> --> */}
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link count-indicator"
                id="messageDropdown"
                href="#"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="mdi mdi-bell-outline"></i>
                <span className="count">7</span>
              </a>
              <div
                className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0"
                aria-labelledby="messageDropdown"
              >
                <a className="dropdown-item py-3">
                  <p className="mb-0 font-weight-medium float-left">
                    You have 7 unread mails{" "}
                  </p>
                  <span className="badge badge-pill badge-primary float-right">
                    View all
                  </span>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="assets/images/faces/face10.jpg"
                      alt="image"
                      className="img-sm profile-pic"
                    />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis font-weight-medium text-dark">
                      Marian Garner{" "}
                    </p>
                    <p className="font-weight-light small-text">
                      {" "}
                      The meeting is cancelled{" "}
                    </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="assets/images/faces/face12.jpg"
                      alt="image"
                      className="img-sm profile-pic"
                    />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis font-weight-medium text-dark">
                      David Grey{" "}
                    </p>
                    <p className="font-weight-light small-text">
                      {" "}
                      The meeting is cancelled{" "}
                    </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="assets/images/faces/face1.jpg"
                      alt="image"
                      className="img-sm profile-pic"
                    />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis font-weight-medium text-dark">
                      Travis Jenkins{" "}
                    </p>
                    <p className="font-weight-light small-text">
                      {" "}
                      The meeting is cancelled{" "}
                    </p>
                  </div>
                </a>
              </div>
            </li>

            <li className="nav-item dropdown d-xl-inline-block user-dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="UserDropdown"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  className="img-xs rounded-circle"
                  src="assets/images/admin.png"
                  alt="Profile image"
                />{" "}
              </a>
              <div
                className="dropdown-menu dropdown-menu-right navbar-dropdown"
                aria-labelledby="UserDropdown"
              >
                <div className="dropdown-header text-center">
                  <img
                    className="img-md rounded-circle"
                    src="assets/images/admin.png"
                    alt="Profile image"
                  />
                  
                    <p className="mb-1 mt-3 font-weight-semibold"></p>
                  
                  
                    <p className="font-weight-light text-muted mb-0">
                     {validUserData && validUserData.userName}
                    </p>
                  

                </div>
                {/* <a className="dropdown-item">
                  My Profile <i className="dropdown-item-icon ti-dashboard"></i>
                </a>
                <a className="dropdown-item">
                  Messages<span className="badge badge-pill badge-danger">1</span>
                  <i className="dropdown-item-icon ti-comment-alt"></i>
                </a>
                <a className="dropdown-item">
                  Activity<i className="dropdown-item-icon ti-location-arrow"></i>
                </a>
                <a className="dropdown-item">
                  FAQ<i className="dropdown-item-icon ti-help-alt"></i>
                </a> */}
               <a  className="dropdown-item" onClick={() => {
                                        logoutUser()
                                        handleClose()
                                    }}>
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
      {validUserData && validUserData.userType === "admin" && (
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
        </>
      )}
      <li>
        <Link to="/water" onClick={closeDropdown}>Effluent/Water Dashboard</Link>
      </li>
      <li>
        <Link to="/ambient-air" onClick={closeDropdown}>Ambient Air Dashboard</Link>
      </li>
      <li>
        <Link to="/noise" onClick={closeDropdown}>Noise Dashboard</Link>
      </li>
      <li>
        <Link to="/account" onClick={closeDropdown}>Account</Link>
      </li>
    </ul>
  </div>
)}

        </div>
      </nav>
      {/* <!-- partial --> */}
      <div className="container-fluid page-body-wrapper">
        {/* <!-- partial:partials/_sidebar.html --> */}
        <LeftSideBar />
        {/* <!-- partial --> */}

        <Outlet  />


      </div>
    </div>
  )

};

export default PrivateLayout;
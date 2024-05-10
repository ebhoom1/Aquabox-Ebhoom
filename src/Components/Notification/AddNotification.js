import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import LeftSideBar from "../LeftSideBar/LeftSideBar";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import axios from 'axios';

const AddNotification = () => {
    const [validUserData,setValidUserData] = useState(null);
    const [notificationData,setNotificationData]=useState({
        adminID:"",
         adminName:"",
         dateOfCalibrationAdded: new Date().toISOString().slice(0, 10), // Initialize with current date
         timeOfCalibrationAdded:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) , 
         message:"",
    })
    const url ='http://localhost:4444'
    const handleInputChange = event =>{
        const {name,value} = event.target;
        setNotificationData(prevState =>({
            ...prevState,
            [name]:value
        }));
    }
  const handleSubmit =async(event)=>{
    try {
        event.preventDefault();
        if(notificationData.message === ''){
            toast.warning('Please add the Notification Message',{
                position:"top-center"
            })
        }else{
            let notificationDataToSend ={
                ...notificationData,
                adminID:validUserData.userName,
                adminName:validUserData.fname
            };
            console.log('NotificationDataToSend',notificationDataToSend);
            const res = await axios.post(`${url}/api/add-notificaiton`,notificationDataToSend)

            if(res.status === 201){
                const shouldSave=window.confirm("Are you sure to add this notification?");

                if(shouldSave){
                    setNotificationData({
                        adminID:"",
                        adminName:"",
                        dateOfCalibrationAdded: "",
                        timeOfCalibrationAdded:"",
                        message:"",
                    })
                }
            }
            toast.success("The Notication is sent successfully")
        }
    } catch (error) {
        console.error('Notification send error in catch:',error);
        toast.error('An error Occurred')
    }
  };
  useEffect(()=>{
    const fetchData = async()=>{
        try {
            let token = localStorage.getItem("userdatatoken")
            const res = await axios.get(`${url}/api/validuser`,{
                headers:{
                    'Content-Type':"application/json",
                    'Authorization':token,
                    Accept:'application/json'
                },
                withCredentials:true
            })
            const data= res.data;

            if(data.status === 201){
                setValidUserData(data.validUserOne);

            }else{
                console.log("Error fetching user Data from Notification");
            }
        } catch (error) {
            console.error("Error fetching user Data from Notification:", error);
        }
    }
    fetchData();
  },[])
      return (
        <div className="main-panel">
          <div className="content-wrapper">
            {/* <!-- Page Title Header Starts--> */}
            <div className="row page-title-header">
              <div className="col-12">
                <div className="page-header">
                  <h4 className="page-title">Add Notification Dashboard</h4>
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
              <div className="col-md-12 grid-margin">
                <div className="card">
                  <div className="card-body ">
                        
                       
                  <form >
                    
                        <div className="row">
                         
                            <div className="col-12">
                              <h1>Notification Added by</h1>
                               {/* <h1>Update User</h1> */}
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">User ID</label>
                              <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="Equipment Name" name='userName' value= { validUserData && validUserData.userName}
                              />
                              
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput4">Date of Notification Added</label>
                              <input type="date" 
                              className="form-control" 
                              id="date" 
                              name='date'
                              value={notificationData.dateOfCalibrationAdded}
                              onChange={handleInputChange}
                              placeholder="Date of Notification" 
                             />
                             
                            </div>
                            
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput4">Time of Notification Added</label>
                              <input type="text" 
                              className="form-control" 
                              id="time" 
                              name='time'
                              value={notificationData.timeOfCalibrationAdded}
                              onChange={handleInputChange}
                              placeholder="time of Notification" 
                             />
                              
                            </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                                <label htmlFor="exampleFormControlInput5">User Name</label>
                                <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="User Name" name='fname' value= { validUserData && validUserData.fname}  
                              />
                               
                            </div>
                            
                            <div className="col-12">
                              <h1>Add Notification Details</h1>
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">Add Notification Message</label>
                              <textarea 
                                type="text"
                                className="form-control"
                                id="exampleFormControlInput5"
                                placeholder="Notification Message"
                                name='message'
                                value={notificationData.message}
                                onChange={handleInputChange} 
                              />
                              
                            </div>
  
                            
                           
                           
                            <div className="mt-4 mb-5 p-2">
                              <button type="submit" className="btn btn-primary mb-2" onClick={handleSubmit}   > Add Notication </button>
                            </div>
                            
                              <div className="mt-4 mb-5 p-2">
                              <button type="button"  className="btn btn-danger mb-2"> Cancel </button>
                              </div>
                              
                            
                        </div>
                    </form>
                   <ToastContainer/>
                  </div>
                </div>
              </div>
              
            </div>
  
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
      )
}

export default AddNotification

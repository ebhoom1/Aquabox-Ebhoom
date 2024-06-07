import React, { useState } from 'react'
import { Link,useParams } from 'react-router-dom';
import LeftSideBar from "../LeftSideBar/LeftSideBar";
import { toast,ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import CalibrationData from './Calibration-Data';
import axios from 'axios';



const EditCalibration = () => { 
  const { userName } = useParams();
useEffect(() => {
  console.log('userName:', userName);
}, [userName]);
  const [calibrationData, setCalibrationData] = useState({
    adminID: null,
    adminName: null,
    dateOfCalibrationAdded: new Date().toISOString().slice(0, 10), // Initialize with current date
    timeOfCalibrationAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }), // Initialize with current time
    date: null,
    userName: null,
    equipmentName: null,
    before: null,
    after: null,
    technician: null,
    notes: null,
  });
  const url ='http://localhost:4444'
  useEffect(() => {
    const fetchCalibrationData = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/api/find-calibration-by-userId/${userName}`);
        const calibrationData = response.data.calibration;
        console.log(calibrationData);
        setCalibrationData(calibrationData);
      } catch (error) {
        console.error(`Error in fetching calibration data`, error);
      }
    };
    fetchCalibrationData();
  }, [userName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCalibrationData((prevCalibrationData) => ({
      ...prevCalibrationData,
      [name]: value,
    }));
  };
  const handleSaveCalibration = async (event) => {
    try {
      event.preventDefault();
        // Update dateOfCalibrationAdded and timeOfCalibrationAdded with current date and time
        const currentDate = new Date().toISOString().slice(0, 10);
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        setCalibrationData((prevCalibrationData) => ({
          ...prevCalibrationData,
          dateOfCalibrationAdded: currentDate,
          timeOfCalibrationAdded: currentTime,
        }));
      const res = await axios.patch(`${url}/api/edit-calibration/${userName}`, calibrationData);
      const updateCalibration = res.data.calibration;
      setCalibrationData(updateCalibration);
      console.log("Calibration updated successfully:", updateCalibration);
      toast.success("Calibration Updated Successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error(`Error in Updating Calibration`, error);
      toast.error("Error in Updating Calibration");
    }
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
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body ">
                      
                     
                <form >
                      <div className="row">
                      <div className="col-12">
                            <h1>Calibration Edited by</h1>
                             {/* <h1>Update User</h1> */}
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">User ID</label>
                            <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="Equipment Name" name='userName' value= {calibrationData.adminID}
                            />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Date of Calibration Added</label>
                            <input
                              type="date"
                              className="form-control"
                              id="date"
                              name="dateOfCalibrationAdded"
                              value={calibrationData.dateOfCalibrationAdded}
                              onChange={handleChange}
                              placeholder="Date of Calibration"
                            />
                           
                          </div>
                          
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Time of Calibration Added</label>
                            <input
                              type="text"
                              className="form-control"
                              id="time"
                              name="timeOfCalibrationAdded"
                              value={calibrationData.timeOfCalibrationAdded}
                              onChange={handleChange}
                              placeholder="Time of Calibration"
                            />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">User Name</label>
                              <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="User Name" name='fname' value= { calibrationData.adminName}  
                            />
                             
                          </div>
                          <div className="col-12">
                            <h1>Edit Calibration Details</h1>
                             {/* <h1>Update User</h1> */}
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">User ID</label>
                            <input 
                              type="text"
                               className="form-control" 
                               id="userName"
                               placeholder="Enter User " 
                               name='userName'
                               onChange={handleChange}
                               value={calibrationData.userName}
                              />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Date of Calibration</label>
                            <input type="date" 
                            className="form-control" 
                            id="date" 
                            name='date'
                            onChange={handleChange}
                            value={calibrationData.date}
                            placeholder="Date of Calibration" 
                           />
                            {/* <span className="error">Subscription Date required</span> */}
                          </div>
                          
                         
                          
                          

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">Equipment Name</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="equipmentName"
                            name='equipmentName'
                            onChange={handleChange}
                            value={calibrationData.equipmentName} 
                            placeholder="Equipment Name"
                            />
                         
                          </div>
                          <div className="col-12">
                            <h1>Results</h1>
                             {/* <h1>Update User</h1> */}
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Before</label>
                            <textarea 
                            type="text" 
                            className="form-control" 
                            id="before"
                            name='before' 
                            value={calibrationData.before} 
                            placeholder="Before" 
                            />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">After</label>
                            <textarea 
                            type="text" 
                            className="form-control" 
                            id="after"
                            name='after'
                            onChange={handleChange}
                            value={calibrationData.after} 
                            placeholder="After" 
                            />
                            {/* <span className="error">State required</span>
                            <span className="error">Invalid State name</span>
                            <span className="error">Minimum 3 Characters required</span> */}
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Technician</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="technician"
                            name='technician' 
                            onChange={handleChange}
                            value={calibrationData.technician} 
                            placeholder="Technician Name" 
                            />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Notes</label>
                            <textarea 
                            type="text" 
                            className="form-control" 
                            id="notes"
                            name='notes'
                            onChange={handleChange}
                            value={calibrationData.notes} 
                            placeholder="Notes" 
                            />
                            {/* <span className="error">State required</span>
                            <span className="error">Invalid State name</span>
                            <span className="error">Minimum 3 Characters required</span> */}
                          </div>
                         
                          <div className="mt-4 mb-5 p-2">
                            <button type="submit" className="btn btn-primary mb-2"  onClick={handleSaveCalibration}  > Update Calibration </button>
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


export default EditCalibration;
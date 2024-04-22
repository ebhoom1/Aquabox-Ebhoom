import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import LeftSideBar from "../LeftSideBar/LeftSideBar";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import CalibrationData from './Calibration-Data';
import axios from 'axios';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';


const Calibration = () => { 
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const [timeOfCalibrationAdded, setTimeOfCalibrationAdded] = useState(currentTime);
  const [validUserData, setValidUserData] = useState(null);
  const [calibrationData,setCalibrationData]=useState({
    adminID:"",
    adminName:"",
    dateOfCalibrationAdded: new Date().toISOString().slice(0, 10), // Initialize with current date
    timeOfCalibrationAdded: currentTime, 
    userId:"",
    date:"",
    userName:"",
    fname:"",
    equipmentName:"",
    before:"",
    after:"",
    technician:"",
    notes:"",
  })
  const handleInputChange = event =>{
    const { name, value } = event.target;   
    if(name === 'time'){
      setTimeOfCalibrationAdded(value)
    }else{
      setCalibrationData({
        ...calibrationData,
        [name]:value,
      });
    }
     

  }
  
 
  
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
  
      if (calibrationData.date === '') {
        toast.warning('Please add the date', {
          position: 'top-center'
        });
      } else if (calibrationData.equipmentName === '') {
        toast.warning('Please add the equipment Name', {
          position: 'top-center'
        });
      } else if (calibrationData.before === '') {
        toast.warning('Please add the before', {
          position: 'top-center'
        });
      } else if (calibrationData.after === '') {
        toast.warning('Please add the after', {
          position: 'top-center'
        });
      } else if (calibrationData.technician === '') {
        toast.warning('Please add the technician', {
          position: 'top-center'
        });
      } else  {
         // Include userId, userType, and userName in the calibrationDataToSend object
      let calibrationDataToSend = {
        ...calibrationData,
        adminID: validUserData.userName,
        adminName: validUserData.fname
      };
        const res = await axios.post('http://localhost:4444/api/add-calibration', calibrationDataToSend);
        
        if (res.status === 201) {
          const shouldSaveIt = window.confirm("Are you Sure to add the Calibration?");
          if (shouldSaveIt) {
            setCalibrationData({
              adminID:"",
              adminName:"",
              dateOfCalibrationAdded:"",
              timeOfCalibrationAdded:"",
              userId: "",
              date: "",
              userName: "",
              fname:"",
              equipmentName: "",
              before: "",
              after: "",
              technician: "",
              notes: "",
            });
          }
        }
        toast.success('The Calibration is added Successfully', {
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.', {
        position: 'top-center'
      });
    }
  };
  
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
                            <h1>Calibration Added by</h1>
                             {/* <h1>Update User</h1> */}
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">User ID</label>
                            <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="Equipment Name" name='userName' value= { validUserData && validUserData.userName}
                            />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Date of Calibration Added</label>
                            <input type="date" 
                            className="form-control" 
                            id="date" 
                            name='date'
                            value={calibrationData.dateOfCalibrationAdded}
                            onChange={handleInputChange}
                            placeholder="Date of Calibration" 
                           />
                           
                          </div>
                          
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Time of Calibration Added</label>
                            <input type="text" 
                            className="form-control" 
                            id="time" 
                            name='time'
                            value={timeOfCalibrationAdded}
                            onChange={handleInputChange}
                            placeholder="time of Calibration" 
                           />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">User Name</label>
                              <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="User Name" name='fname' value= { validUserData && validUserData.fname}  
                            />
                             
                          </div>
                          
                          <div className="col-12">
                            <h1>Add Calibration Details</h1>
                             {/* <h1>Update User</h1> */}
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">User ID</label>
                            <input type="text" className="form-control" id="exampleFormControlInput5" placeholder="User ID" name='userName' value= {CalibrationData.userName}  onChange={handleInputChange}
                            />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Date of Calibration</label>
                            <input type="date" 
                            className="form-control" 
                            id="date" 
                            name='date'
                            value={calibrationData.date}
                            onChange={handleInputChange}
                            placeholder="Date of Calibration" 
                           />
                            {/* <span className="error">Subscription Date required</span> */}
                          </div>
                          
                          

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">Model Name</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="ModelName"
                            name='equipmentName'
                            value={calibrationData.equipmentName}
                            onChange={handleInputChange} 
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
                            onChange={handleInputChange}
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
                            value={calibrationData.after}
                            onChange={handleInputChange} 
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
                            value={calibrationData.technician}
                            onChange={handleInputChange}
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
                            value={calibrationData.notes}
                            onChange={handleInputChange} 
                            placeholder="Notes" 
                            />
                            {/* <span className="error">State required</span>
                            <span className="error">Invalid State name</span>
                            <span className="error">Minimum 3 Characters required</span> */}
                          </div>
                         
                          <div className="mt-4 mb-5 p-2">
                            <button type="submit" className="btn btn-primary mb-2"  onClick={handleSubmit}  > Add Calibration </button>
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


export default Calibration;
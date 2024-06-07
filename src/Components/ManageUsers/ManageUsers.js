import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import LeftSideBar from "../LeftSideBar/LeftSideBar";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { DatePicker } from 'rsuite';



const AddUsers = () => { 
  const industryType=[
    {
      category:"Select"
    },
    {
      category:"Sugar"
    },
    {
      category:"Cement"
    },
    {
      category:"Distillery"
    },
    {
      category:"Petrochemical"
    },
    {
      category:"Plup & Paper"
    },
    {
      category:"Fertilizer"
    },
    {
      category:"Tannery"
    },
    {
      category:"Pecticides"
    },
    {
      category:"Thermal Power Station"
    },
    {
      category:"Caustic Soda"
    },
    {
      category:"Pharmaceuticals"
    },
    {
      category:"Dye and Dye Stuff"
    },
    {
      category:"Refinery"
    },
    {
      category:"Copper Smelter"
    },
    {
      category:"Iron and Steel"
    },
    {
      category:"Zinc Smelter"
    },
    {
      category:"Aluminium"
    },
    {
      category:"STP/ETP"
    },
    {
      category:"NWMS/SWMS"
    },
    {
      category:"Noise"
    },
    {
      category:"Zinc Smelter"
    },
    {
      category:"Other"
    },
    {
      category:"Admin"
    },
  
  ]
const [formData, setFormData]=useState({
  userName:"",
  companyName:"",
  modelName:"",
  fname:"",
  email:"",
  mobileNumber:"",
  password:"",
  cpassword:"",
  subscriptionDate:"",
  userType:"",
  industryType:"",
  dataInteval:"",
  district:"",
  state:"",
  address:"",
  latitude:"",
  longitude:"",
  deviceCredentials:{
    host:"",
    clientId:"",
    key:"",
    cert:"",
    ca:"",
  }
  
})
const deployed_url = 'https://aquabox-ebhoom-3.onrender.com'
const url ='http://localhost:4444'


const handleInputChange = event =>{
  const{name,value}=event.target;
  setFormData({
    ...formData,
    [name]:value,
  });
}
const handleSubmit = async (event) => {
  event.preventDefault();
  
  const formDataToSend = new FormData();
  for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
          if (key === 'deviceCredentials') {
              formDataToSend.append('key', formData.deviceCredentials.key);
              formDataToSend.append('cert', formData.deviceCredentials.cert);
              formDataToSend.append('ca', formData.deviceCredentials.ca);
          } else {
              formDataToSend.append(key, formData[key]);
          }
      }
  }

  try {
      const response = await axios.post(`${url}/api/register`, formDataToSend, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });

      if (response.status === 201) {
          const shouldSave = window.confirm("Are you Sure to Save the user");
          if (shouldSave) {
              console.log(`Data submitted successfully`);
              setFormData({
                  date: new Date().toLocaleDateString(),
                  userName: "",
                  companyName: "",
                  modelName: "",
                  fname: "",
                  email: "",
                  mobileNumber: "",
                  password: "",
                  cpassword: "",
                  subscriptionDate: "",
                  userType: "",
                  industryType: "",
                  dataInteval: "",
                  district: "",
                  state: "",
                  address: "",
                  latitude: "",
                  longitude: "",
                  deviceCredentials: {
                      host: "",
                      clientId: "",
                      key: "",
                      cert: "",
                      ca: "",
                  }
              });
          }
          toast.success('The User is added Successfully', {
              position: 'top-center'
          });
      }
  } catch (error) {
      console.log(error);
      toast.error('Error In Occured Please try again', {
          position: 'top-center'
      });
  }
};


   
    return (
      <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body">
                      
                      
                <form >
                      <div className="row">
                          <div className="col-12">
                            <h1>Add User</h1>
                            
                          </div>
                          

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput1">user ID</label>
                            <input 
                             type="text"
                             className="form-control" 
                             id="userName" 
                             name='userName'
                             value={formData.userName}
                             onChange={handleInputChange}
                             placeholder="Enter User Id"

                            />
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput2">Company Name</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="companyName" 
                            name='companyName'
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Enter Company Name"
                            
                            />
                           
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">First Name</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="fname"
                            name='fname'
                            value={formData.fname}
                            onChange={handleInputChange} 
                            placeholder="Enter First Name"
                           />
                           
                          </div>

                        

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Email</label>
                            <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                            />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Mobile Number</label>
                            <input 
                            type="number" 
                            className="form-control" 
                            id="mobileNumber" 
                            name='mobileNumber'
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            placeholder="Enter mobile Number"
                            />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Model Name</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="modelName" 
                            name='modelName'
                            value={formData.modelName}
                            onChange={handleInputChange}
                            placeholder="Enter Model Name"
                            />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            id="password"
                            name='password'
                            value={formData.pasword}
                            onChange={handleInputChange}
                            placeholder="Enter Password"
                           />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput3">Confirm Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            id="cpassword"
                            name='cpassword'
                            value={formData.cpassword}
                            onChange={handleInputChange}
                            placeholder="Enter Password"
                           />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput4">Date of Subscription</label>
                            <input 
                            type="date" 
                            className="form-control" 
                            id="subscriptionDate"
                            name='subscriptionDate'
                            value={formData.subscriptionDate}
                            onChange={handleInputChange} 
                            placeholder="Enter Subscription date" 
                           />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">User Type</label>
                              <select 
                              className="input-field" 
                              id='userType'
                              name='userType'
                              value={formData.userType}
                              onChange={handleInputChange}

                              >
                              
                              <option value="select">Select</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>


                              </select>
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">Industry Type</label>
                              
                                <select 
                                className="input-field" 
                                id='industryType'
                                name='industryType'
                                value={formData.industryType}
                                onChange={handleInputChange}
                                >

                                {industryType.map((item)=>(
                                <option value={item.category}>{item.category}</option>
                                ))}
                              </select>
                             
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">Data Interval </label>
                              <select 
                              className="input-field"
                              id='dataInteval'
                              name='dataInteval'
                              value={formData.dataInteval}
                              onChange={handleInputChange} >
                               
                              <option value="select">Select</option>
                              <option value="sec">15 sec</option>
                                <option value="Min">Less than 1 min</option>
                                <option value="fifteenMin">Less than 15 min</option>
                                <option value="thirtyMin">Less than 30 min</option>


                              </select>
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput5">District</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="district" 
                            name='district'
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder="Enter District"
                            />
                            
                          </div>

                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">State</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="state"
                            name='state'
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="Enter State" 
                            />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Address</label>
                            <textarea 
                            type="text" 
                            className="form-control" 
                            id="address"
                            name='address'
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter Address" 
                            />
                           
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Latitude</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="latitude"
                            name='latitude'
                            value={formData.latitude}
                            onChange={handleInputChange} 
                            placeholder="Enter Latitude" 
                            />
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Longitude</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="longitude" 
                            name='longitude'
                            value={formData.longitude}
                            onChange={handleInputChange}
                            placeholder="Enter longitude" 
                            />
                          
                          </div>
                          
                          
                          <div className="col-12">
                            <h1>Add Device Configurations</h1>
                            
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Client ID</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="clientId" 
                            name='clientId'
                            value={formData.clientId}
                            onChange={handleInputChange}
                            placeholder="Enter clientId" 
                            />
                          
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Host </label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="host" 
                            name='host'
                            value={formData.host}
                            onChange={handleInputChange}
                            placeholder="Enter host" 
                            />
                          
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Key</label>
                            <input 
                            type="file" 
                            className="form-control" 
                            id="key" 
                            name='key'
                            value={formData.key}
                            onChange={(e) => setFormData({ ...formData, deviceCredentials: { ...formData.deviceCredentials, key: e.target.files[0] } })}
                          
                            />
                          
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">Certificate</label>
                            <input 
                            type="file" 
                            className="form-control" 
                            id="cert" 
                            name='cert'
                            value={formData.cert}
                            onChange={(e) => setFormData({ ...formData, deviceCredentials: { ...formData.deviceCredentials, cert: e.target.files[0] } })}
                            
                            />
                          
                          </div>
                          <div className="col-12 col-lg-6 col-md-6 mb-3">
                            <label htmlFor="exampleFormControlInput6">CA</label>
                            <input 
                            type="file" 
                            className="form-control" 
                            id="ca" 
                            name='ca'
                            value={formData.ca}
                            onChange={(e) => setFormData({ ...formData, deviceCredentials: { ...formData.deviceCredentials, ca: e.target.files[0] } })}
                            />
                          
                          </div>
                          
                          
                          <div className="mt-4 mb-5 p-2">
                            <button 
                            type="submit" 
                            onClick={handleSubmit}      
                            className="btn btn-primary mb-2">
                               Add User 
                            </button>
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
    )
  
}

const DeleteUsers = () => { 

const [userName,setUserName]=useState('');
const url ='http://localhost:4444'
const deployed_url = 'https://aquabox-ebhoom-3.onrender.com'

const handleSubmit =async(e)=>{
  e.preventDefault();

  if(!userName){
    return toast.warning('Please Enter the user ID',{
      position:'top-center'
    })
  }
  try {
    const response = await axios.delete(`${deployed_url}/api/deleteuser/${userName}`)
    console.log(response.data);
    toast.success('user deleted Successfully',{
      position:'top-center'
    })
  } catch (error) {
    console.error(`Error deleting user:`,error);
    toast.error('Error in Deleting User /  User ID not found',{
      position:'top-center'
    })
  }
}

    return (
      <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card">
                <div className="card-body">
                <form >
                    <div className="row">
                        <div className="col-12">
                          <h1>Delete User</h1>
                        </div>
                        <div className="col-12 col-lg-6 col-md-6 mb-3">
                          <label htmlFor="exampleFormControlInput7">user ID</label>
                          <input type="text" 
                          className="form-control"
                          id="exampleFormControlInput7"
                          placeholder="Enter user ID" 
                          value={userName}
                          onChange={(e)=>setUserName(e.target.value)}
                          />
                        </div>
                        <div className="col-12  mb-3">
                          <button type="submit" className="btn btn-danger mb-2"onClick={handleSubmit}>Delete User</button>
                        </div>
                      </div>
                  </form>

                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
    )
}
const EditUser =()=>{
  const [users,setUsers]=useState([]);
  const url ='http://localhost:4444'

  useEffect(()=>{
    const fetchUsers = async () => {
        try {
          const response = await axios.get(`${url}/api/getallusers`);
          const userData = response.data.users;
          console.log(userData);
          setUsers(userData)
        } catch (error) {
          console.error(`Error in fetching users`, error);
        }
    };
    fetchUsers()
  },[])
  return(
    <div className="row">
    <div className="col-12">
    <h1>Edit Active Users </h1>
  </div>
  <div className="col-12  mb-3">
    <ul className="list-group">
    {users.map(user => (  
    <li key={user._id} className="list-group-item">{user.fname}
          <div className="FloatRight">
          <Link to={`/edit-user/${user._id}`}><button className="btn btn-primary m-3">Edit</button></Link>
          
          </div>
        </li>
         ))}
    </ul>
  </div>
</div>
  )
}
const ManageUsers = () => { 

    return (
      <div className="main-panel">
        <div className="content-wrapper">
          {/* <!-- Page Title Header Starts--> */}
          <div className="row page-title-header">
            <div className="col-12">
              <div className="page-header">
                <h4 className="page-title">Control and Monitor Dashboard</h4>
                <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                 
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

          <AddUsers/>
          <DeleteUsers/>
          <EditUser/>

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


export default ManageUsers;
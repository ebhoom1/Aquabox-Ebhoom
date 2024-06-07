import React, { useState, useEffect } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import { fetchUserById,updateUser } from '../../redux/features/userLog/userLogSlice';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUsers = ()=>{

    const { userId } = useParams();
    const navigate =useNavigate();
    const dispatch = useDispatch();
    const {selectedUser, loading, error} = useSelector((state)=>state.userLog);

    const [userData, setUserData]=useState({
        userName:null,
        companyName:null,
        modelName:null,
        fname:null,
        email:null,
        mobileNumber:null,
        password:null,
        cpassword:null,
        subscriptionDate:null,
        userType:null,
        industryType:null,
        dataInteval:null,
        district:null,
        state:null,
        address:null,
        latitude:null,
        longitude:null,
        deviceCredentials:{
          host:null,
          clientId:null,
          key:null,
          cert:null,
          ca:null,
        }
    });
 
    useEffect(() => {
        dispatch(fetchUserById(userId))
      }, [dispatch,userId]);

    useEffect(()=>{
      if(selectedUser){
        setUserData(selectedUser);
      }
    },[selectedUser]);

      const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevUserData => ({
            ...prevUserData,
            [name]: value
        }));
    };
     const handleSaveUser = async (event)=>{
      event.preventDefault();
        try {
           await dispatch(updateUser({userId,userData})).unwrap
            toast.success("User updated successfully");
            navigate("/manage-users");
        } catch (error) {
            console.error(`Error in updating user`, error);
            toast.error("Error updating user");
        }
     }
     if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }
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
          <div className="row">
              <div className="col-md-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                        
                        
                  <form >
                        <div className="row">
                            <div className="col-12">
                              <h1>Edit User Details</h1>
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput1">User ID</label>
                              <input 
                              type="text"
                               className="form-control" 
                               id="userName"
                               placeholder="Enter User " 
                               name='userName'
                               onChange={handleChange}
                               value={userData.userName}
                              />
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput2">Company Name</label>
                              <input type="text"
                               className="form-control"
                               id="exampleFormControlInput2" 
                               placeholder="Enter Company Name" 
                               name='companyName'
                               onChange={handleChange}
                               value={userData.companyName}
                              />
                             
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput3">First Name</label>
                              <input type="text"
                               className="form-control"
                               id="exampleFormControlInput3" 
                               placeholder="Enter First Name" 
                               name='fname'
                               onChange={handleChange}
                               value={userData.fname}
                             />
                             
                            </div>
  
                          
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput3">Email</label>
                              <input type="email" 
                              className="form-control" 
                              id="exampleFormControlInput3" 
                              placeholder="Enter Email" 
                              name='email'
                              onChange={handleChange}
                              value={userData.email}
                              />
                              
                            </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput3">Mobile Number</label>
                              <input type="number" 
                              className="form-control" 
                              id="mobileNumber" 
                              name='mobileNumber'
                              onChange={handleChange}
                              value={userData.mobileNumber}
                              />
                              
                            </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput3">Model Name</label>
                              <input type="text" 
                              className="form-control" 
                              id="modelName" 
                              placeholder="Enter ModelName" 
                              name='modelName'
                              onChange={handleChange}
                              value={userData.modelName}
                              />
                              
                            </div>
                          
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput4">Date of Subscription</label>
                              <input type="date"
                               className="form-control"
                                id="exampleFormControlInput4"
                                 placeholder="Enter Subscription date"
                                 name='cpassword'
                                 onChange={handleChange}
                                 value={userData.subscriptionDate}
                             />
                              
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                                <label htmlFor="exampleFormControlInput5">User Type</label>
                          
                                <input type="text"
                                className="form-control"
                                id="exampleFormControlInput4"
                                placeholder=""
                                name='userType'
                                onChange={handleChange}
                                value={userData.userType}
                             />
                            </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                                <label htmlFor="exampleFormControlInput5">Industry Type</label>
                          
                                <select
                        className="input-field"
                        id='industryType'
                        name='industryType'
                        value={userData.industryType}
                        onChange={handleChange}
                      >
                        <option value="select">Select</option>
                        <option value="Sugar">Sugar</option>
                        <option value="Cement">Cement</option>
                        <option value="Distillery">Distillery</option>
                        <option value="Petrochemical">Petrochemical</option>
                        <option value="Plup & Paper">Plup & Paper</option>
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Tannery">Tannery</option>
                        <option value="Pecticides">Pecticides</option>
                        <option value="Thermal Power Station">Thermal Power Station</option>
                        <option value="Caustic Soda">Caustic Soda</option>
                        <option value="Pharmaceuticals">Pharmaceuticals</option>
                        <option value="Dye and Dye Stuff">Dye and Dye Stuff</option>
                        <option value="Refinery">Refinery</option>
                        <option value="Copper Smelter">Copper Smelter</option>
                        <option value="Iron and Steel">Iron and Steel</option>
                        <option value="Zinc Smelter">Zinc Smelter</option>
                        <option value="Aluminium">Aluminium</option>
                        <option value="STP/ETP">STP/ETP</option>
                        <option value="NWMS/SWMS">NWMS/SWMS</option>
                        <option value="Noise">Noise</option>
                        <option value="Other">Other</option>
                        <option value="Admin">Admin</option>
                      </select>
                              </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                                <label htmlFor="exampleFormControlInput5">Data Interval </label>
                                <select
                        className="input-field"
                        id='dataInteval'
                        name='dataInteval'
                        value={userData.dataInteval}
                        onChange={handleChange}
                      >
                        <option value="select">Select</option>
                        <option value="sec">15 sec</option>
                        <option value="Min">Less than 1 min</option>
                        <option value="fifteenMin">Less than 15 min</option>
                        <option value="thirtyMin">Less than 30 min</option>
                      </select>
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput5">District</label>
                              <input type="text"
                               className="form-control"
                                id="district" 
                                placeholder="Enter District"
                                name='district'
                                onChange={handleChange}
                                value={userData.district}
                              />
                              
                            </div>
  
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput6">State</label>
                              <input type="text"
                               className="form-control"
                               id="state"
                                placeholder="Enter State"
                                name='state'
                                onChange={handleChange}
                                value={userData.state}
                              />
                             
                            </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput6">Address</label>
                              <textarea
                              type="text"
                              className="form-control"
                              id="address" 
                              placeholder="Enter Address"
                              name='address'
                              onChange={handleChange}
                              value={userData.address}
                              />
                             
                            </div>
                         
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput6">Latitude</label>
                              <input 
                              type="text" 
                              className="form-control" 
                              id="latitude" 
                              placeholder="Enter Latitude" 
                              name='latitude'
                              onChange={handleChange}
                              value={userData.latitude}
                              />
                              
                            </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                              <label htmlFor="exampleFormControlInput6">Longitude</label>
                              <input 
                              type="text"
                              className="form-control"
                              id="longitude" 
                              placeholder="Enter  longitude"
                              name='longitude'
                              onChange={handleChange}
                              value={userData.longitude}
                              />
                            
                            </div>
                            <div className="col-12">
                            <h1>Update Device Configurations</h1>
                            
                          </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="clientId">Client ID</label>
                      <input
                        type="text"
                        className="form-control"
                        id="clientId"
                        placeholder="Enter clientId"
                        name='clientId'
                        onChange={handleChange}
                        value={userData.deviceCredentials.clientId}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="host">Host</label>
                      <input
                        type="text"
                        className="form-control"
                        id="host"
                        placeholder="Enter host"
                        name='host'
                        onChange={handleChange}
                        value={userData.deviceCredentials.host}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="key">Key</label>
                      <input
                        type="file"
                        className="form-control"
                        id="key"
                        name='key'
                        onChange={(e) => setUserData({ ...userData, deviceCredentials: { ...userData.deviceCredentials, key: e.target.files[0] } })}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="cert">Certificate</label>
                      <input
                        type="file"
                        className="form-control"
                        id="cert"
                        name='cert'
                        onChange={(e) => setUserData({ ...userData, deviceCredentials: { ...userData.deviceCredentials, cert: e.target.files[0] } })}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="ca">CA</label>
                      <input
                        type="file"
                        className="form-control"
                        id="ca"
                        name='ca'
                        onChange={(e) => setUserData({ ...userData, deviceCredentials: { ...userData.deviceCredentials, ca: e.target.files[0] } })}
                      />
                    </div>
                            <div className="mt-4 mb-5 p-2">
                           <button type="submit" className="btn btn-primary mb-2" onClick={handleSaveUser}>Update  User </button>
                            
                            </div>
                            
                              <div className="mt-4 mb-5 p-2">
                              <Link to='/manage-users'><button type="button"  className="btn btn-danger mb-2"> Cancel </button></Link>
                              </div>
                              
                            
                        </div>
                    </form>
                    <ToastContainer />

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

  

export default EditUsers
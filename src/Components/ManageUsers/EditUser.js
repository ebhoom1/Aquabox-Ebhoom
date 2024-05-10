import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';


const EditUsers = ()=>{

    const { userId } = useParams();

    const [userData, setUserData]=useState({
        userName:null,
        companyName:null,
        modelName:null,
        fname:null,
        email:null,
        password:null,
        cpassword:null,
        subscriptionDate:null,
        userType:null,
        industryType:null,
        dataInteval:null,
        district:null,
        state:null,
        address:null,
        longtitude:null,
        latitude:null
    });
    const url ='http://localhost:4444'
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get(`${url}/api/getAuser/${userId}`);
            const userData = response.data.user;
            console.log(userData);
            // Set your state with userData...
            setUserData(userData);
          } catch (error) {
            console.error(`Error in fetching user data`, error);
          }
        };
        fetchUser();
      }, [userId]);
      const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevUserData => ({
            ...prevUserData,
            [name]: value
        }));
    };
     const handleSaveUser = async (event)=>{
     
        try {
            event.preventDefault();
            const response = await axios.patch(`${url}/api/editUser/${userId}`, userData)
            const updatedUser = response.data.user;
            setUserData(updatedUser)
            console.log("User updated successfully:", updatedUser);
            toast.success("User updated successfully");
        } catch (error) {
            console.error(`Error in updating user`, error);
            toast.error("Error updating user");
        }
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
                          
                                <input type="text"
                                 className="form-control"
                                id="exampleFormControlInput4"
                                placeholder=""
                                name='industryType'
                                onChange={handleChange}
                                value={userData.industryType}
                             />
                              </div>
                            <div className="col-12 col-lg-6 col-md-6 mb-3">
                                <label htmlFor="exampleFormControlInput5">Data Interval </label>
                                <input type="text"
                                 className="form-control"
                                 id="dataInteval"
                                 placeholder=""
                                 name='dataInteval'
                                 onChange={handleChange}
                                 value={userData.dataInteval}/>

                                {/* <select className="input-field"  >
                                 
                               
  
                                </select> */}
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
                              <label htmlFor="exampleFormControlInput6">Longtitude</label>
                              <input 
                              type="text"
                              className="form-control"
                              id="longtitude" 
                              placeholder="Enter Longtitude"
                              name='longtitude'
                              onChange={handleChange}
                              value={userData.longtitude}
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
  
                            <div className="mt-4 mb-5 p-2">
                           <button type="submit" className="btn btn-primary mb-2" onClick={handleSaveUser}>Update  User </button>
                            
                            </div>
                            
                              <div className="mt-4 mb-5 p-2">
                              <Link to='/users-log'><button type="button"  className="btn btn-danger mb-2"> Cancel </button></Link>
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
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateUser } from '../../redux/features/userLog/userLogSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../utils/apiConfig';

const EditUsers = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector((state) => state.userLog);

  const [userData, setUserData] = useState({
    userName: '',
    companyName: '',
    modelName: '',
    fname: '',
    email: '',
    mobileNumber: '',
    password: '',
    cpassword: '',
    subscriptionDate: '',
    userType: '',
    industryType: '',
    dataInteval: '',
    district: '',
    state: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (selectedUser) {
      setUserData(selectedUser);
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${API_URL}/api/edituser/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('User updated successfully!');
        console.log('Response after edit:', response.data.user);
        setTimeout(() => {
          navigate("/manage-users");
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };

  const handleCancel = async () => {
    setTimeout(() => {
      navigate("/manage-users");
    }, 500);
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
                    <a href="#">Option 2</a>
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
                <form>
                  <div className="row">
                    <div className="col-12">
                      <h1>Edit User Details</h1>
                    </div>

                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="userName">User ID</label>
                      <input
                        type="text"
                        className="input-field"
                        id="userName"
                        placeholder="Enter User "
                        name='userName'
                        onChange={handleChange}
                        value={userData.userName || ''}
                      />
                    </div>

                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="companyName">Company Name</label>
                      <input
                        type="text"
                        className="input-field"
                        id="companyName"
                        placeholder="Enter Company Name"
                        name='companyName'
                        onChange={handleChange}
                        value={userData.companyName || ''}
                      />
                    </div>

                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="fname">First Name</label>
                      <input
                        type="text"
                        className="input-field"
                        id="fname"
                        placeholder="Enter First Name"
                        name='fname'
                        onChange={handleChange}
                        value={userData.fname || ''}
                      />
                    </div>

                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="input-field"
                        id="email"
                        placeholder="Enter Email"
                        name='email'
                        onChange={handleChange}
                        value={userData.email || ''}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="mobileNumber">Mobile Number</label>
                      <input
                        type="number"
                        className="input-field"
                        id="mobileNumber"
                        name='mobileNumber'
                        onChange={handleChange}
                        value={userData.mobileNumber || ''}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="modelName">Model Name</label>
                      <input
                        type="text"
                        className="input-field"
                        id="modelName"
                        placeholder="Enter ModelName"
                        name='modelName'
                        onChange={handleChange}
                        value={userData.modelName || ''}
                      />
                    </div>

                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="subscriptionDate">Date of Subscription</label>
                      <input
                        type="date"
                        className="input-field"
                        id="subscriptionDate"
                        name='subscriptionDate'
                        onChange={handleChange}
                        value={userData.subscriptionDate || ''}
                      />
                    </div>

                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="userType">User Type</label>
                      <input
                        type="text"
                        className="input-field"
                        id="userType"
                        name='userType'
                        onChange={handleChange}
                        value={userData.userType || ''}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="industryType">Industry Type</label>
                      <select
                        className="input-field"
                        id='industryType'
                        name='industryType'
                        value={userData.industryType || 'select'}
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
                      <label htmlFor="dataInteval">Data Interval </label>
                      <select
                        className="input-field"
                        id='dataInteval'
                        name='dataInteval'
                        value={userData.dataInteval || 'select'}
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
                      <label htmlFor="district">District</label>
                      <input
                        type="text"
                        className="input-field"
                        id="district"
                        placeholder="Enter District"
                        name='district'
                        onChange={handleChange}
                        value={userData.district || ''}
                      />
                    </div>

                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        className="input-field"
                        id="state"
                        placeholder="Enter State"
                        name='state'
                        onChange={handleChange}
                        value={userData.state || ''}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="address">Address</label>
                      <textarea
                        type="text"
                        className="input-field"
                        id="address"
                        placeholder="Enter Address"
                        name='address'
                        onChange={handleChange}
                        value={userData.address || ''}
                      />
                    </div>

                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="latitude">Latitude</label>
                      <input
                        type="text"
                        className="input-field"
                        id="latitude"
                        placeholder="Enter Latitude"
                        name='latitude'
                        onChange={handleChange}
                        value={userData.latitude || ''}
                      />
                    </div>
                    <div className="col-12 col-lg-6 col-md-6 mb-3">
                      <label htmlFor="longitude">Longitude</label>
                      <input
                        type="text"
                        className="input-field"
                        id="longitude"
                        placeholder="Enter Longitude"
                        name='longitude'
                        onChange={handleChange}
                        value={userData.longitude || ''}
                      />
                    </div>

                    <div className="mt-4 mb-5 p-2">
                      <button type="submit" className="btn btn-primary mb-2" onClick={handleSaveUser}>Update User</button>
                    </div>

                    <div className="mt-4 mb-5 p-2">
                    <button type="button" className="btn btn-danger mb-2" onClick={handleCancel}> Cancel </button>
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

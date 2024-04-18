import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const CalibrationData = () => {
  // Sample previous calibration data, replace with your actual data
  const previousCalibrations = [
    { date: "2022-01-01", userType: "Ambient Air", userNumber: "User 1", equipmentName: "Equipment 1", before: "Data before calibration", after: "Data after calibration", technician: "Technician 1", notes: "Notes 1" },
    { date: "2022-02-01", userType: "Effluent/Water", userNumber: "User 2", equipmentName: "Equipment 2", before: "Data before calibration", after: "Data after calibration", technician: "Technician 2", notes: "Notes 2" },
    // Add more previous calibration data as needed
  ];
  const [userCalibrations,setUserCalibrations]=useState(null)
  useEffect(()=>{
    const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:4444/api/view-all-calibrations');
          const userData = response.data.calibrations;
          console.log(userData);
          setUserCalibrations(userData)
        } catch (error) {
          console.error(`Error in fetching users`, error);
        }
    };
    fetchUsers()
  },[])
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        {/* <!-- Page Title Header Starts--> */}
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Calibration  DASHBOARD</h4>
              <p></p>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
               
               <ul className="quick-links ml-auto">
                <h5>Data Interval:</h5>

               </ul>
               
             </div>
            </div>
          </div>
        </div>
    <div className="row mt-5">
      <div className="col-12 col-md-4 grid-margin">
            <Link to='/calibration-new'>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <h3 className="mb-3">Add New Calibration</h3>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            </div>
      <div className="col-md-12">
        <h2>Previous Calibration Data</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date of Calibration</th>
                <th>User Type</th>
                <th>User Name</th>
                <th>Equipment Name</th>
                <th>Before</th>
                <th>After</th>
                <th>Technician</th>
                <th>Notes</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {userCalibrations && userCalibrations.map((calibration, index) => (
                <tr key={index}>
                  <td>{calibration.date}</td>
                  <td>{calibration.userType}</td>
                  <td>{calibration.userName}</td>
                  <td>{calibration.equipmentName}</td>
                  <td>{calibration.before}</td>
                  <td>{calibration.after}</td>
                  <td>{calibration.technician}</td>
                  <td>{calibration.notes}</td>
                 <Link to={`/edit-calibration/${calibration._id}`}> <td> <button type="button"  className="btn btn-primary mb-2"> Edit </button></td></Link>
                  <td> <button type="button"  className="btn btn-danger mb-2"> Delete </button></td>

                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default CalibrationData;

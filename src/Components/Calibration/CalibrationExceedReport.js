import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const CalibrationExceededReport = () => {
    const location = useLocation();
    const { date } = location.state || {};
    const navigate = useNavigate();
    const handleVerified = () => {
      toast.success(`${date} calibration exceed approved`);
    };
  
    const handleDenied = () => {
      toast.error(`${date} calibration exceed denied`);
      navigate("/users-log");
    };
  return (
   
    <div className="card">
      <div className="card-body">
      <div className="row mt-5">
<div className="col-md-12">
<h2>Calibration Exceeded Data's</h2>

<div className="table-responsive">
<table className="table table-bordered">
  <thead>
    <tr>
      <th>SI.No</th>
      <th>Exceeded Parameter</th>
      <th>Date</th>
      <th>Time</th>
      <th>User Remark Comment</th>
      <th>Admin Remark Comment</th>
      
      
    </tr>
  </thead>
  <tbody>
    <td>1</td>
    <td>ph 2.1</td>
    <td>31/03/2024</td>
    <td>07:17</td>
    <td>Comment from user</td>
    <td>Comment from admin</td>
      
      
    
  </tbody>
</table>
</div>
<button className="btn btn-success mt-3" onClick={handleVerified}>
              Verified
            </button>
            <button className="btn btn-danger mt-3 ms-2" onClick={handleDenied}>
              Denied
            </button>
            <ToastContainer/>
</div>
</div>
      </div>
      </div>
    
  )
}

export default CalibrationExceededReport

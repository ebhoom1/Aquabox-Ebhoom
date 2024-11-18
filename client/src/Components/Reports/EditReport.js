import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/apiConfig';
import { ToastContainer, toast } from 'react-toastify'

const EditReport = () => {
    const { userName } = useParams();
    const [report, setReport] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReport = async () => {
          try {
            const response = await axios.get(`${API_URL}/api/get-a-report/${userName}`);
            setReport(response.data.reports[0]); // Assuming the response contains an array of reports
          } catch (error) {
            console.error('Error fetching report:', error);
          }
        };
    
        fetchReport();
      }, [userName]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setReport({ ...report, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.patch(`${API_URL}/api/edit-report/${userName}`, report);
          toast.success('successfully edit the report')
          
          setTimeout(()=>{navigate('/report')},1000)
          
        } catch (error) {
            toast.error(`Error in edit from ${error}`)
          console.error('Error updating report:', error);
        }
      };
    
      if (!report) {
        return <div>Loading...</div>;
      }
    
  return (
    <div className="main-panel">
    <div className="content-wrapper">
      <div className="row page-title-header">
        <div className="col-12">
          <div className="page-header">
            <h4 className="page-title">Report  Dashboard</h4>
            <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
              <ul className="quick-links ml-auto">
                <li><a href="#">Settings</a></li>
                <li><a href="#">Option 1</a></li>
                <li><a href="#">Option 2</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row mt-5">
          
    <div className="col-12 col-md-12 grid-margin">
      <div className="col-12">
        <h1>Edit Report for {userName}</h1>
      </div>
      <div className="card">
        <div className="card-body">
        <form  onSubmit={handleSubmit}> 
              <div className="mb-3">
                <label htmlFor="fromDate" className="form-label">From Date</label>
                <input type="text" className="form-control" id="fromDate" name="fromDate" value={report.fromDate} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="toDate" className="form-label">To Date</label>
                <input type="text" className="form-control" id="toDate" name="toDate" value={report.toDate} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">Company Name</label>
                <input type="text" className="form-control" id="companyName" name="companyName" value={report.companyName} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="industryType" className="form-label">Industry Type</label>
                <input type="text" className="form-control" id="industryType" name="industryType" value={report.industryType} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="engineerName" className="form-label">Engineer Name</label>
                <input type="text" className="form-control" id="engineerName" name="engineerName" value={report.engineerName} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="reportApproved" className="form-label">Verified/Declined</label>
                <select className="form-control" id="reportApproved" name="reportApproved" value={report.reportApproved} onChange={handleChange}>
                  <option value={true}>Verified</option>
                  <option value={false}>Declined</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
            <ToastContainer/>
        </div>
      </div>
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
          © <a href="" target="_blank">Ebhoom Solutions LLP</a> 2022
        </span>
      </div>
    </footer>
  </div>
  )
  
}

export default EditReport

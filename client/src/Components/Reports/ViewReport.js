import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../utils/apiConfig';

const ViewReport = () => {
  const { userName } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true); // To manage the loading state
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/get-a-report/${userName}`);
        if (response.data.reports && response.data.reports.length > 0) {
          setReport(response.data.reports[0]);
        } else {
          setErrorMessage('No report generated for this user.');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setErrorMessage('An error occurred while fetching the report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Report Dashboard</h4>
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
              <div className="col-md-12">
                <h2>Report Details for {userName}</h2>
                <div className="mb-5 mt-3">
                  <p><strong>From Date:</strong> {report.fromDate}</p>
                  <p><strong>To Date:</strong> {report.toDate}</p>
                  <p><strong>Username:</strong> {report.userName}</p>
                  <p><strong>Company Name:</strong> {report.companyName}</p>
                  <p><strong>Industry Type:</strong> {report.industryType}</p>
                  <p><strong>Engineer Name:</strong> {report.engineerName}</p>
                  <p><strong>Verified/Declined:</strong> {report.reportApproved ? 'Verified' : 'Declined'}</p>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>SI.No</th>
                        <th>Exceeded Parameter</th>
                        <th>Exceeded Value</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>User Remark Comment</th>
                        <th>Admin Remark Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.calibrationExceeds && report.calibrationExceeds.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.parameter}</td>
                          <td>{item.value}</td>
                          <td>{item.formattedDate}</td>
                          <td>{item.formattedTime}</td>
                          <td>{item.userRemarkComment || 'N/A'}</td>
                          <td>{item.adminRemarkComment || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
  );
};

export default ViewReport;

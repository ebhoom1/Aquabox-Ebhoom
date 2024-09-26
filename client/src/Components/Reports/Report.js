import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/apiConfig';

const Report = () => {
  const [userType, setUserType] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noReportMessage, setNoReportMessage] = useState(''); // To show "No report generated" when no reports are found
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userdatatoken');
        const userResponse = await axios.get(`${API_URL}/api/validuser`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const userData = userResponse.data;

        if (userData.status === 401 || !userData.validUserOne) {
          console.log('User not valid');
          navigate('/');
        } else {
          console.log('User Verified');
          setUserType(userData.validUserOne.userType);
          setDataLoaded(true);

          if (userData.validUserOne.userType === 'admin') {
            const commentsResponse = await axios.get(`${API_URL}/api/get-all-report`);
            setEntries(commentsResponse.data.report);
          } else {
            try {
              const userReports = await axios.get(`${API_URL}/api/get-a-report/${userData.validUserOne.userName}`);
              if (userReports.data.reports && userReports.data.reports.length > 0) {
                setEntries(userReports.data.reports);
              } else {
                setNoReportMessage('No report generated for this user.');
              }
            } catch (error) {
              if (error.response && error.response.status === 404) {
                setNoReportMessage('No report generated for this user.');
              } else {
                console.error('Error fetching user reports:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error validating user or fetching reports:', error);
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const searchResponse = await axios.get(`${API_URL}/api/get-a-report/${searchQuery}`);
      setEntries(searchResponse.data.reports);
    } catch (error) {
      console.error('Error searching reports:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${API_URL}/api/delete-report/${userId}`);
      setEntries(entries.filter(entry => entry._id !== userId));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleDownload = async (userId, format) => {
    try {
      const response = await axios.get(`${API_URL}/api/report-download/${format}/${userId}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `report.${format}`;
      link.click();
    } catch (error) {
      console.error(`Error downloading report as ${format}:`, error);
    }
  };

  const handleView = (userName) => {
    navigate(`/view-report/${userName}`);
  };

  const handleEdit = (userName) => {
    navigate(`/edit-report/${userName}`);
  };

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
        <div className="card">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                {userType === 'admin' && (
                  <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
                    <input
                      className="form-control mr-sm-2"
                      type="search"
                      placeholder="Search by Username"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">
                      Search
                    </button>
                  </form>
                )}
                <h2>Report</h2>

                {noReportMessage ? (
                  <div className="alert alert-warning" role="alert">
                    {noReportMessage}
                  </div>
                ) : (
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>SI.No</th>
                          <th>From Date</th>
                          <th>To Date</th>
                          <th>Username</th>
                          <th>Company Name</th>
                          <th>Industry Type</th>
                          <th>Engineer Name</th>
                          <th>Verified/Declined</th>
                          <th>View</th>
                          {userType === 'admin' && <th>Edit</th>}
                          {userType === 'admin' && <th>Delete</th>}
                          <th>Download</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.fromDate}</td>
                            <td>{entry.toDate}</td>
                            <td>{entry.userName}</td>
                            <td>{entry.companyName}</td>
                            <td>{entry.industryType}</td>
                            <td>{entry.engineerName}</td>
                            <td>{entry.reportApproved ? 'Verified' : 'Declined'}</td>
                            <td>
                              <button type="button" className="btn btn-primary" onClick={() => handleView(entry.userName)}>
                                View
                              </button>
                            </td>
                            {userType === 'admin' && (
                              <td>
                                <button type="button" className="btn btn-warning" onClick={() => handleEdit(entry.userName)}>
                                  Edit
                                </button>
                              </td>
                            )}
                            {userType === 'admin' && (
                              <td>
                                <button type="button" className="btn btn-danger" onClick={() => handleDelete(entry._id)}>
                                  Delete
                                </button>
                              </td>
                            )}
                            <td>
                              <select className="btn btn-outline-success" onChange={(e) => handleDownload(entry._id, e.target.value)}>
                                <option>Download</option>
                                <option value="pdf">PDF</option>
                                <option value="csv">CSV</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
            ©{' '}
            <a href="" target="_blank">
              Ebhoom Solutions LLP
            </a>{' '}
            2022
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Report;

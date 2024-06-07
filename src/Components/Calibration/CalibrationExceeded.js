import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/apiConfig';

const CalibrationExceeded = () => {
  const [userType, setUserType] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [isEditingAdminComment, setIsEditingAdminComment] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userdatatoken");
        const userResponse = await axios.get(`${API_URL}/api/validuser`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          }
        });
        const userData = userResponse.data;

        if (userData.status === 401 || !userData.validUserOne) {
          console.log("User not valid");
          navigate('/');
        } else {
          console.log("User Verified");
          setUserType(userData.validUserOne.userType);
          console.log("User Type :::::", userData.validUserOne.userType);
          setDataLoaded(true);

          const commentsResponse = await axios.get(`${API_URL}/api/get-all-values`);
          setEntries(commentsResponse.data.comments);
        }
      } catch (error) {
        console.error("Error Validating user or fetching comments:", error);
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddComment = async (id, commentField) => {
    try {
      const response = await axios.post(`${API_URL}/api/add-comments`, {
        [commentField]: currentComment
      });
      setEntries(entries.map(entry => entry.id === id ? { ...entry, [commentField]: currentComment } : entry));
      toast.success(`${commentField} added successfully`);
      setCurrentEntryId(null);
      setCurrentComment('');
    } catch (error) {
      toast.error(`Failed to add ${commentField}`);
    }
  };

  const handleEditComment = async (id, commentField) => {
    try {
      const response = await axios.put(`${API_URL}/api/edit-comments/${id}`, {
        [commentField]: currentComment
      });
      setEntries(entries.map(entry => entry.id === id ? { ...entry, [commentField]: currentComment } : entry));
      toast.success(`${commentField} updated successfully`);
      setCurrentEntryId(null);
      setCurrentComment('');
      setIsEditingAdminComment(false);
    } catch (error) {
      toast.error(`Failed to update ${commentField}`);
    }
  };

  const handleVerified = () => {
    toast.success('Calibration exceed approved');
  };

  const handleDenied = () => {
    toast.error('Calibration exceed denied');
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="row mt-5">
            <div className="col-md-12">
              <h2>Download Calibration Exceeded Data</h2>

              <div className="col-lg-6 col-md-6 mb-3">
                <label htmlFor="date">Date </label>
                <input 
                  className="input-field"
                  type="date"
                  id="date"
                />
              </div>
              <button type="submit" className="btn btn-primary mb-2 mt-2">
                Download
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row mt-5">
            <div className="col-md-12">
              <h2>Calibration Exceeded</h2>

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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry._id}>
                        <td>{entry._id}</td>
                        <td>{entry.ph}</td>
                        <td>{entry.turbidity}</td>
                        <td>{entry.timestamp}</td>
                        <td>{entry.commentByUser}</td>
                        <td>{entry.commentByAdmin}</td>
                        <td>
                          {userType === 'admin' && (
                            <button
                              type="button"
                              className="btn btn-primary m-2"
                              onClick={() => {
                                setCurrentEntryId(entry._id);
                                setCurrentComment(entry.commentByAdmin);
                                setIsEditingAdminComment(true);
                              }}
                            >
                              {entry.commentByAdmin ? 'Edit Admin Comment' : 'Add Admin Comment'}
                            </button>
                          )}
                          {userType === 'user' && (
                            <button
                              type="button"
                              className="btn btn-primary m-2"
                              onClick={() => {
                                setCurrentEntryId(entry._id);
                                setCurrentComment(entry.commentByUser);
                                setIsEditingAdminComment(false);
                              }}
                            >
                              {entry.commentByUser ? 'Edit User Comment' : 'Add User Comment'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {currentEntryId !== null && (
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    value={currentComment}
                    onChange={(e) => setCurrentComment(e.target.value)}
                    placeholder={isEditingAdminComment ? "Edit admin comment" : "Enter comment"}
                  ></textarea>
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => {
                      if (isEditingAdminComment) {
                        handleEditComment(currentEntryId, 'commentByAdmin');
                      } else {
                        handleAddComment(currentEntryId, userType === 'admin' ? 'commentByAdmin' : 'commentByUser');
                      }
                    }}
                  >
                    {isEditingAdminComment ? 'Save' : 'Add'}
                  </button>
                  <button
                    className="btn btn-danger mt-2 ms-2"
                    onClick={() => {
                      setCurrentEntryId(null);
                      setCurrentComment('');
                      setIsEditingAdminComment(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default CalibrationExceeded;

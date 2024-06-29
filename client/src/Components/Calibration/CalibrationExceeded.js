import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/apiConfig';
import './index.css';

const CalibrationExceeded = () => {
  const [userType, setUserType] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [isEditingAdminComment, setIsEditingAdminComment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

          const apiUrl = userData.validUserOne.userType === 'admin'
            ? `${API_URL}/api/get-all-exceed-data`
            : `${API_URL}/api/get-user-exceed-data/${userData.validUserOne.userName}`;

          const commentsResponse = await axios.get(apiUrl);
          if (commentsResponse.data && commentsResponse.data.userExceedData) {
            setEntries(commentsResponse.data.userExceedData);
          } else {
            setEntries([]);
          }
        }
      } catch (error) {
        console.error("Error Validating user or fetching comments:", error);
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  const handleSearch = async () => {
    try {
      const apiUrl = searchQuery
        ? `${API_URL}/api/get-user-exceed-data/${searchQuery}`
        : `${API_URL}/api/get-all-exceed-data`;

      const searchResponse = await axios.get(apiUrl);
      if (searchResponse.data && searchResponse.data.userExceedData) {
        setEntries(searchResponse.data.userExceedData);
      } else {
        setEntries([]);
      }
    } catch (error) {
      toast.error("Failed to search comments");
    }
  };

  const handleEditComment = async (id, commentField) => {
    try {
      await axios.put(`${API_URL}/api/edit-comments/${id}`, {
        [commentField]: currentComment
      });
      setEntries(entries.map(entry => entry._id === id ? { ...entry, [commentField]: currentComment } : entry));
      toast.success(`${commentField} updated successfully`);
      setCurrentEntryId(null);
      setCurrentComment('');
      setIsEditingAdminComment(false);
    } catch (error) {
      toast.error(`Failed to update ${commentField}`);
    }
  };

  return (
    <>
      <ToastContainer />
   

      <div className="card">
        <div className="card-body">
          <div className="row mt-5">
            <div className="col-md-12">
              <h2>Calibration Exceeded</h2>

              {userType === 'admin' && (
                <div className="mb-3">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search by user name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-primary mt-2" onClick={handleSearch}>
                    Search
                  </button>
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>SI.No</th>
                      <th>User ID</th>
                      <th>Exceeded Parameter</th>
                      <th>Value</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>User Remark Comment</th>
                      <th>Admin Remark Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => (
                      <tr key={entry._id}>
                        <td>{index + 1}</td>
                        <td>{entry.userName}</td>
                        <td>{entry.parameter}</td>
                        <td>{entry.value}</td>
                        <td>{entry.formattedDate}</td>
                        <td>{entry.formattedTime}</td>
                        <td>{entry.commentByUser}</td>
                        <td>{entry.commentByAdmin}</td>
                        <td>
                          {userType === 'admin' && (
                            <button
                              type="button"
                              className="btn btn-primary m-2"
                              onClick={() => {
                                setCurrentEntryId(entry._id);
                                setCurrentComment(entry.commentByAdmin || '');
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
                                setCurrentComment(entry.commentByUser || '');
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
                <>
                  <div className="overlay" onClick={() => setCurrentEntryId(null)}></div>
                  <div className="popup">
                    <textarea
                      value={currentComment}
                      onChange={(e) => setCurrentComment(e.target.value)}
                      placeholder={isEditingAdminComment ? "Edit admin comment" : "Enter comment"}
                    ></textarea>
                    <div className="popup-buttons">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          if (isEditingAdminComment) {
                            handleEditComment(currentEntryId, 'commentByAdmin');
                          } else {
                            handleEditComment(currentEntryId, 'commentByUser');
                          }
                        }}
                      >
                        {isEditingAdminComment ? 'Save' : 'Add'}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setCurrentEntryId(null);
                          setCurrentComment('');
                          setIsEditingAdminComment(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalibrationExceeded;

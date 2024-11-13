import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../utils/apiConfig';
import './index.css';

const CalibrationExceeded = () => {
  const [userType, setUserType] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [isEditingAdminComment, setIsEditingAdminComment] = useState(false);
  const navigate = useNavigate();
  const { searchTerm, isSearchTriggered } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handling pagination with URL search params
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, isSearchTriggered]);

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
        return;
      }
  
      console.log('User Verified');
      setUserType(userData.validUserOne.userType);
      setDataLoaded(true);
  
      let apiUrl = '';
      if (userData.validUserOne.userType === 'admin' && searchTerm) {
        apiUrl = `${API_URL}/api/get-user-exceed-data/${searchTerm}?page=${currentPage}&limit=${limit}`;
      } else if (userData.validUserOne.userType === 'user') {
        apiUrl = `${API_URL}/api/get-user-exceed-data/${userData.validUserOne.userName}?page=${currentPage}&limit=${limit}`;
      } else {
        console.error('Invalid API URL configuration.');
        return;
      }
  
      const commentsResponse = await axios.get(apiUrl);
      if (commentsResponse.data && commentsResponse.data.data) {
        setEntries(commentsResponse.data.data);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('Error validating user or fetching comments:', error);
      navigate('/');
    }
  };
  

  const handlePageChange = (direction) => {
    const newPage = currentPage + direction;
    setSearchParams({ page: newPage, limit }); // Updates the URL search params which triggers a re-fetch
  };
  
  const handleEditComment = async (id, commentField) => {
    try {
      await axios.put(`${API_URL}/api/edit-comments/${id}`, {
        [commentField]: currentComment,
      });
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry._id === id ? { ...entry, [commentField]: currentComment } : entry
        )
      );
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
              <h2>Parameter Threshold Exceedance</h2>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>SI.No</th>
                      <th>User ID</th>
                      <th>Station Name</th>
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
  {entries.map((entry, index) => {
    const serialNumber = (currentPage - 1) * limit + index + 1;
    return (
      <tr key={entry._id}>
        <td>{serialNumber}</td>
        <td>{entry.userName}</td>
        <td>{entry.stackName}</td>
        <td>{entry.parameter}</td>
        <td>{entry.value}</td>
        <td>{entry.formattedDate}</td>
        <td>{entry.formattedTime}</td>
        <td>{entry.commentByUser}</td>
        <td>{entry.commentByAdmin}</td>
        <td>
          {userType === 'admin' && (
            <button
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
    );
  })}
</tbody>
                </table>
                <div className="pagination">
                  <button
                    className="btn btn-secondary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(-1)}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(1)}
                  >
                    Next
                  </button>
                </div>
              </div>

              {currentEntryId !== null && (
                <>
                  <div className="overlay" onClick={() => setCurrentEntryId(null)}></div>
                  <div className="popup">
                    <textarea
                      value={currentComment}
                      onChange={(e) => setCurrentComment(e.target.value)}
                      placeholder={isEditingAdminComment ? 'Edit admin comment' : 'Enter comment'}
                    ></textarea>
                   <div className="popup-buttons">
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleEditComment(
                            currentEntryId,
                            isEditingAdminComment ? 'commentByAdmin' : 'commentByUser'
                          )
                        }
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
                      </button
                      >
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

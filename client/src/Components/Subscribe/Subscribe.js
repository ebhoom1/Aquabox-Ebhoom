import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { fetchUsers, fetchUserByUserName } from './../../redux/features/userLog/userLogSlice';

const Subscribe = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userLog);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(fetchUserByUserName(searchQuery.trim()))
        .then((response) => {
          console.log("Search response:", response);
        })
        .catch((err) => {
          console.error("Error fetching user by username:", err);
        });
    } else {
      dispatch(fetchUsers());
    }
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Subscription Data</h4>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap"></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
                  <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">
                    Search
                  </button>
                </form>
                <h2>Report</h2>

                <div className="table-responsive mt-3">
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>Error: {error}</p>
                  ) : (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sl.No</th>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile Number</th>
                          <th>Model Name</th>
                          <th>Date</th>
                          <th>Subscription End Date</th>
                          <th>Pay</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user, index) => (
                            <tr key={user._id}>
                              <td>{index + 1}</td>
                              <td>{user.userName}</td>
                              <td>{user.fname}</td>
                              <td>{user.email}</td>
                              <td>{user.mobileNumber}</td>
                              <td>{user.modelName}</td>
                              <td>{user.subscriptionDate}</td>
                              <td>{user.endSubscriptionDate}</td>
                              <td>
                                <button type="button" className="btn btn-primary">Pay</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9">No users found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

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
  );
};

export default Subscribe;

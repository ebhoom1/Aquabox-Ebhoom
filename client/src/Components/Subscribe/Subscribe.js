import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import { fetchUsers, fetchUserByUserName } from './../../redux/features/userLog/userLogSlice';
import axios from 'axios';
import { API_URL } from '../../utils/apiConfig';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

const Subscribe = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userLog);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const calculatePrice = (user) => {
    if (!user) return 0;
    let fee = 0;
    if (user.modelName === 'venus') {
      fee = 15000; // Admin price for Venus
    } else if (user.modelName === 'mars') {
      fee = 25000; // Admin price for Mars
    }
    return fee ; // Convert to paise
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

  const handlePayment = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.post(`${API_URL}/api/create-order`, {
        userName: selectedUser.userName,
        amount: calculatePrice(selectedUser),
      });

      const { order } = response.data;
      const options = {
        key:"rzp_test_b2b3Y59oVOxWMb",
        amount: order.amount,
        currency: order.currency,
        name: "AquaBox Control and Monitor System",
        description: "Subscription Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(`${API_URL}/api/verify-payment`, {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userName: selectedUser.userName,
              modelName: selectedUser.modelName,
              amount: order.amount,
            });

            if (verifyResponse.data.success) {
              toast.success("Payment Successful and Subscription Updated!");
              closeModal();
            } else {
              toast.error("Payment Verification Failed!");
            }
          } catch (error) {
            toast.error("Error verifying payment!");
            console.error("Error verifying payment:", error);
          }
        },
        prefill: {
          name: selectedUser.fname,
          email: selectedUser.email,
          contact: selectedUser.mobileNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Error creating order!");
      console.error("Error creating order:", error);
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
                <h2>Subscription Data of Users</h2>

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
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => openModal(user)}
                                >
                                  Pay
                                </button>
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Payment Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          },
        }}
      >
        {selectedUser && (
          <div>
            <h2><i className="bi bi-currency-rupee"></i></h2>
            <h4>User Name: {selectedUser.userName}</h4>
            <h4>Model Name: {selectedUser.modelName}</h4>
            <h5>Price: <i className="bi bi-currency-rupee"></i> {calculatePrice(selectedUser )}</h5>
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={handlePayment}
            >
              Pay
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Subscribe;

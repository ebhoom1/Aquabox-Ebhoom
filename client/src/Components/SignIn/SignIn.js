import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { loginUser } from "../../redux/features/auth/authSlice";
import axios from "axios";
import { API_URL } from "../../utils/apiConfig";

const SignIn = () => {
  const [passShow, setPassShow] = useState(false);
  const [inpval, setInpval] = useState({
    email: "",
    password: "",
    userType: "select",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  Modal.setAppElement('#root'); // Bind modal to your appElement

  const setVal = (e) => {
    const { name, value } = e.target;
    setInpval((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setInpval((prevState) => ({
      ...prevState,
      userType: value,
    }));
  };

  const calculatePrice = (user) => {
    return user.modelName === "venus" ? 17000 : user.modelName === "mars" ? 30000 : 0;
  };

  const loginuser = async (e) => {
    e.preventDefault();
    const { email, password, userType } = inpval;

    if (email === "") {
      toast.error("Email is required!");
    } else if (!email.includes("@")) {
      toast.warning("Please include '@' in your email!");
    } else if (userType === "select") {
      toast.error("Please select the user type");
    } else if (password === "") {
      toast.error("Password is required!");
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
    } else {
      dispatch(loginUser({ email, password, userType }))
        .unwrap()
        .then((result) => {
          if (userType === 'admin' && result.userType !== 'admin') {
            toast.error("User type does not match!");
          } else if (userType === 'user' && result.userType !== 'user') {
            toast.error("User type does not match!");
          } else {
            const now = new Date();
            const endSubscriptionDate = new Date(result.endSubscriptionDate);
            if (now.toDateString() === endSubscriptionDate.toDateString()) {
              setSelectedUser(result);
              setModalIsOpen(true);
            } else {
              if (userType === 'admin') {
                navigate('/users-log');
              } else if (userType === 'user') {
                navigate('/account');
              }
              setInpval({ email: '', password: '', userType: 'select' });
            }
          }
        })
        .catch((error) => {
          toast.error('Invalid credentials');
          console.log("Error from catch signIn:", error);
          localStorage.removeItem('userdatatoken');
        });
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
              amount: order.amount, // Pass the amount here
            });

            if (verifyResponse.data.success) {
              toast.success("Payment Successful and Subscription Updated!");
              closeModal();
              setPaymentCompleted(true);
              if (inpval.userType === 'admin') {
                navigate('/users-log');
              } else if (inpval.userType === 'user') {
                navigate('/account');
              }
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

  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'object') return JSON.stringify(error);
    return error;
  };

  return (
    <>
      <div className="pt-4 pb-4"></div>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6 blue-box">
            <h1 className="blue-box-text">
              Pollution Monitoring Application
            </h1>
          </div>
          <div className="col-12 col-lg-6 padd pt-4">
            <form>
              <p className="signin-text mb-5">Sign In</p>
              <span className="error"></span>
              <div className="mb-4">
                <input
                  type="email"
                  value={inpval.email}
                  onChange={setVal}
                  name="email"
                  id="email"
                  className="input-field"
                  placeholder="Email"
                  autoComplete="email"
                />
              </div>
              <div className="mb-4">
                <input
                  type={!passShow ? "password" : "text"}
                  onChange={setVal}
                  value={inpval.password}
                  name="password"
                  id="password"
                  placeholder="Enter Your password"
                  className="input-field"
                  autoComplete="current-password"
                />
                <div
                  className="showpass"
                  onClick={() => setPassShow(!passShow)}
                >
                  {!passShow ? "Show" : "Hide"}
                </div>
              </div>
              <Link className="link" to="/reset-password-email">
                {" "}
                <p className="forgot">Forgot password?</p>
              </Link>
              <select
                className="input-field mb-4"
                value={inpval.userType}
                onChange={handleSelectChange}
              >
                <option value="select">Select</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <button
                type="submit"
                className="signin-button"
                onClick={loginuser}
                disabled={loading}
              >
                Sign In
              </button>
            </form>
            
            {error && <div className="error">{renderError()}</div>}
            <ToastContainer />
          </div>
        </div>
      </div>

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
            <h5>Price: <i className="bi bi-currency-rupee"></i> {calculatePrice(selectedUser)}</h5>            
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
    </>
  );
};

export default SignIn;

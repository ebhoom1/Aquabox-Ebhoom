import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { loginUser } from "../../redux/features/auth/authSlice";

const SignIn = () => {
  const [passShow, setPassShow] = useState(false);
  const [inpval, setInpval] = useState({
    email: "",
    password: "",
    userType: "select",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

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
            if (userType === 'admin') {
              navigate('/users-log');
            } else if (userType === 'user') {
              navigate('/account');
            }
            setInpval({ email: '', password: '', userType: 'select' });
          }
        })
        .catch((error) => {
          toast.error('Invalid credentials');
          console.log("Error from catch signIn:", error);
          localStorage.removeItem('userdatatoken');
        });
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
    </>
  );
};

export default SignIn;

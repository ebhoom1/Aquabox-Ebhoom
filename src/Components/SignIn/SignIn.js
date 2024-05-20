import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import LeftSideBar from "../LeftSideBar/LeftSideBar";

const SignIn = () => {
  const [passShow, setPassShow] = useState(false);
  const [inpval, setInpval] = useState({
    email: "",
    password: "",
    userType: "",
  });
  const history = useNavigate();
  const url = 'http://localhost:4444'
  const deployed_url = 'https://aquabox-ebhoom-3.onrender.com'

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
      toast.error("email is required!", {
        position: "top-center",
      });
    } else if (!email.includes("@")) {
      toast.warning("includes @ in your email!", {
        position: "top-center",
      });
    } else if (userType === "select") {
      toast.error("Please select the user Type", {
        position: "top-center",
      });
    } else if (password === "") {
      toast.error("password is required!", {
        position: "top-center",
      });
    } else if (password.length < 6) {
      toast.error("password must be 6 char!", {
        position: "top-center",
      });
    } else {
      try {
        const response = await axios.post(
          `${url}/api/login`,
          { email, password, userType }
        );
        const { status, result } = response.data;

        if (status === 200) {
          localStorage.setItem("userdatatoken", result.token);
          history("/water");
          setInpval({ ...inpval, email: "", password: "", userType: "" });
        } else {
          toast.error("Invalid Credentials", {
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error Logging In :", error);

        toast.error("An error Occured. Please try again later.", {
          position: "top-center",
        });
      }
    }
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
              >
                Sign In
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

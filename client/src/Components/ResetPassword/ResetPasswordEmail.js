import { useState } from "react";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { sendResetLink, clearState } from "../../redux/features/auth/resetPasswordEmailSlice";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordEmail = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.resetPasswordEmail);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const setVal = (e) => {
    setEmail(e.target.value);
  }

  const sendLink = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Email is required");
    } else if (!email.includes("@")) {
      toast.warning("Include @ in your email");
    } else {
      try {
        await dispatch(sendResetLink(email)).unwrap();
        setEmail("");
        setMessage(true);
        toast.success("Reset Email link sent successfully");
      } catch (error) {
        toast.error("Invalid User");
      }
    }
  }

  return (
    <>
      <div className="pt-4 pb-4"></div>
      <div className="container">
        <form>
          <div className="row">
            <div className="col-12 col-lg-3"></div>
            <div className="col-12 col-lg-6">
              <p className="signup-head">Enter Email to receive Reset Password link</p>
              <input
                className="input-field mb-4"
                type="text"
                placeholder="Email"
                value={email}
                onChange={setVal}
              />
              <button className="signin-button mb-5" type="submit" onClick={sendLink}>Reset Email</button>
              <div className="text-center">
                <Link className="link" to="/"><button className='home-button'>Home</button></Link>
              </div>
            </div>
            <div className="col-12 col-lg-3"></div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default ResetPasswordEmail;

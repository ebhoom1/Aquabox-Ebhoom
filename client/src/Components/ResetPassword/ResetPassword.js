import {  useEffect, useState } from "react";
import {Link,useParams, useNavigate, Navigate} from 'react-router-dom'

import {ToastContainer,toast} from 'react-toastify';
import axios from 'axios';
import { useDispatch,useSelector } from "react-redux";
import { validateUser,resetPassword,clearState } from "../../redux/features/auth/resetPassowordSlice";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => { 

 const {id,token}= useParams();
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const {loading,error,success} = useSelector((state)=>state.resetPassword);

 const [password,setPassword]=useState("");
 const [cpassword, setConfirmPassword] = useState("");

 useEffect(()=>{
  dispatch(validateUser({id,token}))
  .unwrap()
  .catch(()=>{
    navigate('/');
  })
  return () =>{
    dispatch(clearState());
  }
 },[dispatch,id,token,navigate])


 const setVal = (e) => {
  const { name, value } = e.target;
  if (name === "password") {
    setPassword(value);
  } else if (name === "cpassword") {
    setConfirmPassword(value);
  }
}

const sendPassword = async (e) => {
  e.preventDefault();
  if (password === "") {
    toast.error("Password is required");
  } else if (password.length < 8) {
    toast.error("Password must be at least 8 characters long");
  } else if (password !== cpassword) {
    toast.error("Password and Confirm Password do not match");
  } else {
    try {
      await dispatch(resetPassword({id,token,password,cpassword})).unwrap();
      toast.success("Password changed successfully");
      setPassword('')
      setConfirmPassword('')
      navigate('/');
    }catch(error){
      toast.error(error.message ||"Token expired. Generate a new link")
    }
      
  }
};


    return (
      <>
     
        <div className="pt-4 pb-4"></div>
        <div className="container">
        <form >
          
            <div className="row">
                <div className="col-12 col-lg-3"></div>
                <div className="col-12 col-lg-6">
                  <p className="signup-head">Reset Password</p>
                  <input
                    className="input-field mb-4"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={setVal}
                  />
                 
                  
                  <input
                    className="input-field mb-4"
                    type="password"
                    placeholder="Confirm password"
                    name="cpassword"
                    value={cpassword}
                    onChange={setVal}
                  />
                  {/* <span className="error">Confirm Password is required</span>
                  <span className="error"></span> */}
                
                  
                <button className="signin-button mb-5" type="submit" onClick={sendPassword}>Reset</button>

                <div className="text-center">
                <Link className="link" to="/"> <button className='home-button'>Cancel</button> </Link>
                </div>
                </div>
                <div className="col-12 col-lg-3"></div>
              </div>
              
          </form>
          <ToastContainer/>
        </div>
      </>
    );
  
}

export default ResetPassword;

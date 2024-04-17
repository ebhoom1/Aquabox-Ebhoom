import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { LoginContext } from './Components/ContextProvider/Context';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import PrivateLayout from './Components/PrivateLayout/PrivateLayout';
import Water from './Components/Water/Water';
import Attendence from './Components/Attendance/Attendence';
import ManageUsers from './Components/ManageUsers/ManageUsers';
import UsersLog from './Components/UsersLog/UsersLog';
import Account from './Components/Account/Account';
import PublicLayout from './Components/PublicLayout/PublicLayout';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import ResetPasswordEmail from './Components/ResetPassword/ResetPasswordEmail';
import ResetPasswordOtp from './Components/ResetPassword/ResetPasswordOtp';
import Faq from './Components/Faq/Faq';
import Terms from './Components/Terms/Terms';
import SignIn from './Components/SignIn/SignIn';
import SignUp from './Components/SignUp/SignUp';
import SignUpConfirmation from './Components/SignUp/SignUpConfirmation';
import AmbientAir from './Components/AmbientAir/AmbientAir';
import Noise from './Components/Noise/Noise';
import DownloadData from './Components/Download-Data/DownloadData';
import Calibration from './Components/Calibration/Calibration';
import EditUsers from './Components/ManageUsers/EditUser';

function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState(false);
  const { setLoginData } = useContext(LoginContext);
  const navigate  = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("userdatatoken");

    try {
      const response = await axios.get('http://localhost:4444/api/validuser', {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      });
      const responseData = response.data;

      if (responseData.status === 401 || !responseData) {
        console.log("user not valid");
        navigate('/');
      } else {
        console.log("User Verify");
        setLoginData(responseData);
        setData(true);
      }
    } catch (error) {
      console.error("Error Validating user:", error);
      navigate('/');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      DashboardValid();
      setDataLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route exact path="" element={<SignIn />} />
          <Route exact path="signup" element={<SignUp />} />
          <Route exact path="signup-confirmation" element={<SignUpConfirmation />} />
          <Route exact path="reset-password-otp" element={<ResetPasswordOtp />} />
          <Route exact path="reset-password/:id/:token" element={<ResetPassword />} />
          <Route exact path="reset-password-email" element={<ResetPasswordEmail />} />
          <Route exact path="faq" element={<Faq />} />
          <Route exact path="/download-data" element={<DownloadData />} />
          <Route exact path="terms" element={<Terms />} />
        </Route>

        {dataLoaded && data && (
          <Route path="/" element={<PrivateLayout />}>
            <Route exact path="/water" element={<Water />} />
            <Route exact path="/ambient-air" element={<AmbientAir />} />
            <Route exact path="/noise" element={<Noise />} />
            <Route exact path="/account" element={<Account />} />
            <Route exact path="/attendance-report" element={<Attendence />} />
            <Route exact path="/manage-users" element={<ManageUsers />} />
            <Route exact path='/edit-user/:userId' element={<EditUsers/>}/>
            <Route exact path="/users-log" element={<UsersLog />} />
            <Route exact path="/calibration" element={<Calibration />} />
          </Route>
        )}
      </Routes>
    </>
  );
}

export default App;

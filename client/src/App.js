import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './redux/features/user/userSlice';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import PrivateLayout from './Components/PrivateLayout/PrivateLayout';
import Water from './Components/Water/Water';
import Attendance from './Components/Attendance/Attendence';
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
import EditCalibration from './Components/Calibration/EditCalibartion';
import CalibrationData from './Components/Calibration/Calibration-Data';
import LeftSideBar from './Components/LeftSideBar/LeftSideBar';
import Notification from './Components/Notification/Notification';
import AddNotification from './Components/Notification/AddNotification';
import CalibrationExceeded from './Components/Calibration/CalibrationExceeded';
import CalibrationExceededReport from './Components/Calibration/CalibrationExceedReport';
import Report from './Components/Reports/Report';
import ListOfSupportAnalyserMakeAndModel from './Components/ListOfSupportAnalyserMakeAndModel/ListOfSupportAnalyserMakeAndModel';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading, userType } = useSelector((state) => state.user);

  useEffect(() => {
    
      dispatch(fetchUser())

        .unwrap()
        .then((responseData) => {
          if (responseData.status === 401 || !responseData.validUserOne) {
            console.log("User not Valid");
            navigate('/');
          } else {
            console.log("User verify");
          }
        })
        .catch((error) => {
          console.error("Error Validating User:", error);
          navigate('/');
        });
    
  }, [dispatch,navigate]);
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signup-confirmation" element={<SignUpConfirmation />} />
        <Route path="reset-password-otp" element={<ResetPasswordOtp />} />
        <Route path="reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="reset-password-email" element={<ResetPasswordEmail />} />
        <Route path="faq" element={<Faq />} />
        <Route path="download-data" element={<DownloadData />} />
        <Route path="terms" element={<Terms />} />
      </Route>

      {!loading && userData && (
       
        <Route path="/" element={<PrivateLayout />}>
          {userType === "admin" && (
            <>
              <Route path="water" element={<Water />} />
              <Route path="ambient-air" element={<AmbientAir />} />
              <Route path="noise" element={<Noise />} />
              <Route path="account" element={<Account />} />
              <Route path="attendance-report" element={<Attendance />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="edit-user/:userId" element={<EditUsers />} />
              <Route path="users-log" element={<UsersLog />} />
              <Route path="calibration-new" element={<Calibration />} />
              <Route path="calibration" element={<CalibrationData />} />
              <Route path="edit-calibration/:userName" element={<EditCalibration />} />
              <Route path="notification" element={<Notification />} />
              <Route path="notification-new" element={<AddNotification />} />
              <Route path="calibration-exceeded" element={<CalibrationExceeded />} />
              <Route path="calibration-exceeded-report" element={<CalibrationExceededReport />} />
              <Route path="report" element={<Report />} />
              <Route path="list-of-support-analyser-make-and-model" element={<ListOfSupportAnalyserMakeAndModel />} />
            </>
          )}
          {userType === "user" && (
            <>
              <Route path="water" element={<Water />} />
              <Route path="ambient-air" element={<AmbientAir />} />
              <Route path="noise" element={<Noise />} />
              <Route path="account" element={<Account />} />
              <Route path="report" element={<Report />} />
              <Route path="list-of-support-analyser-make-and-model" element={<ListOfSupportAnalyserMakeAndModel />} />
            </>
          )}
        </Route>
      )}
    </Routes>
  );
}

export default App;
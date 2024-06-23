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
import ValidateData from './Components/ValidateData/ValidateData';
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
import Subscribe from './Components/Subscribe/Subscribe';
import AddCalibrationExceedValues from './Components/Calibration Exceed Value/AddCalibrationExceedValues';
import CalibrationExceedValue from './Components/Calibration Exceed Value/CalibrationExceedValue';
import EditCalibrationExceedValue from './Components/Calibration Exceed Value/EditCalibrationExceedValue';
import ViewReport from './Components/Reports/ViewReport';
import EditReport from './Components/Reports/EditReport';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Transaction from './Components/Transactions/Transaction';
import DownloadIoTdata from './Components/Download/DownloadIoTdata';
import Quantity from './Components/Quantity/Quantity';
import Energy from './Components/Energy/Energy';
import LiveVideo from './Components/LiveVideo/LiveVideo';



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
        <Route path="terms" element={<Terms />} />
        <Route path="/download-IoT-Data" element={<DownloadIoTdata/>}/>
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
              <Route path= "add-calibration-exceed-value" element={<AddCalibrationExceedValues/>}/>
              <Route path= "calibration-exceed-value" element={<CalibrationExceedValue/>}/>
              <Route path= "edit-calibration-exceed-value/:userName" element={<EditCalibrationExceedValue/>}/>
              <Route path="/report" element={<Report />} />
              <Route path="view-report/:userName" element={<ViewReport />}/>
              <Route path= "edit-report/:userName" element={<EditReport />}/>
              <Route path="list-of-support-analyser-make-and-model" element={<ListOfSupportAnalyserMakeAndModel />} />
              <Route path= '/subscribe-data' element={<Subscribe/>}/>
              <Route path ="/transactions" element={<Transaction/>}/>
              <Route path="/download-IoT-Data" element={<DownloadIoTdata/>}/>
              <Route path ='/quantity' element={<Quantity/>}/>
              <Route path = '/energy' element={<Energy/>}/>
              <Route path = '/live-video' element ={<LiveVideo/>}/>



            </>
          )}
          {userType === "user" && (
            <>
              <Route path="water" element={<Water />} />
              <Route path="ambient-air" element={<AmbientAir />} />
              <Route path="noise" element={<Noise />} />
              <Route path="account" element={<Account />} />
              <Route path="/report" element={<Report />} />
              <Route path ="/transactions" element={<Transaction/>}/>
              <Route path= "edit-report/:userName" element={<EditReport />}/>
              <Route path="view-report/:userName" element={<ViewReport />}/>
              <Route path="list-of-support-analyser-make-and-model" element={<ListOfSupportAnalyserMakeAndModel />} />
              <Route path="/download-IoT-Data" element={<DownloadIoTdata/>}/>
              <Route path ='/quantity' element={<Quantity/>}/>
              <Route path = '/energy' element={<Energy/>}/>

            </>
          )}
        </Route>
      )}
    </Routes>
  );
}

export default App;

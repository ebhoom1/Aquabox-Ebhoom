import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './redux/features/user/userSlice';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import PrivateLayout from './Components/PrivateLayout/PrivateLayout';
import Water from './Components/Water/Water';
import ManageUsers from './Components/ManageUsers/ManageUsers';
import UsersLog from './Components/UsersLog/UsersLog';
import Account from './Components/Account/Account';
import PublicLayout from './Components/PublicLayout/PublicLayout';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import ResetPasswordEmail from './Components/ResetPassword/ResetPasswordEmail';
import Faq from './Components/Faq/Faq';
import Terms from './Components/Terms/Terms';
import SignIn from './Components/SignIn/SignIn';
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
import SupportedAnalyserModels from './Components/SupportedAnalyserModels/SupportedAnalyserModels';
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
import Error from './Components/Error/Error';
import InstallPrompt from './Components/InstallPrompt/InstallPrompt'
import CustomBanner from './Components/InstallPrompt/CustomBanner'
import DownloadIoTdataByUserName from './Components/Download/DownloadIoTdataByUserName';
import ChatApp from './Components/Chat/ChatApp';
import ViewComponent from './Components/Water/ViewComponent';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, loading, userType } = useSelector((state) => state.user);

  // List of routes that do not require user validation
  const publicRoutes = ['/download-IoT-Data', '/download-Iot-Data-By-userName'];

  useEffect(() => {
    // Only perform user validation for routes that are not in the publicRoutes array
    if (!publicRoutes.includes(location.pathname)) {
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
    }
  }, [dispatch, navigate, location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<SignIn />} />
          <Route path="reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="reset-password-email" element={<ResetPasswordEmail />} />
          <Route path="faq" element={<Faq />} />
          <Route path="terms" element={<Terms />} />
          <Route path="/download-IoT-Data" element={<DownloadIoTdata />} />
          <Route path="/download-Iot-Data-By-userName" element={<DownloadIoTdataByUserName />} />
          {/* <Route path = "*" element={<Error/>}/> */}
        </Route>

        {!loading && userData && (
          <Route path="/" element={<PrivateLayout />}>
            {userType === "admin" && (
              <>
                <Route path="water" element={<Water />} />
                <Route path="ambient-air" element={<AmbientAir />} />
                <Route path="noise" element={<Noise />} />
                <Route path="account" element={<Account />} />
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
                <Route path="add-calibration-exceed-value" element={<AddCalibrationExceedValues />} />
                <Route path="calibration-exceed-value" element={<CalibrationExceedValue />} />
                <Route path="edit-calibration-exceed-value/:userName" element={<EditCalibrationExceedValue />} />
                <Route path="/report" element={<Report />} />
                <Route path="view-report/:userName" element={<ViewReport />} />
                <Route path="edit-report/:userName" element={<EditReport />} />
                <Route path="supportedAnalyserModels" element={<SupportedAnalyserModels />} />
                <Route path="/subscribe-data" element={<Subscribe />} />
                <Route path="/transactions" element={<Transaction />} />
                <Route path="/download-IoT-Data" element={<DownloadIoTdata />} />
                <Route path="/download-Iot-Data-By-userName" element={<DownloadIoTdataByUserName />} />
                <Route path="/quantity" element={<Quantity />} />
                <Route path="/energy" element={<Energy />} />
                <Route path="/live-video" element={<LiveVideo />} />
                <Route path="/chat" element={<ChatApp />} />
                <Route path="/view-data" element={<ViewComponent />} />
                {/* <Route path = "/*" element={<Error/>}/> */}
              </>
            )}
            {userType === "user" && (
              <>
                <Route path="water" element={<Water />} />
                <Route path="ambient-air" element={<AmbientAir />} />
                <Route path="noise" element={<Noise />} />
                <Route path="account" element={<Account />} />
                <Route path="/report" element={<Report />} />
                <Route path="/transactions" element={<Transaction />} />
                <Route path="edit-report/:userName" element={<EditReport />} />
                <Route path="view-report/:userName" element={<ViewReport />} />
                <Route path="/supportedAnalyserModels" element={<SupportedAnalyserModels />} />
                <Route path="/download-IoT-Data" element={<DownloadIoTdata />} />
                <Route path="/download-Iot-Data-By-userName" element={<DownloadIoTdataByUserName />} />
                <Route path="/quantity" element={<Quantity />} />
                <Route path="/energy" element={<Energy />} />
                <Route path="/chat" element={<ChatApp />} />
                <Route path="/view-data" element={<ViewComponent />} />
                {/* <Route path = "/*" element={<Error/>}/> */}
              </>
            )}
          </Route>
        )}
      </Routes>
      <CustomBanner />
      <InstallPrompt />
    </>
  );
}

export default App;

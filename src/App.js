
import './App.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import PrivateLayout from './Components/PrivateLayout/PrivateLayout'
import Dashboard from './Components/Dashboard/Dashboard';
import Attendence from './Components/Attendance/Attendence';
import ManageUsers from './Components/ManageUsers/ManageUsers';
import UsersLog from './Components/UsersLog/UsersLog';
import Account from './Components/Account/Account'
import PublicLayout from './Components/PublicLayout/PublicLayout'
import ResetPassword from './Components/ResetPassword/ResetPassword';
import ResetPasswordEmail from './Components/ResetPassword/ResetPasswordEmail';
import ResetPasswordOtp from './Components/ResetPassword/ResetPasswordOtp';
import Faq from './Components/Faq/Faq';
import Terms from './Components/Terms/Terms'
import SignIn from './Components/SignIn/SignIn';
import SignUp from './Components/SignUp/SignUp';
import SignUpConfirmation from './Components/SignUp/SignUpConfirmation';
import AmbientAir from './Components/AmbientAir/AmbientAir';
import Noise from './Components/Noise/Noise';
import DownloadData from './Components/Download-Data/DownloadData';
import Calibration from './Components/Calibration/Calibration';

function App() {
  return (
    <>
 <Routes>
        <Route path="/" element={<PublicLayout />} >
          <Route exact path="" element={<SignIn />} />
          <Route exact path="signup" element={<SignUp />} />
          <Route exact path="signup-confirmation" element={<SignUpConfirmation />} />
          <Route exact path="reset-password-otp" element={<ResetPasswordOtp />} />
          <Route exact path="reset-password" element={<ResetPassword />} />
          <Route exact path="reset-password-email" element={<ResetPasswordEmail />} />
          <Route exact path="faq" element={<Faq />} />
          <Route exact path="/download-data" element={<DownloadData />} />
          <Route exact path="terms" element={<Terms />} />
        </Route>

        <Route exact path="/" element={<PrivateLayout />} >
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/ambient-air" element={<AmbientAir />} />
          <Route exact path="/noise" element={<Noise />} />
          <Route exact path="/account" element={<Account />} />
          <Route exact path="/attendance-report" element={<Attendence />} />
          <Route exact path="/manage-users" element={<ManageUsers />} />
          <Route exact path="/users-log" element={<UsersLog />} />
          <Route exact path="/calibration" element={<Calibration />} />
        </Route>
        


      </Routes>
    </>
  );
}

export default App;

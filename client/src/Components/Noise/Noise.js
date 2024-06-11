import './index.css';
import React, { useEffect, useState } from "react";
import {useDispatch,useSelector} from 'react-redux';
import { fetchUser } from "../../redux/features/user/userSlice";
import {fetchLatestIotData} from "../../redux/features/iotData/iotDataSlice"
import NoisePopup from './NoisePopup';
import CalibrationPopup from '../Calibration/CalibrationPopup';
import axios from 'axios';
import CalibrationExceeded from '../Calibration/CalibrationExceeded';

const Noise = () => {
  const dispatch =useDispatch();
  const {userData,userType} =useSelector((state)=>state.user);
  const {latestData,loading,error} = useSelector((state)=>state.iotData)
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCalibrationPopup, setShowCalibrationPopup] = useState(false);
  const [fetchvalue, setFetchValues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample data for demonstration, replace with your actual data
 const weekData = [{ name: "Mon", value: 30 }, { name: "Tue", value: 40 }, { name: "Wed", value: 50 }];
 const monthData = [{ name: "Week 1", value: 100 }, { name: "Week 2", value: 200 }, { name: "Week 3", value: 150 }];
 const dayData=[{ name: "9:00 am", value: 30 }, { name: "10:00am", value: 33 }, { name: "11:00am", value: 40 }, { name: "12:00pm", value: 41 }, { name: "1:00pm", value: 70 },{ name: "2:00pm", value: 54 },{ name: "3:00pm", value: 31 },{ name: "4:00pm", value: 31.2 }];
 const sixMonthData=[{ name: "Jan-June", value: 30 }, { name: "July-December", value: 40 }];
 const yearData=[{ name: "2021", value: 20 }, { name: "2022", value: 90 }, { name: "2023", value: 30 }, { name: "2024", value: 50 }];

 const validateUser = async () => {
  const response = await dispatch(fetchUser()).unwrap(); 
};

if (!userData) {
validateUser();
}
 
useEffect(() => {
  if (userData) {
    if (userType === 'user') {
      dispatch(fetchLatestIotData(userData.validUserOne.userName));
      const interval = setInterval(() => {
        dispatch(fetchLatestIotData(userData.validUserOne.userName));
      }, 1000); // Fetch every second
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }
}, [userData, userType, dispatch]);

 const handleCardClick = (card) => {
  setSelectedCard(card);
  setShowPopup(true);
};
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCard(null);
  };

  const handleOpenCalibrationPopup = () => {
    setShowCalibrationPopup(true);
  }

  const handleCloseCalibrationPopup = () => {
    setShowCalibrationPopup(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchLatestIotData(searchQuery));
  };
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Noise DASHBOARD</h4>
              <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
              <ul className="quick-links ml-auto">
               {userData.validUserOne && userData.validUserOne.userType === 'user' &&(
                <h5>Data Interval: <span className="span-class">{userData.validUserOne && userData.validUserOne.dataInteval}</span></h5>
               )}
               </ul>
               <ul className="quick-links ml-auto">
               {latestData && (
                <>
                  <h5>Analyser Health : </h5>
                  {latestData.validationStatus ? (
                    <h5 style={{color:"green"}}>Good</h5>
                  ) : (
                    <h5  style={{color:"red"}}>Problem</h5>
                  )}
                  
                </>
              )}
              </ul>
               {userData.validUserOne && userData.validUserOne.userType === 'user' &&(
               <ul className="quick-links ml-auto">
               
                <button type="submit" onClick={() => handleOpenCalibrationPopup(userData.validUserOne.userName)} className="btn btn-primary mb-2 mt-2"> Calibration </button>

               </ul>
               )}
              </div>
            </div>
          </div>
        </div>
               {/* <!-- Page Title Header Ends--> */}
        {userData.validUserOne && userData.validUserOne.userType === 'admin' &&(
            <div className="card">
            <div className="card-body">
            <h1>Find Users</h1>
            
            <form className="form-inline  my-2 my-lg-0"onSubmit={handleSearch}>
                      <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button className="btn btn-outline-primary my-2 my-sm-0" type="submit"  >
                        Search
                      </button>
                     
                    </form>
                    
            
            <h1>{latestData.userName}</h1>
           
            </div>
          </div>
        )}
              
        <div className="p-2"></div>
      <div className="p-2"></div>
        <div className="row">
          <div className="col-12 col-md-4 grid-margin">
            <div className="card" onClick={() => handleCardClick({ title: "Limits in DB" })}>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Limits in DB</h3>
                  </div>
                  <div className="col-12 mb-3">
                  <h6><strong className="strong-value">{latestData.db || 'N/A'}</strong> dB   </h6>

                  </div>
                  <div className="col-12">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPopup && selectedCard && (
          <NoisePopup
            title={selectedCard.title}
            weekData={weekData} // Pass actual week data here
            monthData={monthData} // Pass actual month data here
            dayData={dayData}
            sixMonthData={sixMonthData}
            yearData={yearData}
            onClose={handleClosePopup}
          />
        )}

        {showCalibrationPopup && (
          <CalibrationPopup
            onClose={handleCloseCalibrationPopup}
          />
        )}
      </div>

      <CalibrationExceeded/>
      

      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
            Ebhoom Control and Monitor System
          </span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
            ©
            <a href="" target="_blank">
              Ebhoom Solutions LLP
            </a>
            2023
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Noise;

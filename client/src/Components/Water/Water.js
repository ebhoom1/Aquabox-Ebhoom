
import React, { createContext, useEffect, useState } from "react";
import {useDispatch,useSelector} from 'react-redux';
import { fetchUser } from "../../redux/features/user/userSlice";
import {fetchIotDataByUserName,fetchAverageIotData} from "../../redux/features/iotData/iotDataSlice"
import { Link } from 'react-router-dom';
import WaterPopup from "./WaterPopup";
import CalibrationPopup from "../Calibration/CalibrationPopup";
import CalibrationExceeded from "../Calibration/CalibrationExceeded";
import { ToastContainer, toast } from "react-toastify";


const Water = () => {
  const dispatch =useDispatch();
  const {userData,userType} =useSelector((state)=>state.user);
  const {latestData,averageData,userIotData,loading,error} = useSelector((state)=>state.iotData)
  const [showPopup,setShowPopup]=useState(false);
  const [selectedCard, setSelectedCard]=useState(null);
  const[showCalibrationPopup,setShowCalibrationPopup]=useState(false);
  const [searchQuery, setSearchQuery] = useState("");


//  // Sample data for demonstration, replace with your actual data
//  const weekData = [{ name: "Mon", value: 30 }, { name: "Tue", value: 40 }, { name: "Wed", value: 50 }];
//  const monthData = [{ name: "Week 1", value: 100 }, { name: "Week 2", value: 200 }, { name: "Week 3", value: 150 }];
//  const dayData=[{ name: "9:00 am", value: 30 }, { name: "10:00am", value: 33 }, { name: "11:00am", value: 40 }, { name: "12:00pm", value: 41 }, { name: "1:00pm", value: 70 },{ name: "2:00pm", value: 54 },{ name: "3:00pm", value: 31 },{ name: "4:00pm", value: 31.2 }];
//  const sixMonthData=[{ name: "Jan-June", value: 30 }, { name: "July-December", value: 40 }];
//  const yearData=[{ name: "2021", value: 20 }, { name: "2022", value: 90 }, { name: "2023", value: 30 }, { name: "2024", value: 50 }];


// Sample data for demonstration, replace with your actual data
const [weekData, setWeekData] = useState([]);
const [monthData, setMonthData] = useState([]);
const [dayData, setDayData] = useState([]);
const [sixMonthData, setSixMonthData] = useState([]);
const [yearData, setYearData] = useState([]);


 const validateUser = async () => {
  const response = await dispatch(fetchUser()).unwrap(); 
};

if (!userData) {
validateUser();
}
 
 useEffect(() => {
    if (userData) {
      if (userType === 'user') {
        dispatch(fetchIotDataByUserName(userData.validUserOne.userName));
        dispatch(fetchAverageIotData(userData.validUserOne.userName));
        // const interval = setInterval(() => {
        //   dispatch(fetchIotDataByUserName(userData.validUserOne.userName));
        //   dispatch(fetchAverageIotData(userData.validUserOne.userName));
        // }, 1000); // Fetch every second
        // return () => clearInterval(interval); // Cleanup interval on component unmount
      }
    }
  }, [userData, userType, dispatch]);

  useEffect(() => {
    if (averageData) {
      console.log('Average Data:', averageData);
      setWeekData(averageData.filter(item => item.averageType === 'week'));
      console.log("average data for week :",averageData.filter(item => item.averageType === 'year'))
      setMonthData(averageData.filter(item => item.averageType === 'month'));
      setDayData(averageData.filter(item => item.averageType === 'day'));
      setSixMonthData(averageData.filter(item => item.averageType === 'sixmonth'));
      setYearData(averageData.filter(item => item.averageType === 'year'));
    }
  }, [averageData]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedCard(null);
  };

  const handleOpenCalibrationPopup=()=>{
    setShowCalibrationPopup(true)
   
  }
  const handleCloseCalibrationPopup=()=>{
    setShowCalibrationPopup(false)
  }
 
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchIotDataByUserName(searchQuery));
    dispatch(fetchAverageIotData(searchQuery));
  };
  const water=[
    {
      parameter:"Ph",
      value:'pH',
      name:'ph',
      week:":",
      month:":",
      
    },
    {
      parameter:"TDS",
      value:'mg/l',
      name:'TDS',
      week:"",
      month:"",
    },
    {
      parameter:"Turbidity",
      value:'NTU',
      name:'turbidity',
      week:"",
      month:"",
      
    },
    {
      parameter:"Temperature",
      value:'℃',
      name:'temperature',
      week:"",
      month:"",  
    },
    {
      parameter:"BOD",
      value:'mg/l',
      name:'BOD',
      week:"",
      month:"",  
    },
    {
      parameter:"COD",
      value:'mg/l',
      name:'COD',
      week:"",
      month:"",  
    },
    {
      parameter:"TSS",
      value:'mg/l',
      name:'TSS',
      week:"",
      month:"",  
    },
    {
      parameter:"ORP",
      value:'mV',
      name:'ORP',
      week:"",
      month:"",  
    },
    {
      parameter:"Nitrate",
      value:'mg/l',
      name:'nitrate',
      week:"",
      month:"",  
    },
    {
      parameter:"Ammonical Nitrogen",
      value:'mg/l',
      name:'ammonicalNitrogen',
      week:"",
      month:"",  
    },
    {
      parameter:"DO",
      value:'mg/l',
      name:'DO',
      week:"",
      month:"",  
    },
    {
      parameter:"Chloride",
      value:'mmol/l',
      name:'chloride',
      week:"",
      month:"",  
    },
    {
      parameter:"Colour",
      value:'color',
      name:'color',
      week:"",
      month:"",  
    },
  ]
 
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        {/* <!-- Page Title Header Starts--> */}
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">EFFLUENT/WATER DASHBOARD</h4>
              <p></p>
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
               <ul  className="quick-links ml-auto">
               <Link to={"/download-IoT-Data"}><button type="submit"  className="btn btn-primary mb-2 mt-2"> Download </button></Link>
               </ul>
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

          {/* {console.log(`Latest IoT with userName ${userData.validUserOne.userName}:`,latestData)} */}
          {water.map((item,index)=>(
          <div className="col-12 col-md-4 grid-margin"key={index}>
          <div className="card" onClick={() => handleCardClick(item.parameter)} >
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <h3 className="mb-3">{item.parameter}</h3>
                </div>
                <div className="col-12 mb-3">
                  <h6><strong className="strong-value">{userIotData[item.name] || 'N/A'}</strong> {item.value}   </h6>
                 
                 
                </div>

                <div className="col-12">
                  <h5 className="text-dark">Average</h5>
                  <p className="mb-0">Last Week: {weekData.length > 0 ? weekData[0][item.name] : 'N/A'} </p>
                  <p>Last Month:{weekData.length > 0 ? weekData[0][item.name] : 'N/A'} </p>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer/>
          </div>
          ))}
         

        </div>

      </div>
      {/* Render Calibration Popup if showCalibrationPopup is true */}
      {showCalibrationPopup &&  (
        <CalibrationPopup 
        userName={userData.validUserOne.userName}
        onClose={handleCloseCalibrationPopup}
        
        />
      )}
      {/* Render Popup if showPopup is true */}
      {showPopup && selectedCard && (
        <WaterPopup
        title={selectedCard.title}
        weekData={weekData} // Pass actual week data here
        monthData={monthData} // Pass actual month data here
        dayData={dayData}
        sixMonthData={sixMonthData}
        yearData={yearData}
        onClose={handleClosePopup}
        />
      )}
        
      <CalibrationExceeded/>

 
      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
            Ebhoom Control and Monitor System
          </span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
            {" "}
            ©{" "}
            <a href="" target="_blank">
              Ebhoom Solutions LLP
            </a>{" "}
            2023
          </span>
        </div>
      </footer>
    </div>

  );
}

export default Water;

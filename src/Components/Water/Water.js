
import React, { createContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from 'axios'
import { Link } from 'react-router-dom';
import WaterPopup from "./WaterPopup";
import CalibrationPopup from "../Calibration/CalibrationPopup";

const Water = () => {

  const [showPopup,setShowPopup]=useState(false);
  const [selectedCard, setSelectedCard]=useState(null);
  const[showCalibrationPopup,setShowCalibrationPopup]=useState(false);

 // Sample data for demonstration, replace with your actual data
 const weekData = [{ name: "Mon", value: 30 }, { name: "Tue", value: 40 }, { name: "Wed", value: 50 }];
 const monthData = [{ name: "Week 1", value: 100 }, { name: "Week 2", value: 200 }, { name: "Week 3", value: 150 }];
 const dayData=[{ name: "9:00 am", value: 30 }, { name: "10:00am", value: 33 }, { name: "11:00am", value: 40 }, { name: "12:00pm", value: 41 }, { name: "1:00pm", value: 70 },{ name: "2:00pm", value: 54 },{ name: "3:00pm", value: 31 },{ name: "4:00pm", value: 31.2 }];
 const sixMonthData=[{ name: "Jan-June", value: 30 }, { name: "July-December", value: 40 }];
 const yearData=[{ name: "2021", value: 20 }, { name: "2022", value: 90 }, { name: "2023", value: 30 }, { name: "2024", value: 50 }];

 
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
  const water=[
    {
      parameter:"PH level",
      value:'pH',
      week:":",
      month:":",
      
    },
    {
      parameter:"TDS",
      value:'mg/l',
      week:"",
      month:"",
    },
    {
      parameter:"Turbidity",
      value:'NTU',
      week:"",
      month:"",
      
    },
    {
      parameter:"Temperature",
      value:'℃',
      week:"",
      month:"",  
    },
    {
      parameter:"BOD",
      value:'mg/l',
      week:"",
      month:"",  
    },
    {
      parameter:"COD",
      value:'mg/l',
      week:"",
      month:"",  
    },
    {
      parameter:"TSS",
      value:'mg/l',
      week:"",
      month:"",  
    },
    {
      parameter:"ORP",
      value:'mV',
      week:"",
      month:"",  
    },
    {
      parameter:"Nitrate",
      value:'mg/l',
      week:"",
      month:"",  
    },
    {
      parameter:"Ammonical Nitrogen",
      value:'mg/l',
      week:"",
      month:"",  
    },
    {
      parameter:"DO",
      value:'mg/l',
      week:"",
      month:"",  
    },
    {
      parameter:"Chloride",
      value:'mmol/l',
      week:"",
      month:"",  
    },
    {
      parameter:"Colour",
      value:'color',
      week:"",
      month:"",  
    },
  ]
  const [validUserData, setValidUserData] = useState(null);

  useEffect(()=>{
    //Fetch product iD and user status when the component mounts
    
    const fetchData=async()=>{
      try{
          let token = localStorage.getItem("userdatatoken")
          const response =await axios.get('http://localhost:4444/api/validuser',{
            headers:{
              'Content-Type':"application/json",
              'Authorization':token,
              Accept:'application/json'
            },
            withCredentials: true
          })
          const data = response.data;
        console.log(data);

        if (data.status === 201) {
          // Update product ID and user status
          setValidUserData(data.validUserOne);
          console.log(data.validUserOne);
        } else {
          console.log("Error fetching user data");
        }
      }catch(error){
        console.error("Error fetching user data :", error);
      }
    }
    fetchData();
  },[])
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
                <h5>Data Interval: <span className="span-class">{validUserData && validUserData.dataInteval}</span></h5>

               </ul>
               <ul className="quick-links ml-auto">
               
                <button type="submit" onClick={handleOpenCalibrationPopup} className="btn btn-primary mb-2 mt-2"> Calibration </button>

               </ul>
             </div>
            </div>
          </div>
        </div>
        {/* <!-- Page Title Header Ends--> */}

        <div className="row">
          
         
          {water.map((item,index)=>(
          <div className="col-12 col-md-4 grid-margin"key={index}>
          <div className="card" onClick={() =>handleCardClick({ title: `${item.parameter}` })}>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <h3 className="mb-3">{item.parameter}</h3>
                </div>
                <div className="col-12 mb-3">
                  <h1>{item.value}</h1>
                  {/* <h4>Alkaline Water</h4> */}
                </div>

                <div className="col-12">
                  <h5 className="text-dark">Average</h5>
                  <p className="mb-0">Last Week: {item.week} </p>
                  <p>Last Month:{item.month} </p>
                </div>
              </div>
            </div>
          </div>
          </div>
          ))}
         

        </div>

      </div>
      {/* Render Calibration Popup if showCalibrationPopup is true */}
      {showCalibrationPopup &&  (
        <CalibrationPopup 
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
        {/* divider */}
        <div className="p-5"></div>
      <div className="p-5"></div>
      {/* divider */}

      <div className="col-md-12 grid-margin mt-5">
              <div className="card">
                <div className="card-body">
                <div className="row mt-5">
      <div className="col-md-12">
        <h2>Calibration Exceeded</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Exceeded Parameter</th>
                <th>Date</th>
                <th>Time</th>
                
                
                
              </tr>
            </thead>
            <tbody>
              <td>1</td>
              <td>ph 2.1</td>
              <td>31/03/2024</td>
              <td>07:17</td>
             
                
                
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
                </div>
                </div>
                </div>
 
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

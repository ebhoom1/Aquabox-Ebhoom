import React, { useEffect, useState } from "react";
import axios from "axios"
import './index.css'

const CalibrationPopup=({userName,onClose})=>{

    const [calibrationData,setCalibrationData] = useState(null);
    const deployed_url = 'https://aquabox-ebhoom-3.onrender.com'
    const url ='http://localhost:4444'

useEffect(()=>{
    const fetchCalibrationData = async ()=>{
        try{
            const response = await axios.get(`${deployed_url}/api/find-calibration-by-userId/${userName}`);
            const data = response.data
            if(data.success){
                setCalibrationData(data.calibration);
                
            }else{
                console.log("Error in fetching calibration Data");
                
            }
        }catch(error){
            console.error("Catch Error in fetchCalibrationData:",error);
           
        };
       
    }
    fetchCalibrationData();
},[userName])
    return(
        <div className="popup-container">
            <div className="popup">
                <button className="close-btn"onClick={onClose}>
                    <span className="icon-cross"></span>
                    <span className="visually-hidden">X</span>
                </button>
                <div className="calibration-details">
    <div className="card mb-3">
        <div className="card-body">
            <p className="card-text">Date:<strong> {calibrationData && calibrationData.date}</strong></p>
        </div>
    </div>
    <div className="card mb-3">
        <div className="card-body">
            <p className="card-text">User ID: <strong>{calibrationData && calibrationData.userName}</strong></p>
        </div>
    </div>
    <div className="card mb-3">
        <div className="card-body">
            <p className="card-text">Model Name: <strong>{calibrationData && calibrationData.equipmentName}</strong></p>
        </div>
    </div>
   
            <h1 className="card-title">Results</h1>
       
    <div className="card mb-3">
        <div className="card-body">
            <p className="card-text">Before: <strong>{calibrationData && calibrationData.before}</strong></p>
        </div>
    </div>
    <div className="card mb-3">
        <div className="card-body">
            <p className="card-text">After: <strong>{calibrationData && calibrationData.after}</strong></p>
        </div>
    </div>
</div>

            </div>     
        </div>
    )
}

export default CalibrationPopup;
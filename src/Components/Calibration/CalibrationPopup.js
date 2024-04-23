import React from "react";

const CalibrationPopup=({onClose})=>{
    
    return(
        <div className="popup-container">
            <div className="popup">
                <button className="close-btn"onClick={onClose}>
                    <span className="icon-cross"></span>
                    <span className="visually-hidden">X</span>
                </button>
                
                <p>Date:</p>
                <p>User Type</p>
                <p>Equipment Name</p>
                <h3>Results</h3>
                <p>Before</p>
                <p>after</p>
            </div>
        </div>
    )
}

export default CalibrationPopup;
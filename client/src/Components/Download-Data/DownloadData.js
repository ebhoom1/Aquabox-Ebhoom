import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const DownloadData=()=>{
  const [date, setDate] = useState("");
  const navigate = useNavigate();

    const industryType=[
        {
          category:"Sugar"
        },
        {
          category:"Cement"
        },
        {
          category:"Distillery"
        },
        {
          category:"Petrochemical"
        },
        {
          category:"Plup & Paper"
        },
        {
          category:"Fertilizer"
        },
        {
          category:"Tannery"
        },
        {
          category:"Pecticides"
        },
        {
          category:"Thermal Power Station"
        },
        {
          category:"Caustic Soda"
        },
        {
          category:"Pharmaceuticals"
        },
        {
          category:"Dye and Dye Stuff"
        },
        {
          category:"Refinery"
        },
        {
          category:"Copper Smelter"
        },
        {
          category:"Iron and Steel"
        },
        {
          category:"Zinc Smelter"
        },
        {
          category:"Aluminium"
        },
        {
          category:"STP/ETP"
        },
        {
          category:"NWMS/SWMS"
        },
        {
          category:"Noise"
        },
        {
          category:"Zinc Smelter"
        },
        {
          category:"Other"
        },
      
      ]
      const compName=[{name:"company A"},{name:"company B"},{name:"company C"}]
    
      const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/calibration-exceeded-report", { state: { date } });
      };
    return(
        <div className="row">
        <div className="col-12 col-md-12 grid-margin">
          <div className="col-12">
            <h1>Validate Data and Approve Data </h1>
          </div>
          <div className="card">
            <div className="card-body">
              <form target="_blank" method="post">
                <div className="row"> {/* Parent row */}
                  <div className="col-lg-6 col-md-6 mb-3"> {/* First column for Select Industry */}
                    <label htmlFor="exampleFormControlInput5">Select Industry </label>
                    <select className="input-field">
                      {industryType.map((item) => (
                        <option value={item.category}>{item.category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6 col-md-6 mb-3"> {/* Second column for Select Name */}
                    <label htmlFor="exampleFormControlInput5">Select Name </label>
                    <select className="input-field">
                      {compName.map((item) => (
                        <option value={item.name}>{item.name}</option>
                      ))}
                    </select>

                  </div>
                  <div className="col-lg-6 col-md-6 mb-3"> {/* Second column for Select Name */}
                    <label htmlFor="exampleFormControlInput5">Date </label>
                   
                    <input 
                      className="input-field"
                      type="date"
                    />
                    
                  </div>
                  <div className="col-lg-6 col-md-6 mb-3"> {/* Second column for Select Name */}
                    <label htmlFor="exampleFormControlInput5">Engineer Name </label>
                   
                    <input 
                      className="input-field"
                      type="text"
                    />
                    
                  </div>
                </div>
                <label htmlFor="exampleFormControlInput5">User</label>
                        <select id="pdid" className="input-field" >
                          
                            <option>oo</option>
                        
                        </select>
                        
                        <input type="hidden" name="auth" />
                        <input type="hidden" name="from"  />
                        <input type="hidden" name="to"  />
                        <button
                         type="submit" 
                         className="btn btn-primary mb-2 mt-2" 
                         onClick={handleSubmit}
                         > Check and Validate </button>
        </form>
      </div>
    </div>
  </div>
        </div>
    )
}

 export default DownloadData;
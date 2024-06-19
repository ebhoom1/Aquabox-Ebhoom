import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../utils/apiConfig';

const DownloadIoTdata = () => {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [industry, setIndustry] = useState("");
    const [company, setCompany] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get(`${API_URL}/api/getallusers`);
            const filteredUsers = response.data.users.filter(user => user.userType === "user");
            setUsers(filteredUsers);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        };
    
        fetchUsers();
      }, []);
    

    const industryType = [
        { category: "Sugar" },
        { category: "Cement" },
        { category: "Distillery" },
        { category: "Petrochemical" },
        { category: "Plup & Paper" },
        { category: "Fertilizer" },
        { category: "Tannery" },
        { category: "Pecticides" },
        { category: "Thermal Power Station" },
        { category: "Caustic Soda" },
        { category: "Pharmaceuticals" },
        { category: "Dye and Dye Stuff" },
        { category: "Refinery" },
        { category: "Copper Smelter" },
        { category: "Iron and Steel" },
        { category: "Zinc Smelter" },
        { category: "Aluminium" },
        { category: "STP/ETP" },
        { category: "NWMS/SWMS" },
        { category: "Noise" },
        { category: "Zinc Smelter" },
        { category: "Other" },
      ];
  return (
    <div className="row">
    <div className="col-12 col-md-12 grid-margin">
      <div className="col-12">
        <h1>Download IoT Data</h1>
      </div>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-lg-6 col-md-6 mb-3">
                <label>Select Industry</label>
                <select className="input-field" onChange={(e) => setIndustry(e.target.value)}>
                <option >select</option>
                  {industryType.map((item) => (
                    <option key={item.category} value={item.category}>
                      {item.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-6 col-md-6 mb-3">
                <label>Select Company</label>
                <select className="input-field" onChange={(e) => setCompany(e.target.value)}>
                <option >select</option>
                  {users.map((item) => (
                    <option key={item.companyName} value={item.companyName}>
                      {item.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-6 col-md-6 mb-3">
                <label>From Date</label>
                <input className="input-field" type="date" onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="col-lg-6 col-md-6 mb-3">
                <label>To Date</label>
                <input className="input-field" type="date" onChange={(e) => setDateTo(e.target.value)} />
              </div>
             
            </div>
            <select className="btn btn-success" >
                             <option>Download</option>
                             <option value="pdf">PDF</option>
                             <option value="csv">CSV</option>
                            </select>          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default DownloadIoTdata

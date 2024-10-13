import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/apiConfig";
import { useDispatch } from 'react-redux';
import { fetchStackNameByUserName } from '../../redux/features/userLog/userLogSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ValidateData = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [industry, setIndustry] = useState("");
  const [company, setCompany] = useState("");
  const [userName, setUserName] = useState("");
  const [stackName, setStackName] = useState("");
  const [users, setUsers] = useState([]);
  const [stackOptions, setStackOptions] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();

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
    { category: "Other" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getallusers`);
        const filteredUsers = response.data.users.filter(
          (user) => user.userType === "user"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchStackOptions = async () => {
      if (!userName) return; // Ensure userName is selected

      try {
        const resultAction = await dispatch(fetchStackNameByUserName(userName));
        console.log('Result Action:', resultAction);

        if (fetchStackNameByUserName.fulfilled.match(resultAction)) {
          const stackNames = resultAction.payload;
          console.log('Fetched Stack Names:', stackNames);
          setStackOptions(stackNames || []);
        } else {
          console.error('Failed to fetch stack names:', resultAction.error);
          toast.error('No Stack Name found for this User.');
        }
      } catch (error) {
        console.error('Error fetching stack names:', error);
        toast.error('Failed to fetch stack names.');
      }
    };
    fetchStackOptions();
  }, [userName, dispatch]);

  // Helper function to format date to 'dd-mm-yyyy'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!industry || !company || !userName || !stackName || !dateFrom || !dateTo) {
      toast.error('Please fill all the fields.');
      return;
    }

    // Validate if fromDate and toDate are the same
    if (dateFrom === dateTo) {
      toast.error('From Date and To Date cannot be the same.');
      return;
    }

    // Format the dates before navigating
    const formattedDateFrom = formatDate(dateFrom);
    const formattedDateTo = formatDate(dateTo);

    navigate("/calibration-exceeded-report", {
      state: {
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo,
        industry,
        company,
        userName,
        stackName,
      },
    });
  };

  return (
    <div className="row">
      <div className="col-12 col-md-12 grid-margin">
        <div className="col-12">
          <h1>Validate Data and Approve Data</h1>
        </div>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6 col-md-6 mb-3">
                  <label>Select Industry</label>
                  <select
                    className="input-field"
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option>select</option>
                    {industryType.map((item) => (
                      <option key={item.category} value={item.category}>
                        {item.category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-6 col-md-6 mb-3">
                  <label>Select Company</label>
                  <select
                    className="input-field"
                    onChange={(e) => setCompany(e.target.value)}
                  >
                    <option>select</option>
                    {users.map((item) => (
                      <option key={item.companyName} value={item.companyName}>
                        {item.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-6 col-md-6 mb-3">
                  <label>From Date</label>
                 
                  <input
                    className="input-field"
                    type="date"
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="col-lg-6 col-md-6 mb-3">
                  <label>To Date</label>
                  
                  <input
                    className="input-field"
                    type="date"
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                <div className="col-lg-6 col-md-6 mb-3">
                  <label>User</label>
                  <select
                    className="input-field"
                    onChange={(e) => setUserName(e.target.value)}
                  >
                    <option>select</option>
                    {users.map((item) => (
                      <option key={item.userName} value={item.userName}>
                        {item.userName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-6 col-md-6 mb-3">
                  <label>Stack Name</label>
                  <select
                    className="input-field"
                    onChange={(e) => setStackName(e.target.value)}
                  >
                    <option>select</option>
                    {stackOptions.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mb-2 mt-2">
                Check and Validate
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ValidateData;

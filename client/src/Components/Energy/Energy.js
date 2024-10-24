import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../utils/apiConfig";
import EnergyDataModal from "./EnergyDataModal";

// Extract unique headers (dates or hours)
const extractHeaders = (data, viewType) => {
  const headers = new Set();
  data.forEach((item) => {
    const formatted = viewType === "daily" ? item.date : item.time;
    headers.add(formatted);
  });
  return Array.from(headers);
};

// Group data by stackName to prevent duplication
const groupDataByStackName = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    if (!groupedData[item.stackName]) {
      groupedData[item.stackName] = [];
    }
    groupedData[item.stackName].push(item);
  });
  return groupedData;
};

const Energy = () => {
  const { userData, userType } = useSelector((state) => state.user);
  const { searchTerm } = useOutletContext();

  const [differenceData, setDifferenceData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [viewType, setViewType] = useState("daily");
  const [error, setError] = useState(null);
  const [energyStacks, setEnergyStacks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const currentUserName = userType === "admin" ? "KSPCB001" : userData?.validUserOne?.userName;

  const fetchEnergyStacks = async (userName) => {
    try {
      const response = await fetch(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
      const data = await response.json();
      const stacks = data.stackNames
        .filter((stack) => stack.stationType === "energy")
        .map((stack) => stack.name);
      setEnergyStacks(stacks);
    } catch (error) {
      console.error("Error fetching energy stacks:", error);
    }
  };

  const fetchDifferenceData = async (userName) => {
    try {
      const response = await axios.get(`${API_URL}/api/differenceByUserName/${userName}`);
      const { data } = response;
      if (data && data.success) {
        const allData = viewType === "daily" ? data.data.daily : data.data.hourly;
        const filteredData = allData.filter((item) => energyStacks.includes(item.stackName));
        setDifferenceData(filteredData);
      } else {
        toast.error("Difference data not found");
        setDifferenceData([]);
      }
    } catch (error) {
      console.error("Error fetching difference data:", error);
      setError("Failed to fetch difference data.");
      toast.error("Failed to fetch difference data.");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchEnergyStacks(searchTerm);
      fetchDifferenceData(searchTerm);
    } else {
      fetchEnergyStacks(currentUserName);
      fetchDifferenceData(currentUserName);
    }
  }, [searchTerm, currentUserName, viewType]);

  useEffect(() => {
    if (differenceData.length) {
      const uniqueHeaders = extractHeaders(differenceData, viewType);
      setHeaders(uniqueHeaders);
    } else {
      setHeaders([]);
    }
  }, [differenceData, viewType]);

  const groupedData = groupDataByStackName(differenceData);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h2>Energy Flow</h2>
          {error && <p className="text-danger">{error}</p>}

          <div className="mb-3 d-flex justify-content-between">
            <div>
              <button
                className={`btn ${viewType === "daily" ? "btn-primary" : "btn-outline-primary"} mr-2`}
                onClick={() => setViewType("daily")}
              >
                Daily View
              </button>
              <button
                className={`btn ${viewType === "hourly" ? "btn-primary" : "btn-outline-primary"} mr-2`}
                onClick={() => setViewType("hourly")}
              >
                Hourly View
              </button>
            </div>
            <button className="btn btn-success" onClick={() => setModalOpen(true)}>
              View
            </button>
          </div>

          <div className="table-responsive mt-3" style={{ overflowX: "auto" }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>SL. NO</th>
                  <th>Stack Name</th>
                  <th>Acceptables</th>
                  {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedData).map(([stackName, records], stackIndex) => (
                  <React.Fragment key={stackIndex}>
                    <tr>
                      <td rowSpan={3}>{stackIndex + 1}</td>
                      <td rowSpan={3}>{stackName}</td>
                      <td>Initial Energy</td>
                      {headers.map((header, index) => (
                        <td key={index}>
                          {records.find((item) => item.date === header || item.time === header)?.initialEnergy || "N/A"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Last Energy</td>
                      {headers.map((header, index) => (
                        <td key={index}>
                          {records.find((item) => item.date === header || item.time === header)?.lastEnergy || "N/A"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Energy Difference</td>
                      {headers.map((header, index) => (
                        <td key={index}>
                          {records.find((item) => item.date === header || item.time === header)?.energyDifference || "N/A"}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <ToastContainer />
        </div>
        <EnergyDataModal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)} />
      </div>
    </>
  );
};

export default Energy;

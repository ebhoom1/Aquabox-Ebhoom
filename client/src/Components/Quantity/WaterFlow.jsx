import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../utils/apiConfig";
import EnergyDataModal from "../Energy/EnergyDataModal";

// Extract unique headers (dates or hours)
const extractHeaders = (data, viewType) => {
  const headers = new Set();
  data.forEach((item) => {
    const formatted = viewType === "daily" ? item.date : item.time;
    headers.add(formatted);
  });
  return Array.from(headers);
};

const WaterFlow = () => {
  const { userData, userType } = useSelector((state) => state.user);
  const { searchTerm } = useOutletContext();

  const [differenceData, setDifferenceData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [viewType, setViewType] = useState("daily");
  const [error, setError] = useState(null);
  const [waterStacks, setWaterStacks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const currentUserName = userType === "admin" ? "KSPCB001" : userData?.validUserOne?.userName;

  // Fetch water stacks (stationType === 'effluent_flow')
  const fetchWaterStacks = async (userName) => {
    try {
      const response = await axios.get(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
      const data = response.data;
      const stacks = data.stackNames
        .filter(stack => stack.stationType === 'effluent_flow')
        .map(stack => stack.name);
      setWaterStacks(stacks);
      return stacks;
    } catch (error) {
      console.error("Error fetching water stacks:", error);
    }
  };

  // Fetch difference data
  const fetchDifferenceData = async (userName, stacks) => {
    try {
      const response = await axios.get(`${API_URL}/api/differenceByUserName/${userName}`);
      const { data } = response;

      if (data && data.success) {
        const allData = viewType === "daily" ? data.data.daily : data.data.hourly;
        const filteredData = allData.filter(item => stacks.includes(item.stackName));
        setDifferenceData(filteredData);
        setSearchResult(userName);
      } else {
        setDifferenceData([]);
      }
    } catch (error) {
      console.error("Error fetching difference data:", error);
      setError("Failed to fetch difference data.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const stacks = await fetchWaterStacks(searchTerm || currentUserName);
      if (stacks) {
        fetchDifferenceData(searchTerm || currentUserName, stacks);
      }
    };
    fetchData();
  }, [searchTerm, currentUserName, viewType]);

  useEffect(() => {
    if (differenceData.length) {
      const uniqueHeaders = extractHeaders(differenceData, viewType);
      setHeaders(uniqueHeaders);
    } else {
      setHeaders([]);
    }
  }, [differenceData, viewType]);

  const getDataForHeader = (header) => {
    return differenceData.filter(data =>
      viewType === "daily" ? data.date === header : data.time === header
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2>Water Flow</h2>
        {error && <p className="text-danger">{error}</p>}

        {/* Toggle buttons for Daily and Hourly views */}
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

        <div className="table-responsive mt-3">
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
              {waterStacks.map((stackName, stackIndex) => (
                <React.Fragment key={stackIndex}>
                  <tr>
                    <td rowSpan={6}>{stackIndex + 1}</td>
                    <td rowSpan={6}>{stackName}</td>
                    <td>Initial Inflow</td>
                    {headers.map((header, index) => (
                      <td key={index}>
                        {getDataForHeader(header).find(item => item.stackName === stackName)?.initialInflow || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Last Inflow</td>
                    {headers.map((header, index) => (
                      <td key={index}>
                        {getDataForHeader(header).find(item => item.stackName === stackName)?.lastInflow || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Inflow Difference</td>
                    {headers.map((header, index) => (
                      <td key={index}>
                        {getDataForHeader(header).find(item => item.stackName === stackName)?.inflowDifference || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Initial Final Flow</td>
                    {headers.map((header, index) => (
                      <td key={index}>
                        {getDataForHeader(header).find(item => item.stackName === stackName)?.initialFinalFlow || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Last Final Flow</td>
                    {headers.map((header, index) => (
                      <td key={index}>
                        {getDataForHeader(header).find(item => item.stackName === stackName)?.lastFinalFlow || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Final Flow Difference</td>
                    {headers.map((header, index) => (
                      <td key={index}>
                        {getDataForHeader(header).find(item => item.stackName === stackName)?.finalFlowDifference || "N/A"}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      <EnergyDataModal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)} />

    </div>
  );
};

export default WaterFlow;

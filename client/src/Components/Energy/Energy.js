// EnergyFlow.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDifferenceDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to generate dynamic dates
const generateDates = (startDate, numberOfDays) => {
  const dates = [];
  const start = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    const formattedDate = currentDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    dates.push(formattedDate);
  }

  return dates;
};

const Energy = ({ searchTerm, userData, userType }) => {
  const dispatch = useDispatch();
  const { differenceData } = useSelector((state) => state.iotData);
  const [datesHeaders, setDatesHeaders] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    // Generate date headers dynamically
    const startDate = "2024-07-08";
    const numberOfDays = 10;
    const dates = generateDates(startDate, numberOfDays);
    setDatesHeaders(dates);
  }, []);

  useEffect(() => {
    const fetchData = async (userName) => {
      try {
        await dispatch(fetchDifferenceDataByUserName(userName)).unwrap();
        console.log("Difference data fetched:", differenceData); // Debugging line
        setSearchResult(userName);
        setSearchError("");
      } catch (error) {
        toast.error("Difference data is not found");
        setSearchResult(null);
        setSearchError("No result found for this userID");
      }
    };

    if (searchTerm) {
      fetchData(searchTerm);
    } else if (userData && userType === "user") {
      fetchData(userData.validUserOne.userName);
    }
  }, [searchTerm, userData, userType, dispatch]);

  return (
    <div className="card">
      <div className="card-body">
        <h2>Energy Flow</h2>
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Parameter</th>
                <th>Acceptable <br /> Limits</th>
                {datesHeaders.map((date, index) => (
                  <th key={index}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={4}>1</td>
                <td rowSpan={4}>FL-Inlet raw sewage, KLD</td>
                <td>Initial Flow</td>
                {differenceData && differenceData.length > 0 ? (
                  differenceData.map((data, index) => (
                    <td key={index}>{data.initialEnergy || "N/A"}</td>
                  ))
                ) : (
                  <td colSpan={datesHeaders.length}>No Initial Flow Data</td>
                )}
              </tr>
              <tr>
                <td>Final Flow</td>
                {differenceData && differenceData.length > 0 ? (
                  differenceData.map((data, index) => (
                    <td key={index}>{data.finalEnergy || "N/A"}</td>
                  ))
                ) : (
                  <td colSpan={datesHeaders.length}>No Final Flow Data</td>
                )}
              </tr>
              <tr>
                <td>Energy Difference</td>
                {differenceData && differenceData.length > 0 ? (
                  differenceData.map((data, index) => (
                    <td key={index}>{data.energyDifference || "N/A"}</td>
                  ))
                ) : (
                  <td colSpan={datesHeaders.length}>No Energy Difference Data</td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Energy;

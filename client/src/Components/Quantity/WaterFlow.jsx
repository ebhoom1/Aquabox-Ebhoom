// WaterFlow.jsx
import React, { useEffect, useState } from "react";
import { fetchDifferenceDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { useDispatch, useSelector } from "react-redux";
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

const WaterFlow = ({ searchTerm, userData, userType }) => {
  const dispatch = useDispatch();
  const { differenceData } = useSelector((state) => state.iotData);
  const [datesHeaders, setDatesHeaders] = useState([]);

  useEffect(() => {
    // Generate date headers dynamically
    const startDate = "2024-07-08";
    const numberOfDays = 10;
    setDatesHeaders(generateDates(startDate, numberOfDays));
  }, []);

  useEffect(() => {
    const fetchData = async (userName) => {
      try {
        await dispatch(fetchDifferenceDataByUserName(userName)).unwrap();
      } catch (error) {
        toast.error("Failed to fetch difference data.");
      }
    };

    if (searchTerm) {
      fetchData(searchTerm);
    } else if (userData && userType === "user") {
      fetchData(userData.validUserOne.userName);
    }
  }, [searchTerm, userData, userType, dispatch]);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2>Water Flow</h2>
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Parameter</th>
                <th>Flow Type</th>
                {datesHeaders.map((date, index) => (
                  <th key={index} className="text-center">{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>FL-Inlet raw sewage, KLD</td>
                <td>Inflow</td>
                {datesHeaders.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    {differenceData?.inflowData?.[date] || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Final Flow</td>
                {datesHeaders.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    {differenceData?.finalflowData?.[date] || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Difference</td>
                {datesHeaders.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    {differenceData?.difference?.[date] || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td rowSpan={3}>2</td>
                <td rowSpan={3}>Treated Water, KLD</td>
                <td>Inflow</td>
                {datesHeaders.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    {differenceData?.treatedInflow?.[date] || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Final Flow</td>
                {datesHeaders.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    {differenceData?.treatedFinalflow?.[date] || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Difference</td>
                {datesHeaders.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    {differenceData?.treatedDifference?.[date] || "N/A"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default WaterFlow;

import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
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

const WaterFlow = ({ differenceData }) => {
  const [datesHeaders, setDatesHeaders] = useState([]);

  useEffect(() => {
    // Generate date headers dynamically (you can customize the start date and the number of days)
    const startDate = "2024-07-08"; // Example start date
    const numberOfDays = 10; // Example number of days
    const dates = generateDates(startDate, numberOfDays);
    setDatesHeaders(dates);
  }, []);

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
                <th>Flow</th>
                {datesHeaders.map((date, index) => (
                  <th key={index}>{date}</th>
                ))}
               
               
              </tr>
            </thead>
            <tbody>
              {Array.isArray(differenceData) && differenceData.length > 0 ? (
                differenceData.map((data, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td rowSpan={2}>{index + 1}</td>
                      <td>FL-Inlet raw sewage, KLD</td>
                      <td>{data.inflowDifference}</td>
                      {/* Dynamically populate date-related data for Inflow Difference */}
                      {datesHeaders.map((date, dateIndex) => (
                        <td key={dateIndex}>{data.inflowData?.[date] || "N/A"}</td>
                      ))}
                    
                      <td></td>
                    </tr>
                    <tr>
                      <td>FL-Treated Water, KLD</td>
                      <td>{data.finalflowDifference}</td>
                      {/* Dynamically populate date-related data for Final Flow Difference */}
                      {datesHeaders.map((date, dateIndex) => (
                        <td key={dateIndex}>{data.finalflowData?.[date] || "N/A"}</td>
                      ))}
                      <td></td>
                     
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={datesHeaders.length + 5} className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default WaterFlow;

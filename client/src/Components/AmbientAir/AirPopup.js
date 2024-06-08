import './index.css';
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";


const AirPopup = ({ title, weekData, monthData,dayData, sixMonthData ,yearData, onClose }) => {
  const [selectedView, setSelectedView] = useState("week");
  const [heading, setHeading] = useState("Week");
  const handleViewChange = (view) => {
    setSelectedView(view);
    setHeading(getHeading(view));
  };
const getHeading=(view)=>{
  switch (view) {
    case "week":
      return "Week";
    case "month":
      return "Month";
    case "day":
      return "Day";
    case "sixMonth":
      return "Six Months";
    case "year":
      return "Year";
    default:
      return "";
  }
}
const renderData = () => {
  switch (selectedView) {
    case "week":
      return weekData;
    case "month":
      return monthData;
    case "day":
      return dayData;
    case "sixMonth":
      return sixMonthData;
    case "year":
      return yearData;
    default:
      return [];
  }
};

  return (
    <div className="popup-container">
      <div className="popup">
      <button className="close-btn" onClick={onClose}>
      <span class="icon-cross"></span>
      <span class="visually-hidden">X</span>
        </button>
        <h2>{title}</h2>
        <h3>{heading}</h3>
        <div className="btn-group">
        <button
            className="indicator"
            onClick={() => handleViewChange("day")}
          >
           1D
          </button>
          <button
            className="indicator"
            onClick={() => handleViewChange("week")}
          >
            5D
          </button>
          <button
           className="indicator"
            onClick={() => handleViewChange("month")}
          >
            1M
          </button>
          <button
           className="indicator"
            onClick={() => handleViewChange("sixMonth")}
          >
            6M
          </button>
          <button
           className="indicator"
            onClick={() => handleViewChange("year")}
          >
            1Y
          </button>
         
        </div>
        
        
        <div className="graph">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={renderData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" fill="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
      </div>
    </div>
  );
};

export default AirPopup;

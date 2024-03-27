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
} from "recharts";

const Popup = ({ title, weekData, monthData, onClose }) => {
  const [selectedView, setSelectedView] = useState("week");

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>{title}</h2>
        <div className="graph">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedView === "week" ? weekData : monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="btn-group">
          <button
            className={selectedView === "week" ? "active" : ""}
            onClick={() => handleViewChange("week")}
          >
            Week
          </button>
          <button
            className={selectedView === "month" ? "active" : ""}
            onClick={() => handleViewChange("month")}
          >
            Month
          </button>
        </div>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;

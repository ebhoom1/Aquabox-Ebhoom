import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ToastContainer } from 'react-toastify';

const TotalSewageGraph = ({ averageData, handleIntervalChange, interval, formatXAxis }) => {
  return (
    <div className="card mt-4 mb-5">
      <div className="card-body">
        <h2 className="m-3">Total FL Sewage Graph</h2>
        <div className="btn-group" role="group">
          <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('hour')}>Hour</button>
          <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('day')}>Day</button>
          <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('week')}>Week</button>
          <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('month')}>Month</button>
          <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('sixmonth')}>Six Months</button>
          <button type="button" className="btn btn-primary" onClick={() => handleIntervalChange('year')}>Year</button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={averageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="inflow" fill="#8884d8" />
            <Bar dataKey="finalflow" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TotalSewageGraph;

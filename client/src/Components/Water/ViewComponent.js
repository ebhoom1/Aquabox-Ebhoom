import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewComponent = () => {
  const location = useLocation();
  const { data, fromDate, toDate } = location.state || {};

  console.log('Data received:', data);
  console.log('From Date:', fromDate);
  console.log('To Date:', toDate);

  // Function to extract and format the date and time from a timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${String(date.getUTCDate()).padStart(2, '0')}/${String(
      date.getUTCMonth() + 1
    ).padStart(2, '0')}/${date.getUTCFullYear()}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(
      date.getUTCMinutes()
    ).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
  };

  // Filter out the _id field from stackData
  const filterStackData = (stack) => {
    const { _id, ...filteredData } = stack;
    return filteredData;
  };

  // Render the component
  return (
    <div className='container-fluid'>
      <h4>From Date: {fromDate}</h4>
      <h4>To Date: {toDate}</h4>

      {typeof data === 'object' && data !== null ? (
        Array.isArray(data) ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  {Object.keys(filterStackData(data[0]?.stackData[0]) || {}).map(
                    (stackKey) => (
                      <th key={stackKey}>{stackKey}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) =>
                  item.stackData.map((stack, stackIndex) => (
                    <tr key={`${index}-${stackIndex}`}>
                      <td>{formatDate(item.timestamp)}</td>
                      <td>{formatTime(item.timestamp)}</td>
                      {Object.values(filterStackData(stack)).map((value, i) => (
                        <td key={`${stackIndex}-${i}`}>{value}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  {Object.keys(filterStackData(data.stackData[0]) || {}).map(
                    (stackKey) => (
                      <th key={stackKey}>{stackKey}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data.stackData.map((stack, stackIndex) => (
                  <tr key={stackIndex}>
                    <td>{formatDate(data.timestamp)}</td>
                    <td>{formatTime(data.timestamp)}</td>
                    {Object.values(filterStackData(stack)).map((value, i) => (
                      <td key={`${stackIndex}-${i}`}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <p>No data available or data is in an unexpected format.</p>
      )}
    </div>
  );
};

export default ViewComponent;

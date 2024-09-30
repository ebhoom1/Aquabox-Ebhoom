import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewComponent = () => {
  const location = useLocation();
  const { data, fromDate, toDate } = location.state || {};

  console.log('Data received:', data);
  console.log('From Date:', fromDate);
  console.log('To Date:', toDate);
  console.log('Type of data:', typeof data);  // Log the type of data

  // Fields to exclude
  const fieldsToExclude = [
    '_id', 
    'product_id', 
    'userName', 
    'companyName', 
    'email', 
    'mobileNumber', 
    'validationStatus', 
    'validationMessage', 
    'timestamp', // Ensure this is included
    '__v',
    'industryType'
  ];

  // Function to check if a key should be excluded
  const shouldExclude = (key) => fieldsToExclude.includes(key);

  // Function to get date fields and non-date fields
  const getOrderedFields = (item) => {
    const dateFields = Object.keys(item).filter(key => key.toLowerCase().includes('date') || key.toLowerCase().includes('time'));
    const nonDateFields = Object.keys(item).filter(key => !shouldExclude(key) && !dateFields.includes(key));
    return [...dateFields, ...nonDateFields];
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
                  {getOrderedFields(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {getOrderedFields(item).map((key, i) => (
                      <td key={i}>{JSON.stringify(item[key], null, 2)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  {getOrderedFields(data).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {getOrderedFields(data).map((key, index) => (
                    <td key={index}>{JSON.stringify(data[key], null, 2)}</td>
                  ))}
                </tr>
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

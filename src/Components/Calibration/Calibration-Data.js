import React from "react";

const CalibrationData = () => {
  // Sample previous calibration data, replace with your actual data
  const previousCalibrations = [
    { date: "2022-01-01", userType: "Ambient Air", userNumber: "User 1", equipmentName: "Equipment 1", before: "Data before calibration", after: "Data after calibration", technician: "Technician 1", notes: "Notes 1" },
    { date: "2022-02-01", userType: "Effluent/Water", userNumber: "User 2", equipmentName: "Equipment 2", before: "Data before calibration", after: "Data after calibration", technician: "Technician 2", notes: "Notes 2" },
    // Add more previous calibration data as needed
  ];

  return (
    <div className="row mt-5">
      <div className="col-md-12">
        <h2>Previous Calibration Data</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date of Calibration</th>
                <th>User Type</th>
                <th>User Number</th>
                <th>Equipment Name</th>
                <th>Before</th>
                <th>After</th>
                <th>Technician</th>
                <th>Notes</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {previousCalibrations.map((calibration, index) => (
                <tr key={index}>
                  <td>{calibration.date}</td>
                  <td>{calibration.userType}</td>
                  <td>{calibration.userNumber}</td>
                  <td>{calibration.equipmentName}</td>
                  <td>{calibration.before}</td>
                  <td>{calibration.after}</td>
                  <td>{calibration.technician}</td>
                  <td>{calibration.notes}</td>
                  <td> <button type="button"  className="btn btn-danger mb-2"> Delete </button></td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalibrationData;

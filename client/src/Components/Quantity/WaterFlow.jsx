import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDifferenceDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to extract unique dates from the difference data
const extractUniqueDates = (data) => {
  const uniqueDates = new Set();
  data.forEach((item) => {
    const formattedDate = item.date.split('/').reverse().join('-'); // Assuming the date is in 'DD/MM/YYYY'
    uniqueDates.add(formattedDate);
  });
  return Array.from(uniqueDates).map(date => ({
    original: date,
    formatted: new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  }));
};

const WaterFlow = ({ searchTerm, userData, userType }) => {
  const dispatch = useDispatch();
  const { differenceData, error } = useSelector((state) => state.iotData);
  const [datesHeaders, setDatesHeaders] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (differenceData && Array.isArray(differenceData)) {
      const uniqueDates = extractUniqueDates(differenceData);
      setDatesHeaders(uniqueDates);
    }
  }, [differenceData]);

  useEffect(() => {
    const fetchData = async (userName) => {
      try {
        await dispatch(fetchDifferenceDataByUserName(userName)).unwrap();
        setSearchResult(userName);
      } catch {
        toast.error("Difference data is not found");
        setSearchResult(null);
      }
    };

    if (searchTerm) fetchData(searchTerm);
    else if (userData && userType === "user") fetchData(userData.validUserOne.userName);
  }, [searchTerm, userData, userType, dispatch]);

  const getDataForDate = (date) => {
    if (!differenceData || !Array.isArray(differenceData)) {
      return {}; // Return an empty object if the data is not available
    }

    const formatDifferenceDataDate = (dateString) => {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const data = differenceData.find(
      (data) => formatDifferenceDataDate(data.date) === date.original
    );

    return data || {};
  };

  // Filter datesHeaders to show only those with corresponding data
  const filteredDates = datesHeaders.filter(date => {
    const dataForDate = getDataForDate(date);
    // Check if the date has any of the required data fields
    return dataForDate.initialEnergy || dataForDate.finalEnergy || dataForDate.energyDifference;
  });

  return (
    <div className="card">
      <div className="card-body">
        <h2>Water Flow</h2>
        {error && <p className="text-danger">{error}</p>}
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Parameter</th>
                <th>Acceptable <br /> Limits</th>
                {filteredDates.map((date, index) => (
                  <th key={index}>{date.formatted}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>FL-Inlet raw sewage, KLD</td>
                <td>Initial Flow</td>
                {filteredDates.map((date, index) => (
                  <td key={index}>{getDataForDate(date).initialEnergy || "N/A"}</td>
                ))}
              </tr>
              <tr>
                <td>Final Flow</td>
                {filteredDates.map((date, index) => (
                  <td key={index}>{getDataForDate(date).finalEnergy || "N/A"}</td>
                ))}
              </tr>
              <tr>
                <td>Energy Difference</td>
                {filteredDates.map((date, index) => (
                  <td key={index}>{getDataForDate(date).energyDifference || "N/A"}</td>
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

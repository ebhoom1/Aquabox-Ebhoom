import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAverageDataByUserName, fetchDifferenceDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { useOutletContext } from 'react-router-dom';
import WaterFlow from "./WaterFlow";
import TotalSewageGraph from "./TotalSewageGraph";

const Quantity = () => {
  const dispatch = useDispatch();
  const { userData, userType } = useSelector((state) => state.user);
  const { averageData, differenceData } = useSelector((state) => state.iotData);
  const [interval, setInterval] = useState("year");
  const { searchTerm } = useOutletContext();
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchData = async (userName) => {
      try {
        await dispatch(fetchAverageDataByUserName({ userName, interval })).unwrap();
      } catch {
        console.error("Error fetching average data");
      }

      try {
        await dispatch(fetchDifferenceDataByUserName(userName)).unwrap();
        setSearchResult(userName);
      } catch {
        console.error("Error fetching difference data");
      }
    };

    if (searchTerm) {
      fetchData(searchTerm);
    } else if (userData && userType === 'user') {
      fetchData(userData.validUserOne.userName);
    }
  }, [searchTerm, userData, userType, interval, dispatch]);

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    if (searchResult) {
      dispatch(fetchAverageDataByUserName({ userName: searchResult, interval: newInterval }));
    }
  };

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    if (interval === "hour") {
      return date.toLocaleTimeString();
    } else if (interval === "day") {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (interval === "week" || interval === "sixmonth") {
      return date.toLocaleDateString();
    } else if (interval === "month") {
      return date.toLocaleString('en-US', { month: 'short' });
    } else if (interval === "year") {
      return date.getFullYear();
    }
    return tickItem;
  };

  return (
    <div className="quantity-layout col-lg-12">
      <WaterFlow differenceData={differenceData} />
      <TotalSewageGraph
        averageData={averageData}
        handleIntervalChange={handleIntervalChange}
        interval={interval}
        formatXAxis={formatXAxis}
      />
    </div>
  );
};

export default Quantity;

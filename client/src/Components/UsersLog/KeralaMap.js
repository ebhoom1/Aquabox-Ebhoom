import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestIotData } from "../../redux/features/iotData/iotDataSlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const KeralaMap = ({ users }) => {
  const dispatch = useDispatch();
  const latestIotData = useSelector((state) => state.iotData.latestData);
  const [selectedUser, setSelectedUser] = useState(null);

  const defaultPosition = [10.8505, 76.2711]; // Center position of Kerala

  const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const handleMarkerClick = (user) => {
    setSelectedUser(user.userName);
    dispatch(fetchLatestIotData(user.userName));
  };

  // Fields to be excluded from the display
  const excludedFields = [
    "_id",
    "product_id",
    "userName",
    "companyName",
    "industryType",
    "mobileNumber",
    "email",
    "time",
    "date",
    "topic",
    "validationStatus",
    "validationMessage",
    "timestamp",
    "__v"
  ];

  return (
    <MapContainer center={defaultPosition} zoom={7} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.ebhoom.com/">Ebhoom Solutions</a> contributors'
      />
      {users
        .filter(user => user.userType === "user")  // Only show users with userType "user"
        .map((user) => {
          const userIoT = selectedUser === user.userName ? latestIotData : null;
          const isHealthy = userIoT && userIoT.validationStatus === "Valid";
          const analyzerHealth = userIoT && userIoT.validationMessage ? userIoT.validationMessage : isHealthy ? "Good" : "Problem";

          return (
            <Marker
              key={user._id}
              position={[user.latitude, user.longitude]}
              icon={isHealthy ? greenIcon : redIcon}
              eventHandlers={{
                click: () => handleMarkerClick(user),
              }}
            >
              <Popup>
                <div>
                  <h5>User ID: {user.userName}</h5>
                  <p>Company Name: <strong>{user.companyName}</strong></p>
                  <p>Model Name: <strong>{user.modelName}</strong></p>
                  <p>Analyzer Health: <strong>{analyzerHealth}</strong></p>
                  {userIoT && (
                    <div style={styles.scrollContainer}>
                      <div style={styles.cardContainer}>
                        {Object.entries(userIoT)
                          .filter(([key]) => !excludedFields.includes(key))
                          .map(([key, value]) => (
                            <div key={key} style={styles.card}>
                              <strong>{key}:</strong> <p>{value !== null ? value : "N/A"}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

const styles = {
  scrollContainer: {
    maxHeight: "200px", // Limit the height of the scrollable area
    overflowY: "auto",  // Enable vertical scrolling
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
    borderRadius: "5px",
    padding: "10px",
    width: "120px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
};

export default KeralaMap;

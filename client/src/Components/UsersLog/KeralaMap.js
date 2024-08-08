import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const KeralaMap = ({ users }) => {
  const dispatch = useDispatch();
  const userIotData = useSelector((state) => state.iotData.userIotData);
  const navigate = useNavigate();

  const defaultPosition = [10.8505, 76.2711]; // Center position of Kerala

  const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  useEffect(() => {
    users.forEach(user => {
      dispatch(fetchIotDataByUserName(user.userName));
    });
  }, [dispatch, users]);

  const handleIconClick = (userName) => {
    // Navigate to the AirAmbient route and pass the userName as state
    navigate('/ambient-air', { state: { userName } });
  };

  return (
    <MapContainer center={defaultPosition} zoom={7} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.ebhoom.com/">Ebhoom Solutions</a> contributors'
      />
      {users.map(user => {
        const userIoT = userIotData[user.userName];
        const isHealthy = userIoT && userIoT.validationStatus;
        const analyzerHealth = userIoT && userIoT.message ? userIoT.message : (isHealthy ? 'Good' : 'Problem');
        console.log("validation status:", userIoT && userIoT.validationStatus);

        return (
          <Marker
            key={user._id}
            position={[user.latitude, user.longitude]}
            icon={isHealthy ? greenIcon : redIcon}
            eventHandlers={{
              click: () => handleIconClick(user.userName)
            }}
          >
            <Popup>
              <div>
                <h5>User ID: {user.userName}</h5>
                <p>Company Name: <strong>{user.companyName}</strong></p>
                <p>Model Name: <strong>{user.modelName}</strong></p>
                <p>Analyzer Health: <strong>{analyzerHealth}</strong></p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default KeralaMap;

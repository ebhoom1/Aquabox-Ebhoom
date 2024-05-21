import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const KeralaMap = ({ users }) => {
  const defaultPosition = [10.8505, 76.2711]; // Center position of Kerala

  const icon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  return (
    <MapContainer center={defaultPosition} zoom={8} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.ebhoom.com/">Ebhoom Solutions</a> contributors'
      />
      {users.map(user => (
        <Marker
          key={user._id}
          position={[user.latitude,user.longitude]}
          icon={icon}
        >
          <Popup>
            <div>
              <h4>{user.fname}</h4>
              <p>{user.address}</p>
              {console.log('log from keralaMap:',user.longitude,user.latitude)}
            </div>
          </Popup>
       </Marker>
      ))}
    </MapContainer>
  );
};

export default KeralaMap;

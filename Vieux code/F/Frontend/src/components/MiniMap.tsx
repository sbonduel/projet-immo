import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MiniMap = () => {
  return (
    <MapContainer
      center={[48.8566, 2.3522]}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[48.8566, 2.3522]}>
        <Popup>📍 Paris</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MiniMap;

import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({ latitude, longitude }) => {
  const [mapError, setMapError] = useState(null);

  const center = {
    lat: latitude || 37.7749, // Default to San Francisco if no props are passed
    lng: longitude || -122.4194, // Default to San Francisco if no props are passed
  };

  const options = {
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    disableDefaultUI: true, // Disables all UI controls
  };

  useEffect(() => {
    if (window.google && window.google.maps) {
      console.log("Google Maps API loaded successfully!");
    }
  }, []);

  if (mapError) {
    return <div>{mapError}</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      options={options} // Pass the options with disableDefaultUI
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default MapComponent;

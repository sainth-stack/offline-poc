import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({ latitude, longitude }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCkao6k2KwC_A1nGVwEbsGE9tQrbLSiUXQ", // Make sure your API key is correct
  });

  const [mapError, setMapError] = useState(null);

  const center = {
    lat: latitude || 37.7749, // Default to San Francisco if no props are passed
    lng: longitude || -122.4194, // Default to San Francisco if no props are passed
  };

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps API Load Error: ", loadError);
      setMapError(`Failed to load Google Maps API: ${loadError.message}`);
    }
  }, [loadError]);

  const options = {
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    disableDefaultUI: true, // Disables all UI controls
  };

  if (mapError) {
    return <div>{mapError}</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
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

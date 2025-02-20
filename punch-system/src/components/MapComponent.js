import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.offline";

// Fix for default marker icon in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

const MapComponent = ({ latitude = 37.7749, longitude = -122.4194 }) => {
  useEffect(() => {
    // Set up the default marker icon
    const defaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerIconShadow,
      iconSize: [25, 41], // Size of the icon
      iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
      shadowSize: [41, 41], // Size of the shadow
      shadowAnchor: [12, 41], // Point of the shadow which will correspond to marker's location
      popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    });

    // Set the default icon globally
    L.Marker.prototype.options.icon = defaultIcon;

    // Initialize the map
    const map = L.map("map").setView([latitude, longitude], 13);

    // Offline tile layer from OpenStreetMap
    const offlineLayer = L.tileLayer.offline(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        subdomains: ["a", "b", "c"], // Improve performance with subdomains
      }
    );

    offlineLayer.addTo(map);

    // Enable offline tile caching
    const control = L.control.savetiles(offlineLayer, {
      zoomlevels: [13, 16], // Cache tiles for these zoom levels
      confirm: (layer, successCallback) => {
        if (window.confirm("Cache tiles for offline use?")) {
          successCallback();
        }
      },
      confirmRemoval: (layer, successCallback) => {
        if (window.confirm("Remove cached tiles?")) {
          successCallback();
        }
      },
    });

    control.addTo(map);

    // Add a marker to the map
    L.marker([latitude, longitude]).addTo(map);

    // Cleanup function to remove the map when the component unmounts
    return () => map.remove();
  }, [latitude, longitude]);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default MapComponent;
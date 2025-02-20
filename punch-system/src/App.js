import React, { useState, useEffect } from "react";
import FacialRecognition from "./components/FaceRecogNew";
import { LoadScript } from "@react-google-maps/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PunchLog from "./components/PunchLog";
import MapComponent from "./components/MapComponent";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { toast } from "react-toastify"; // Assuming you use toast for notifications

const App = () => {
  const [logs, setLogs] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  // Update map center based on the latest log
  useEffect(() => {
    if (logs.length > 0) {
      const latestLog = logs[logs.length - 1];
      setMapCenter({
        lat: latestLog?.latitude,
        lng: latestLog?.longitude,
      });
    }
  }, [logs]);

  const handlePunchUpdate = (newLog) => {
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  const getCurrentLocation = async () => {
    try {
      if (Capacitor.getPlatform() === "web") {
        if (!navigator.geolocation) {
          toast.error("Geolocation is not supported in this browser.");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log("pos", pos.coords);
            setMapCenter({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (error) => toast.error("Failed to get location: " + error.message),
          {
            enableHighAccuracy: true, // To get more precise results
            timeout: 10000,
            maximumAge: 5000,
                    }
        );
      } else {
        const status = await Geolocation.requestPermissions();
        if (status.location !== "granted") {
          toast.error("Location permission required.");
          return;
        }

        const position = await Geolocation.getCurrentPosition();
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }
    } catch (error) {
      toast.error("Error getting location: " + error.message);
    }
  };

  // Set up an interval to fetch the location every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentLocation();
    }, 15000); // 15 seconds
    getCurrentLocation();
    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-4">
        <h1 className="text-xl font-semibold text-center text-gray-800">
          Punch In/Out System
        </h1>

        <div className="mb-4">
          {/* <LoadScript googleMapsApiKey="AIzaSyB_S2EWiZ9taJ2D956B_yAXlKnCCkVXh74"> */}
            <MapComponent latitude={mapCenter.lat} longitude={mapCenter.lng} logs={logs}/>
          {/* </LoadScript> */}
          <div className="bg-gray-200 p-3 rounded-lg">
            <FacialRecognition onPunchUpdate={handlePunchUpdate} latitude={mapCenter.lat} longitude={mapCenter.lng}/>
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Punch Logs
          </h2>
          <div className="bg-gray-200 p-3 rounded-lg max-h-64 overflow-y-auto">
            <PunchLog logs={logs} />
          </div>
        </div>

        {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar /> */}
      </div>
    </div>
  );
};

export default App;
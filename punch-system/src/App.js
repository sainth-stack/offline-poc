import React, { useState, useEffect } from "react";
import FacialRecognition from "./components/FaceRecogNew";
import { LoadScript } from "@react-google-maps/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PunchLog from "./components/PunchLog";
import MapComponent from "./components/MapComponent";

const App = () => {
  const [logs, setLogs] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.7749, // Default to San Francisco if no logs exist
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

  console.log("logs in app", logs);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-4">
        <h1 className="text-xl font-semibold text-center text-gray-800">
          Punch In/Out System
        </h1>

        <div className="mb-4">
          <LoadScript googleMapsApiKey="AIzaSyB_S2EWiZ9taJ2D956B_yAXlKnCCkVXh74">
            <MapComponent latitude={mapCenter.lat} longitude={mapCenter.lng} />
          </LoadScript>
          <div className="bg-gray-200 p-3 rounded-lg">
            <FacialRecognition onPunchUpdate={handlePunchUpdate} />
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

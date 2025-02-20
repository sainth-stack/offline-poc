import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import axios from "axios";
import { base_url } from "./../const";

const FacialRecognition = ({ onPunchUpdate, latitude, longitude }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [punchData, setPunchData] = useState({ punchIn: null, punchOut: null });

  const handleFaceDetection = async (type) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

        setLocation({ latitude, longitude });

        const punchType = type === "punchIn" ? "Punch In" : "Punch Out";
        const timestamp = new Date().toLocaleString();

        const punchDetails = {
          method: "Facial Recognition",
          type: punchType,
          timestamp,
          latitude,
          longitude,
        };

        setPunchData((prev) => ({
          ...prev,
          [type]: punchDetails,
        }));

        if (type === "punchIn") {
          setHasPunchedIn(true);
        }

        onPunchUpdate(punchDetails);

        // If offline, store data locally
        if (!navigator.onLine) {
          saveOfflinePunch(punchDetails);
          return;
        }

        // Send data to backend
        await sendPunchToServer(punchDetails);
      

  };

  // Save punch data offline
  const saveOfflinePunch = (punchDetails) => {
    const offlinePunches = JSON.parse(localStorage.getItem("offlinePunches")) || [];
    offlinePunches.push(punchDetails);
    localStorage.setItem("offlinePunches", JSON.stringify(offlinePunches));
    toast.warn("Offline mode: Punch data saved locally.");
    setLoading(false);
  };

  // Send data to server
  const sendPunchToServer = async (punchDetails) => {
    try {
      await axios.post(`${base_url}/api/locations`, punchDetails, { timeout: 15000 }); // 15s timeout for API request
      toast.success(`Punch recorded successfully at ${punchDetails.timestamp}.`);
    } catch (error) {
      toast.error("Failed to sync punch data. Saved offline.");
      console.error("API Error:", error);
      saveOfflinePunch(punchDetails);
    } finally {
      setLoading(false);
    }
  };

  // Sync offline data when back online
  const syncOfflineData = async () => {
    const offlineData = JSON.parse(localStorage.getItem("offlinePunches")) || [];
    if (offlineData.length === 0) return;

    for (let data of offlineData) {
      try {
        await sendPunchToServer(data);
      } catch (error) {
        console.error("Offline sync failed", error);
      }
    }

    localStorage.removeItem("offlinePunches");
    toast.success("Offline data synced successfully.");
  };

  useEffect(() => {
    window.addEventListener("online", syncOfflineData);
    return () => window.removeEventListener("online", syncOfflineData);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {!hasPunchedIn && (
        <button
          className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleFaceDetection("punchIn")}
          disabled={loading}
        >
          {loading ? "Processing..." : "Punch In"}
        </button>
      )}

      {hasPunchedIn && !punchData.punchOut && (
        <button
          className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleFaceDetection("punchOut")}
          disabled={loading}
        >
          {loading ? "Processing..." : "Punch Out"}
        </button>
      )}

      {punchData.punchOut && (
        <div className="font-semibold text-center bg-green-100 text-green-700 px-4 py-1 rounded-lg shadow-md">
          ✅ Your punch-out has been recorded successfully!
        </div>
      )}
    </div>
  );
};

export default FacialRecognition;

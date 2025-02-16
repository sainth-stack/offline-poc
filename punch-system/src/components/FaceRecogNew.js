import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import axios from "axios";
import { base_local } from "../const";

const FacialRecognition = ({ onPunchUpdate }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [punchData, setPunchData] = useState({ punchIn: null, punchOut: null });

  // Function to calculate distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Get user's location and track movement
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => toast.error(`Geolocation error: ${error.message}`),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (location && prevLocation) {
      const distance = calculateDistance(
        prevLocation.latitude,
        prevLocation.longitude,
        location.latitude,
        location.longitude
      );
      setTotalDistance((prev) => prev + distance);
    }
    if (location) {
      setPrevLocation(location);
    }
  }, [location]);

  const handleFaceDetection = async (type) => {
    if (!location) {
      toast.error("Location not available. Please enable GPS.");
      return;
    }

    const punchType = type === "punchIn" ? "Punch In" : "Punch Out";
    const timestamp = new Date().toLocaleString();

    const punchDetails = {
      method: "Facial Recognition",
      type: punchType,
      timestamp,
      latitude: location.latitude,
      longitude: location.longitude,
      distanceTravelled: totalDistance.toFixed(2),
    };

    setPunchData((prev) => ({
      ...prev,
      [type]: punchDetails,
    }));

    if (type === "punchIn") {
      setHasPunchedIn(true);
    }

    // Sync punch data to parent component
    onPunchUpdate(punchDetails);

    // Offline Mode: Store punch data if offline
    if (!navigator.onLine) {
      const offlinePunches =
        JSON.parse(localStorage.getItem("offlinePunches")) || [];
      offlinePunches.push(punchDetails);
      localStorage.setItem("offlinePunches", JSON.stringify(offlinePunches));
      toast.warn("Offline mode: Punch data saved locally.");
      return;
    }

    // Send data to backend
    try {
      await axios.post(`${base_local}/api/locations`, punchDetails);
      toast.success(`Punch recorded successfully at ${timestamp}.`);
    } catch (error) {
      toast.error("Failed to sync punch data.");
    }
  };

  // Function to sync offline punches when online
  const syncOfflineData = () => {
    const offlineData =
      JSON.parse(localStorage.getItem("offlinePunches")) || [];
    if (offlineData.length === 0) return;

    offlineData.forEach(async (data) => {
      try {
        await axios.post(`${base_local}/api/locations`, data);
      } catch (error) {
        console.error("Offline sync failed", error);
      }
    });

    localStorage.removeItem("offlinePunches");
  };

  useEffect(() => {
    window.addEventListener("online", syncOfflineData);
    return () => window.removeEventListener("online", syncOfflineData);
  }, []);

  return (
    <div className="flex flex-col items-center w-full ">
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

      {/* Show Confirmation Message After Punch Out */}
      {punchData.punchOut && (
        <div className="font-semibold text-center bg-green-100 text-green-700 px-4 py-1 rounded-lg shadow-md">
          ✅ Your punch-out has been recorded successfully!
         
        </div>
      )}
    </div>
  );
};

export default FacialRecognition;

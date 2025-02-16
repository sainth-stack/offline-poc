import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "@vladmandic/face-api";
import { toast } from "react-toastify";
import axios from "axios";
import { base_url } from "../const";


const FacialRecognition = ({ onPunchUpdate }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [punchData, setPunchData] = useState({ punchIn: null, punchOut: null });

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models/");
        setModelsLoaded(true);
        console.log("Models loaded successfully.");
      } catch (error) {
        console.error("Error loading models:", error);
        toast.error("Failed to load face detection models. Please refresh.");
      }
    };

    loadModels();
  }, []);

  // Get user's location
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

  const handleFaceDetection = async (type) => {
    if (!modelsLoaded) {
      toast.error("Face detection models are still loading...");
      return;
    }

    const video = webcamRef.current?.video;

    if (video && video.readyState === 4) {
      setLoading(true);
      const detection = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detection) {
        const imageSrc = webcamRef.current.getScreenshot();
        const timestamp = new Date().toLocaleString();
        const punchType = type === "punchIn" ? "Punch In" : "Punch Out";

        const punchDetails = {
          method: "Facial Recognition",
          type: punchType,
          timestamp,
          image: imageSrc,
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
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

        // Send data to backend
        try {
          await axios.post( `${base_url}/api/locations`, punchDetails);
          toast.success(`Punch recorded successfully at ${timestamp}.`);
        } catch (error) {
          toast.error("Failed to sync punch data.");
        }
      } else {
        toast.error("No face detected. Please adjust your position.");
      }
      setLoading(false);
    } else {
      toast.info("Webcam is not ready. Please check your camera.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative border border-gray-300 w-[320px] h-[240px] rounded-lg shadow-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          className="absolute inset-0 object-cover w-full h-full"
          screenshotFormat="image/jpeg"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <div className="relative w-32 h-32 rounded-full border-4 border-blue-400 flex items-center justify-center animate-pulse">
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-300"></div>
          </div>
          <p className="text-sm font-semibold mt-3">
            <span className="text-blue-300">
              {" "}
              🧍 Align your face within the circle{" "}
            </span>
          </p>
        </div>
      </div>
      {!modelsLoaded ? (
        <p>Loading models... Please wait.</p>
      ) : (
        <div className="mt-3 space-x-2">
          {!hasPunchedIn && (
            <button
              className={`bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 ${
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
              className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handleFaceDetection("punchOut")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Punch Out"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FacialRecognition;

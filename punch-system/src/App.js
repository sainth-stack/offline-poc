import React, { useState } from "react";
import FacialRecognition from "./components/FaceRecogNew";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PunchLog from './components/PunchLog';

const App = () => {
  const [logs, setLogs] = useState([]);

  const handlePunchUpdate = (newLog) => {
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-4">
        <h1 className="text-xl  font-semibold text-center text-gray-800">
          Punch In/Out System
        </h1>

        <div className="mb-4">
          {/* <h2 className="text-lg font-semibold text-gray-700">
            Facial Recognition
          </h2> */}
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

// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";

// const Geolocation = ({ onPunch }) => {
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by your browser.");
//       return;
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation({ latitude, longitude, timestamp: Date.now() });
//       },
//       (error) => toast.error(`Geolocation error: ${error.message}`),
//       { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   return (
//     <button
//       className="bg-blue-500 text-white px-4 py-2 rounded"
//       onClick={() => {
//         if (location) {
//           onPunch(location);
//         } else {
//           toast.error("Location not available. Ensure GPS is enabled.");
//         }
//       }}
//     >
//       Punch In/Out with Location
//     </button>
//   );
// };

// export default Geolocation;

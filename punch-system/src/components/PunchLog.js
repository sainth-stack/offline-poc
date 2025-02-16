import React from "react";
import DataTable from "./DataTable";

const PunchLog = ({ logs }) => {

  console.log("log scheking in punchlog",logs)
  const columns = [
    { key: "type", label: "Punch Type" },
    { key: "distanceTraveled", label: "Distance Traveled (km)" },
    { key: "timestamp", label: "Timestamp" },
    { key: "latitude", label: "Latitude" },
    { key: "longitude", label: "Longitude" },

    // {
    //   key: "image",
    //   label: "Captured Image",
    //   render: (value) =>
    //     value ? (
    //       <img
    //         src={value}
    //         alt="Captured face"
    //         className="w-20 h-20 object-cover rounded border transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg"
    //       />
    //     ) : (
    //       "No Image"
    //     ),
    // },
  ];

  return <DataTable columns={columns} data={logs} />;
};

export default PunchLog;

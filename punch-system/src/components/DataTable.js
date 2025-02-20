import React from "react";

// Haversine formula to calculate distance between two coordinates
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371.0; // Radius of the Earth in km
  const lat1Rad = (Math.PI / 180) * lat1;
  const lon1Rad = (Math.PI / 180) * lon1;
  const lat2Rad = (Math.PI / 180) * lat2;
  const lon2Rad = (Math.PI / 180) * lon2;

  const dlat = lat2Rad - lat1Rad;
  const dlon = lon2Rad - lon1Rad;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const DataTable = ({ columns, data }) => {

  // Function to calculate distance between two rows
  const calculateDistanceForSecondRow = (data) => {
    if (data.length >= 2) {
      console.log("data in table.....", data);

      const row1 = data[0];
      const row2 = data[1];

      // Check if both coordinates are available
      if (
        row1.latitude &&
        row1.longitude &&
        row2.latitude &&
        row2.longitude
      ) {
        console.log("Coordinates for row 1:", row1.longitude, row1.latitude);
        console.log("Coordinates for row 2:", row2.longitude, row2.latitude);

        // Calculate distance
        const distance = haversine(
          row1.longitude,
          row1.latitude,
          row2.longitude,
          row2.latitude
        );
        console.log("Calculated Distance:", distance);

        // Return the distance in km, with 2 decimal places
        return distance.toFixed(3);
      } else {
        console.log("Missing coordinates for distance calculation.");
      }
    }
    return 0;
  };

  // Calculate distance for second row if applicable
  const distanceForSecondRow = calculateDistanceForSecondRow(data);
  console.log("distanceForSecondRow", distanceForSecondRow);

  return (
    <div className="mt-4 bg-white p-2 rounded shadow-md w-full max-w-4xl h-80 overflow-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100 sticky top-0 z-20">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-2 py-1 bg-gray-200 shadow-md border border-gray-200 text-left font-semibold text-sm sticky top-0 rounded-sm"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={index}
                className="even:bg-gray-50 hover:bg-gray-200 transition duration-200"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-2 py-1 border border-gray-200 text-sm text-center font-semibold"
                  >
                    {col.key === "image" ? (
                      row[col.key] && typeof row[col.key] === "string" ? (
                        <img
                          src={row[col.key]}
                          alt="Captured"
                          className="w-20 h-20 object-cover rounded border transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg shadow-md hover:border hover:border-gray-50 hover:p-0.5"
                        />
                      ) : (
                        "No Image"
                      )
                    ) : col.key === "type" ? (
                      row[col.key] === "Punch Out" ? (
                        <span>👋 Checkout</span>
                      ) : (
                        <span>😊 Welcome</span>
                      )
                    ) : col.key === "distanceTraveled" && index === 1 ? (
                      // Render distance on the second row
                      distanceForSecondRow + " km"
                    ) : col.render ? (
                      col.render(row[col.key], row)
                    ) : (
                      row[col.key] || "0"
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-2 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

import React from "react";

const DataTable = ({ columns, data }) => {
  console.log("data in table.....", data);

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
                    className="px-2 py-1 border border-gray-200 text-sm text-center font-semibold "
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

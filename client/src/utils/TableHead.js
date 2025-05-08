import React from "react";

function TableHead({ headData }) {
  // Changed prop name to match usage
  return (
    <thead>
      <tr>
        {headData.map((header, index) => (
          <th
            key={index}
            className="text-center text-nowrap"
            style={{
              backgroundColor: "#E10174",
              color: "white",
              position: "sticky", // Ensures header stays fixed at the top
              top: 0, // Aligns header to the top of the scrollable container
              zIndex: 1, // Keeps header above table content
            }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHead;

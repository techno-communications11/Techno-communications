import React from "react";

function TableHead({ headData }) {  // Changed prop name to match usage
  return (
    <thead>
      <tr>
        {headData.map((header, index) => (
          <th key={index} className="text-center text-nowrap" style={{ backgroundColor: "#E10174", color: "white" }}>
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHead;
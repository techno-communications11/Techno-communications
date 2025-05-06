import React from "react";

function Inputicons({ icon: Icon }) {
  return (
    <span className="input-group-text">
      <Icon style={{ color: "#e10174" }} />
    </span>
  );
}

export default Inputicons;
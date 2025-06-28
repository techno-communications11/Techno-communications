import React from "react";
import Typography from "@mui/material/Typography";
function ReadyToSearch() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #DFE1E6",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: "#F4F5F7",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Typography style={{ fontSize: "24px", color: "#5E6C84" }}>
          🔍
        </Typography>
      </div>
      <Typography
        style={{
          color: "#172B4D",
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        Ready to search
      </Typography>
      <Typography
        style={{
          color: "#5E6C84",
          fontSize: "14px",
          maxWidth: "400px",
          lineHeight: "20px",
        }}
      >
        Please apply filters from the sidebar to view and analyze recruitment
        profiles.
      </Typography>
    </div>
  );
}

export default ReadyToSearch;

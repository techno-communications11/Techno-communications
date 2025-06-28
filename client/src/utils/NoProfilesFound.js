import { Typography } from "@mui/material";
function NoProfilesFound() {
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
          📋
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
        No profiles found
      </Typography>
      <Typography
        style={{
          color: "#5E6C84",
          fontSize: "14px",
          maxWidth: "400px",
          lineHeight: "20px",
        }}
      >
        Try adjusting your filters or search criteria to find more profiles.
      </Typography>
    </div>
  );
}

export default NoProfilesFound;

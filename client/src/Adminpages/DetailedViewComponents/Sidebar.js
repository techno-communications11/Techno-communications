import MarketSelector from "../../utils/MarketSelector";
import MultiUserSelector from "../../utils/MultiUserSelector";
import CustomPagination from "../../utils/CustomPagination";
import {Typography,} from "@mui/material";

const Sidebar = ({
  selectedMarkets,
  setSelectedMarkets,
  selectedUsers,
  setSelectedUsers,
  selectedGroupStatus,
  setSelectedGroupStatus,
  setSelectedStatus,
  users,
  groupStatus,
  statusMap,
  isAllSelected,
  setIsAllSelected,
  setMarketFilter,
  markets,
  profileCount,
  onDownload,
  currentPage,
  uniqueFlattenedProfiles,
  profilesPerPage,
  setCurrentPage,
}) => {
  const handleFilterApply = (status) => {
    setSelectedGroupStatus(status);
    const relatedStatuses = statusMap[status] || [];
    setSelectedStatus(relatedStatuses);
  };

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        maxWidth: "320px",
        backgroundColor: "#F7F8F9",
        borderRight: "1px solid #DFE1E6",
        height: "100vh",
        overflow: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "2px",
          border: "1px solid #DFE1E6",
          boxShadow: "0 1px 2px rgba(9, 30, 66, 0.08)",
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: "#172B4D",
            fontWeight: 600,
            fontSize: "16px",
            textAlign: "center",
            margin: 0,
          }}
        >
          Filters & Actions
        </Typography>
      </div>

      {/* Filters Section */}
      <div style={{ flex: 1 }}>
        {/* Market Selector */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "5px",
            border: "1px solid #DFE1E6",
          }}
        >
          <Typography
            style={{
              color: "#5E6C84",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "2px",
              letterSpacing: "0.5px",
            }}
          >
            Market
          </Typography>
          <MarketSelector
            isAllSelected={isAllSelected}
            selectedMarket={selectedMarkets}
            setIsAllSelected={setIsAllSelected}
            setSelectedMarket={setSelectedMarkets}
            setMarketFilter={setMarketFilter}
            text="Select Market"
            markets={markets}
          />
        </div>

        {/* Users Selector */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "5px",
            border: "1px solid #DFE1E6",
          }}
        >
          <Typography
            style={{
              color: "#5E6C84",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "5px",
              letterSpacing: "0.5px",
            }}
          >
            Users
          </Typography>
          <MultiUserSelector
            users={users}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </div>

        {/* Status Dropdown */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "10px",
            border: "1px solid #DFE1E6",
          }}
        >
          <Typography
            style={{
              color: "#5E6C84",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "5px",
              letterSpacing: "0.5px",
            }}
          >
            Status
          </Typography>
          <select
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "2px solid #DFE1E6",
              borderRadius: "3px",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#172B4D",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            value={selectedGroupStatus}
            onChange={(e) => handleFilterApply(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#0052CC"}
            onBlur={(e) => e.target.style.borderColor = "#DFE1E6"}
          >
            <option value="">All Status</option>
            {groupStatus.map((status, index) => (
              <option key={index} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ marginBottom: "100px" }}>
        {/* Profile Count */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "10px",
            border: "1px solid #DFE1E6",
            textAlign: "center",
          }}
        >
          <Typography
            style={{
              color: "#5E6C84",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: "4px",
              letterSpacing: "0.5px",
            }}
          >
            Total Profiles
          </Typography>
          <Typography
            style={{
              color: "#172B4D",
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {profileCount}
          </Typography>
        </div>

        {/* Download Button */}
        <button
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#0052CC",
            color: "white",
            border: "none",
            borderRadius: "3px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.2s",
            marginBottom: "10px",
          }}
          onClick={onDownload}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0065FF"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#0052CC"}
        >
          Download Data
        </button>

        {/* Pagination */}
        <CustomPagination
          totalProfiles={uniqueFlattenedProfiles?.length}
          profilesPerPage={profilesPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};
export default Sidebar;
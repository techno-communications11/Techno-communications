import getStatusColor from "../../utils/getStatusColor";
import {
  Typography,
  Table,
  TableBody,
  TableContainer,
  Chip,
  Avatar,
} from "@mui/material";
import getInitials from "../../utils/getInitials";
import Button from "../../utils/Button";

import dayjs from "dayjs";
import { useNavigate } from "react-router";

const TableHeaders = [
  "SI.No",
  "Created At",
  "Applicant Name",
  "Referred by",
  "Reference ids",
  "Work Location",
  "Screening Manager",
  "Interviewer",
  "HR Name",
  "Resume",
  "Status",
];

const ProfileTable = ({ profiles, serialNumberStart }) => {
  let serialNumber = serialNumberStart;
   const navigate=useNavigate();

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #DFE1E6",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(9, 30, 66, 0.08)",
      }}
    >
      <TableContainer
        style={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
      >
        <Table stickyHeader>
          <thead>
            <tr style={{ backgroundColor: "#F4F5F7" }}>
              {TableHeaders.map((header, index) => (
                <th
                  key={index}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#F4F5F7",
                    borderBottom: "2px solid #DFE1E6",
                    color: "#5E6C84",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    textWrap: "nowrap",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <TableBody>
            {profiles.map((profile, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #F4F5F7",
                  transition: "background-color 0.1s",
                  textWrap: "nowrap",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F4F5F7")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    color: "#5E6C84",
                    fontSize: "14px",
                  }}
                >
                  {serialNumber++}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    color: "#172B4D",
                    fontSize: "14px",
                  }}
                >
                  {profile.created_at_date
                    ? dayjs(profile.created_at_date).format("MMM DD, YYYY")
                    : "N/A"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Avatar
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "#0052CC",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(profile.applicant_name)}
                    </Avatar>
                    <div>
                      <Typography
                        style={{
                          color: "#172B4D",
                          fontSize: "14px",
                          fontWeight: 500,
                          margin: 0,
                          lineHeight: "20px",
                        }}
                      >
                        {profile.applicant_name || "N/A"}
                      </Typography>
                      <Typography
                        style={{
                          color: "#5E6C84",
                          fontSize: "12px",
                          margin: 0,
                          lineHeight: "16px",
                        }}
                      >
                        {profile.applicant_phone}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    color: "#172B4D",
                    fontSize: "14px",
                  }}
                >
                  {profile.applicant_referred_by || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    color: "#172B4D",
                    fontSize: "14px",
                  }}
                >
                  {profile.applicant_reference_id || "N/A"}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <Chip
                    label={profile.work_location_name || "N/A"}
                    size="small"
                    style={{
                      backgroundColor: "#E3FCEF",
                      color: "#006644",
                      fontSize: "11px",
                      fontWeight: 500,
                      border: "1px solid #ABF5D1",
                    }}
                  />
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  {profile.screening_manager_name &&
                  profile.screening_manager_name !== "N/A" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Avatar
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#8777D9",
                          fontSize: "10px",
                        }}
                      >
                        {getInitials(profile.screening_manager_name)}
                      </Avatar>
                      <span style={{ color: "#172B4D", fontSize: "14px" }}>
                        {profile.screening_manager_name}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: "#5E6C84", fontSize: "14px" }}>
                      N/A
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  {profile.interviewer_name &&
                  profile.interviewer_name !== "N/A" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Avatar
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#FF5630",
                          fontSize: "10px",
                        }}
                      >
                        {getInitials(profile.interviewer_name)}
                      </Avatar>
                      <span style={{ color: "#172B4D", fontSize: "14px" }}>
                        {profile.interviewer_name}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: "#5E6C84", fontSize: "14px" }}>
                      N/A
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  {profile.hr_name && profile.hr_name !== "N/A" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Avatar
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#00B8D9",
                          fontSize: "10px",
                        }}
                      >
                        {getInitials(profile.hr_name)}
                      </Avatar>
                      <span style={{ color: "#172B4D", fontSize: "14px" }}>
                        {profile.hr_name}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: "#5E6C84", fontSize: "14px" }}>
                      N/A
                    </span>
                  )}
                </td>
                <td>
                  <Button
                    label="View Resume"
                    variant="bg-blue-500 hover:bg-blue-600"
                    code="#1e3a8a" // overrides bg color
                    type="submit"
                    onClick={() => navigate(`/resumeview?applicant_uuid=${profile.applicant_uuid}`)}
                    loading={false}
                  />
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  {(() => {
                    const statusColors = getStatusColor(profile.status);
                    return (
                      <Chip
                        label={profile.status || "N/A"}
                        size="small"
                        style={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          border: `1px solid ${statusColors.border}`,
                          fontSize: "11px",
                          fontWeight: 500,
                          minWidth: "80px",
                        }}
                      />
                    );
                  })()}
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default ProfileTable;

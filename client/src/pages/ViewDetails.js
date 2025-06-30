import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import { Modal, Form, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "../Styles/ModalStyles.css";
import Pagination from "@mui/material/Pagination";
import Button from "../utils/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import useFetchMarkets from "../Hooks/useFetchMarkets";
import Loader from "../utils/Loader";
import TableHead from "../utils/TableHead";
import { useParams } from "react-router";
import MarketSelector from "../utils/MarketSelector";
import { FaRegEdit } from "react-icons/fa";

const statusMap = {
  Total1: [
    "pending at Screening",
    "Not Interested at screening",
    "moved to Interview",
    "rejected at Screening",
    "no show at Screening",
  ],
  Total2: [
    "put on hold at Interview",
    "selected at Interview",
    "need second opinion at Interview",
    "rejected at Interview",
    "no show at Interview",
    "Moved to HR",
  ],
  Total3: [
    "Sent for Evaluation",
    "Applicant will think about It",
    "selected at Hr",
    "no show at Hr",
    "rejected at Hr",
    "mark_assigned",
    "Spanish Evaluation",
    "backOut",
    "Not Recommended For Hiring",
    "Store Evaluation",
  ],
  // Flattened individual statuses
  "pending at Screening": ["pending at Screening"],
  "No Response At Screening": ["No Response At Screening"],
  "Not Interested at screening": ["Not Interested at screening"],
  "moved to Interview": ["moved to Interview"],
  "rejected at Screening": ["rejected at Screening"],
  "no show at Screening": ["no show at Screening"],
  "put on hold at Interview": ["put on hold at Interview"],
  "selected at Interview": ["selected at Interview"],
  "need second opinion at Interview": ["need second opinion at Interview"],
  "rejected at Interview": ["rejected at Interview"],
  "no show at Interview": ["no show at Interview"],
  "Moved to HR": ["Moved to HR"],
  "Sent for Evaluation": ["Sent for Evaluation"],
  "Applicant will think about It": ["Applicant will think about It"],
  "selected at Hr": ["selected at Hr"],
  "no show at Hr": ["no show at Hr"],
  "rejected at Hr": ["rejected at Hr"],
  mark_assigned: ["mark_assigned"],
  "Spanish Evaluation": ["Spanish Evaluation"],
  backOut: ["backOut"],
  "Not Recommended For Hiring": ["Not Recommended For Hiring"],
  "Store Evaluation": ["Store Evaluation"],
};
const tableHeaders = [
  "SI.No",
  "Created At",
  "Applicant",
  "Ref by",
  "Ref ID",
  "Location",
  "Screener",
  "Interviewer",
  "HR",
  "Status",
  "View/ Update",
];

function ViewDetais() {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 100;
  const [showModal, setShowModal] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const [commentprofileapplicant_uuid, setCommentProfileApplicant_uuid] =
    useState("");
  const [commentprofilestatus, setCommentprofileStatus] = useState("");
  const [selectedMarket, setSelectedMarket] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const { captureStatus } = useParams();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { markets } = useFetchMarkets();
   console.log(captureStatus);

  useEffect(() => {
    fetchProfiles();
  }, [captureStatus]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API}/viewdetails`;
      const response = await axios.get(url, { withCredentials: true });

      if (response.status === 200) {
        const profilesData = response.data.status_counts || [];
        setSelectedProfiles(profilesData);
        localStorage.setItem("selectedProfiles", JSON.stringify(profilesData));
      } else {
        console.error("Error fetching profiles:", response);
      }
    } catch (error) {
      console.error("API Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredProfiles = selectedProfiles
    .map((currentStatus) => {
      const filteredData = {
        applicant_names: [],
        phone: [],
        applicant_emails: [],
        applicant_referred_by: [],
        applicant_reference_ids: [],
        applicant_uuids: [],
        created_at_dates: [],
        work_location_names: [],
        screening_manager_names: [],
        interviewer_names: [],
        hr_names: [],
        joining_dates: [],
        status: currentStatus.status,
        notes: [],
        first_round_comments: [],
        applicant_referrals_comments: [],
      };

      const isDateInRange = (date) => {
        if (startDate && endDate) {
          const dateToCheck = new Date(date);
          return (
            dateToCheck >= new Date(startDate) &&
            dateToCheck <= new Date(endDate)
          );
        }
        return true;
      };

      if (
        currentStatus.applicant_names &&
        currentStatus.applicant_names.forEach
      ) {
        currentStatus.applicant_names.forEach((_, index) => {
          const filteredByStatus = statusMap[captureStatus]?.includes(
            currentStatus.status
          );
          const isInDateRange = isDateInRange(
            currentStatus.created_at_dates?.[index]
          );
          const inMarket =
            selectedMarket.length > 0
              ? selectedMarket.some(
                  (market) =>
                    currentStatus.work_location_names?.[index] === market
                )
              : true;

          if (
            filteredByStatus &&
            inMarket &&
            (startDate && endDate ? isInDateRange : true)
          ) {
            filteredData.applicant_names.push(
              currentStatus.applicant_names?.[index] || ""
            );
            filteredData.phone.push(currentStatus.phone?.[index] || "");
            filteredData.applicant_emails.push(
              currentStatus.applicant_emails?.[index] || ""
            );
            filteredData.applicant_referred_by.push(
              currentStatus.applicant_referred_by?.[index] || ""
            );
            filteredData.applicant_reference_ids.push(
              currentStatus.applicant_reference_ids?.[index] || ""
            );
            filteredData.applicant_uuids.push(
              currentStatus.applicant_uuids?.[index] || ""
            );
            filteredData.created_at_dates.push(
              currentStatus.created_at_dates?.[index] || ""
            );
            filteredData.work_location_names.push(
              currentStatus.work_location_names?.[index] || ""
            );
            filteredData.screening_manager_names.push(
              currentStatus.screening_manager_names?.[index] || "N/A"
            );
            filteredData.interviewer_names.push(
              currentStatus.interviewer_names?.[index] || "N/A"
            );
            filteredData.hr_names.push(
              currentStatus.hr_names?.[index] || "N/A"
            );
            filteredData.joining_dates.push(
              currentStatus.joining_dates?.[index] || "N/A"
            );
            filteredData.notes.push(
              (currentStatus.notes || [])[index] || "N/A"
            );
            filteredData.first_round_comments.push(
              (currentStatus.first_round_comments || [])[index] || "N/A"
            );
            filteredData.applicant_referrals_comments.push(
              (currentStatus.applicant_referrals_comments || [])[index] || "N/A"
            );
          }
        });
      }

      return filteredData;
    })
    .filter((data) => data.applicant_names.length > 0);

  const flattenedProfiles = filteredProfiles.flatMap((status) => {
    return status.applicant_names.map((name, index) => ({
      applicant_name: name,
      applicant_phone: status.phone[index],
      applicant_email: status.applicant_emails[index],
      applicant_referred_by: status.applicant_referred_by[index],
      applicant_reference_id: status.applicant_reference_ids[index],
      applicant_uuid: status.applicant_uuids[index],
      created_at_date: status.created_at_dates[index],
      work_location_name: status.work_location_names[index],
      screening_manager_name: status.screening_manager_names[index],
      interviewer_name: status.interviewer_names[index],
      hr_name: status.hr_names[index],
      notes: status.notes[index],
      applicant_referrals_comments: status.applicant_referrals_comments[index],
      first_round_comments: status.first_round_comments[index],
      status: status.status,
      joining_date:
        status.joining_dates[index] !== "0000-00-00"
          ? dayjs(status.joining_dates[index]).format("YYYY-MM-DD")
          : "N/A",
    }));
  });

  const uniqueFlattenedProfiles = flattenedProfiles.filter(
    (profile, index, self) =>
      index ===
      self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
  );

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = uniqueFlattenedProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );
  const pageCount = Math.ceil(uniqueFlattenedProfiles.length / profilesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDownloadExcel = (profiles) => {
    const worksheetData = profiles.map((profile) => ({
      "Created At": dayjs(profile.created_at_date).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      "Applicant UUID": profile.applicant_uuid,
      "Applicant Name": profile.applicant_name,
      "Phone Number": profile.applicant_phone,
      Email: profile.applicant_email,
      Referred_by: profile.applicant_referred_by,
      "Reference ID": profile.applicant_reference_id,
      "Work Location": profile.work_location_name,
      "Screening Manager": profile.screening_manager_name,
      Interviewer: profile.interviewer_name,
      "HR Name": profile.hr_name,
      Status: profile.status,
      "Joining Date": profile.joining_date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
    XLSX.writeFile(workbook, "Applicants_List.xlsx");
  };

  const handleOpenModal = (profile) => {
    setUpdatedComment(
      profile.status.includes("Screening")
        ? profile.applicant_referrals_comments
        : profile.status.includes("Interview")
        ? profile.first_round_comments
        : profile.notes
    );
    setCommentProfileApplicant_uuid(profile.applicant_uuid);
    setCommentprofileStatus(profile.status);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      applicant_uuid: commentprofileapplicant_uuid,
      status: commentprofilestatus,
      comment: updatedComment,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/update-comment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        handleCloseModal();
        toast.success("Comment updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(
          `Failed to update the comment: ${
            responseData.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(
        `An error occurred while updating the comment: ${error.message}`
      );
    } finally {
      setUpdatedComment("");
      setCommentProfileApplicant_uuid("");
      setCommentprofileStatus("");
    }
  };

  return (
    <Container
      fluid
      style={{
        backgroundColor: "#F4F5F7",
        minHeight: "100vh",
        padding: "16px",
      }}
    >
      <style>
        {`
          .jira-container {
            background-color: #FFFFFF;
            border-radius: 3px;
            box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25);
            border: 1px solid #DFE1E6;
          }
          
          .jira-header {
            background-color: #FAFBFC;
            border-bottom: 1px solid #DFE1E6;
            padding: 16px 24px;
          }
          
          .jira-sidebar {
            background-color: #FFFFFF;
            border-right: 1px solid #DFE1E6;
            box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25);
          }
          
          .jira-table {
            background-color: #FFFFFF;
          }
          
          .jira-table-header {
            background-color: #F4F5F7;
            border-bottom: 2px solid #DFE1E6;
            font-weight: 600;
            color: #5E6C84;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .jira-table-row {
            border-bottom: 1px solid #DFE1E6;
            transition: background-color 0.2s;
          }
          
          .jira-table-row:hover {
            background-color: #F4F5F7;
          }
          
          .jira-table-cell {
            padding: 8px 12px;
            font-size: 14px;
            color: #172B4D;
            vertical-align: middle;
          }
          
          .jira-status-badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          
          .jira-button {
            background-color: #0052CC;
            color: #FFFFFF;
            border: none;
            border-radius: 3px;
            padding: 6px 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .jira-button:hover {
            background-color: #0747A6;
          }
          
          .jira-button-secondary {
            background-color: #FAFBFC;
            color: #42526E;
            border: 1px solid #DFE1E6;
          }
          
          .jira-button-secondary:hover {
            background-color: #EBECF0;
          }
          
          .jira-action-button {
            background: none;
            border: none;
            color: #5E6C84;
            cursor: pointer;
            padding: 4px;
            border-radius: 3px;
            transition: all 0.2s;
          }
          
          .jira-action-button:hover {
            background-color: #F4F5F7;
            color: #0052CC;
          }
          
          .jira-modal {
            background-color: #FFFFFF;
            border-radius: 3px;
            box-shadow: 0 10px 50px rgba(9, 30, 66, 0.54);
          }
          
          .jira-modal-header {
            background-color: #FAFBFC;
            border-bottom: 1px solid #DFE1E6;
            padding: 16px 24px;
            border-radius: 3px 3px 0 0;
          }
          
          .jira-input {
            border: 2px solid #DFE1E6;
            border-radius: 3px;
            padding: 8px 12px;
            font-size: 14px;
            transition: border-color 0.2s;
            background-color: #FAFBFC;
            width: 100%;
            margin-bottom: 8px;
          }
          
          .jira-input:focus {
            border-color: #4C9AFF;
            background-color: #FFFFFF;
            outline: none;
          }
          
          .jira-count-badge {
            background-color: #0052CC;
            color: #FFFFFF;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
        `}
      </style>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Loader />
        </div>
      ) : uniqueFlattenedProfiles.length > 0 ? (
        <div style={{ display: "flex", gap: "16px" }}>
          {/* Sidebar */}
          <div
            className="jira-sidebar jira-container"
            style={{ width: "280px", height: "fit-content" }}
          >
            <div className="jira-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    color: "#172B4D",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Summary
                </h5>
                <span className="jira-count-badge">
                  {uniqueFlattenedProfiles.length}
                </span>
              </div>
              <button
                className="jira-button"
                onClick={() => handleDownloadExcel(uniqueFlattenedProfiles)}
              >
                <FileDownloadIcon
                  style={{ marginRight: "8px", fontSize: "16px" }}
                />
                Export Data
              </button>
              <div style={{ marginTop: "16px" }}>
                <label
                  style={{
                    color: "#5E6C84",
                    fontSize: "12px",
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  Market
                </label>
                <MarketSelector
                  selectedMarket={selectedMarket}
                  setSelectedMarket={setSelectedMarket}
                  isAllSelected={isAllSelected}
                  setIsAllSelected={setIsAllSelected}
                  markets={markets}
                  text="Select Market"
                  className="jira-input"
                />
                <label
                  style={{
                    color: "#5E6C84",
                    fontSize: "12px",
                    marginBottom: "4px",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  className="jira-input"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
                <label
                  style={{
                    color: "#5E6C84",
                    fontSize: "12px",
                    marginBottom: "4px",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  className="jira-input"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </div>
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                 <label
                  style={{
                    color: "#5E6C84",
                    fontSize: "12px",
                    marginBottom: "4px",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  Pages
                </label>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                className="d-flex justify-content-center"
              />
            </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="jira-container" style={{ flex: 1 }}>
            <div className="jira-header">
              <h6
                style={{
                  margin: 0,
                  color: "#172B4D",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Applicant Details - {captureStatus}
              </h6>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#5E6C84",
                  fontSize: "14px",
                }}
              >
                Showing {indexOfFirstProfile + 1} to{" "}
                {Math.min(indexOfLastProfile, uniqueFlattenedProfiles.length)}{" "}
                of {uniqueFlattenedProfiles.length} applications
              </p>
            </div>

            <TableContainer
              component={Paper}
              className="jira-table"
              style={{ overflowX: "auto", maxHeight: "600px" }}
            >
              <Table stickyHeader>
                <TableHead headData={tableHeaders} />
                <TableBody>
                  {currentProfiles.map((profile, index) => (
                    <TableRow key={index} className="jira-table-row">
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        {indexOfFirstProfile + index + 1}
                      </TableCell>
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center", textWrap: "nowrap" }}
                      >
                        {profile.created_at_date.slice(0, 10)}
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        <Box display="flex">
                          <Box ml={2}>
                            <Typography
                              variant="body1"
                              style={{
                                fontWeight: "600",
                                color: "#172B4D",
                                marginBottom: "2px",
                              }}
                            >
                              {profile.applicant_name?.toLowerCase() || "N/A"}
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{ fontSize: "12px", color: "#5E6C84" }}
                            >
                              {profile.applicant_phone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        {profile.applicant_referred_by?.toLowerCase() || "N/A"}
                      </TableCell>
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        <span
                          style={{
                            backgroundColor: "#F4F5F7",
                            color: "#5E6C84",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            fontSize: "12px",
                            fontFamily: "monospace",
                          }}
                        >
                          {profile.applicant_reference_id || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        {profile.work_location_name?.toLowerCase() || "N/A"}
                      </TableCell>
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        {profile.screening_manager_name?.toLowerCase() || "N/A"}
                      </TableCell>
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        {profile.interviewer_name?.toLowerCase() || "N/A"}
                      </TableCell>
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        {profile.hr_name || "N/A"}
                      </TableCell>
                      <TableCell
                        className="jira-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        <span
                          className="jira-status-badge"
                          style={{
                            backgroundColor:
                              profile.status.includes("selected") ||
                              profile.status.includes("Recommended")
                                ? "#E3FCEF"
                                : profile.status.includes("rejected") ||
                                  profile.status.includes("no show")
                                ? "#FFEBE6"
                                : profile.status.includes("pending") ||
                                  profile.status.includes("moved")
                                ? "#DEEBFF"
                                : profile.status.includes("hold")
                                ? "#FFFAE6"
                                : "#F4F5F7",
                            color:
                              profile.status.includes("selected") ||
                              profile.status.includes("Recommended")
                                ? "#006644"
                                : profile.status.includes("rejected") ||
                                  profile.status.includes("no show")
                                ? "#BF2600"
                                : profile.status.includes("pending") ||
                                  profile.status.includes("moved")
                                ? "#0747A6"
                                : profile.status.includes("hold")
                                ? "#974F0C"
                                : "#5E6C84",
                            border:
                              "1px solid " +
                              (profile.status.includes("selected") ||
                              profile.status.includes("Recommended")
                                ? "#79F2C0"
                                : profile.status.includes("rejected") ||
                                  profile.status.includes("no show")
                                ? "#FFBDAD"
                                : profile.status.includes("pending") ||
                                  profile.status.includes("moved")
                                ? "#4C9AFF"
                                : profile.status.includes("hold")
                                ? "#FFCC33"
                                : "#DFE1E6"),
                          }}
                        >
                          {profile.status || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell
                        className="jira-table-cell d-flex justify-content-center"
                        style={{ textAlign: "center" }}
                      >
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              {(() => {
                                const { status } = profile;
                                if (
                                  [
                                    "pending at Screening",
                                    "rejected at Screening",
                                    "no show at Screening",
                                    "Not Interested at screening",
                                    "moved to Interview",
                                  ].includes(status)
                                ) {
                                  return (
                                    profile.applicant_referrals_comments ||
                                    "N/A"
                                  );
                                }

                                if (
                                  [
                                    "put on hold at Interview",
                                    "Moved to HR",
                                    "selected at Interview",
                                    "need second opinion at Interview",
                                    "rejected at Interview",
                                    "no show at Interview",
                                  ].includes(status)
                                ) {
                                  return profile.first_round_comments || "N/A";
                                }

                                if (
                                  [
                                    "Recommended For Hiring",
                                    "Sent for Evaluation",
                                    "Applicant will think about It",
                                    "selected at Hr",
                                    "Store Evaluation",
                                    "Spanish Evaluation",
                                    "Not Recommended For Hiring",
                                    "rejected at Hr",
                                    "backOut",
                                    "mark_assigned",
                                  ].includes(status)
                                ) {
                                  return profile.notes || "N/A";
                                }

                                return "N/A";
                              })()}
                            </Tooltip>
                          }
                        >
                          {(() => {
                            const { status } = profile;

                            const screeningStatuses = [
                              "pending at Screening",
                              "rejected at Screening",
                              "no show at Screening",
                              "Not Interested at screening",
                              "moved to Interview",
                            ];

                            const interviewStatuses = [
                              "put on hold at Interview",
                              "Moved to HR",
                              "selected at Interview",
                              "need second opinion at Interview",
                              "rejected at Interview",
                              "no show at Interview",
                            ];

                            const hrStatuses = [
                              "Recommended For Hiring",
                              "Sent for Evaluation",
                              "Applicant will think about It",
                              "selected at Hr",
                              "Store Evaluation",
                              "Spanish Evaluation",
                              "Not Recommended For Hiring",
                              "rejected at Hr",
                              "backOut",
                              "mark_assigned",
                            ];

                            const hasComment =
                              (screeningStatuses.includes(status) &&
                                profile.applicant_referrals_comments &&
                                profile.applicant_referrals_comments !==
                                  "N/A") ||
                              (interviewStatuses.includes(status) &&
                                profile.first_round_comments &&
                                profile.first_round_comments !== "N/A") ||
                              (hrStatuses.includes(status) &&
                                profile.notes &&
                                profile.notes !== "N/A");

                            return (
                              <button className="jira-action-button">
                                <span
                                  style={{
                                    color: hasComment ? "green" : "red",
                                  }}
                                >
                                  {hasComment ? "View" : "No data"}
                                </span>
                              </button>
                            );
                          })()}
                        </OverlayTrigger>

                        <Button
                          icon={<FaRegEdit />}
                          variant="bg-primary btn-sm"
                          style={{
                            fontSize: "12px",
                            marginLeft: "8px",
                          }}
                          onClick={() => handleOpenModal(profile)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
          </div>
        </div>
      ) : (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Typography variant="h6" color="error">
            No profiles found for the selected filters
          </Typography>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} className="jira-modal">
        <Modal.Header closeButton className="jira-modal-header">
          <Modal.Title className="fs-6">Update Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="comment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedComment}
                onChange={(e) => setUpdatedComment(e.target.value)}
                required
                className="jira-input"
              />
            </Form.Group>
            <div className="mt-3">
              <Button
                type="submit"
                className="jira-button"
                disabled={loading}
                label={loading ? "Updating..." : "Update Comment"}
              />
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </Container>
  );
}

export default ViewDetais;

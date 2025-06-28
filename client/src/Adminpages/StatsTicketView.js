import { useState, useEffect, useContext } from "react";
import { MyContext } from "../pages/MyContext";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import { Modal, Form, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Loader from "../utils/Loader";
import TableHead from "../utils/TableHead";
import API_URL from "../Constants/ApiUrl";
import Button from "../utils/Button";
import { useParams } from "react-router";
import CustomPagination from "../utils/CustomPagination";
import { FaEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { IoIosEyeOff } from "react-icons/io";
import NoProfilesFound from "../utils/NoProfilesFound";

const TableHeader = [
  "S.No",
  "Applicant",
  "ReferredBy",
  "ReferID",
  "Location",
  "Screener",
  "Interviewer",
  "HR",
  "Status",
  "Created At",
  "Actions",
];

const statusMap = {
  Total: [
    "pending at Screening",
    "moved to Interview",
    "put on hold at Interview",
    "selected at Interview",
    "Recommended For Hiring",
    "Sent for Evaluation",
    "need second opinion at Interview",
    "Applicant will think about It",
    "Moved to HR",
    "selected at Hr",
    "Store Evaluation",
    "Spanish Evaluation",
    "rejected at Screening",
    "no show at Screening",
    "Not Interested at screening",
    "rejected at Interview",
    "no show at Interview",
    "no show at Hr",
    "Not Recommended For Hiring",
    "rejected at Hr",
    "backOut",
    "mark_assigned",
  ],
  Pending: [
    "pending at Screening",
    "moved to Interview",
    "put on hold at Interview",
    "selected at Interview",
    "Recommended For Hiring",
    "Sent for Evaluation",
    "need second opinion at Interview",
    "Applicant will think about It",
    "Moved to HR",
    "selected at Hr",
    "Store Evaluation",
    "Spanish Evaluation",
  ],
  Rejected: [
    "rejected at Screening",
    "no show at Screening",
    "Not Interested at screening",
    "rejected at Interview",
    "no show at Interview",
    "no show at Hr",
    "Not Recommended For Hiring",
    "backOut",
    "rejected at Hr",
  ],
  "Pending At Screening": ["pending at Screening"],
  "1st Round - Pending": ["moved to Interview", "put on hold at Interview"],
  "HR Round - Pending": [
    "selected at Interview",
    "Sent for Evaluation",
    "need second opinion at Interview",
    "Applicant will think about It",
    "Moved to HR",
    "Recommended For Hiring",
    "Store Evaluation",
    "Spanish Evaluation",
  ],
  "Pending at NTID": ["selected at Hr"],
  "NTID Created": ["mark_assigned"],
};

function StatsTicketView() {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const [commentProfileApplicantUuid, setCommentProfileApplicantUuid] = useState("");
  const [commentProfileStatus, setCommentProfileStatus] = useState("");
  const myContext = useContext(MyContext);
  const { markets = [], captureDate = [], setMarkets, setCaptureStatus, setCaptureDate } = myContext || {};
  const { captureStatus: urlCaptureStatus } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 50;
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(captureDate[0] || "");
  const [selectedEndDate, setSelectedEndDate] = useState(captureDate[1] || "");
  const [selectedStatus, setSelectedStatus] = useState(urlCaptureStatus || "Total");

  useEffect(() => {
    // Only fetch when filters change, avoiding myContext dependency
    const fetchData = async () => {
      setLoading(true);
      try {
        const parsedMarkets = Array.isArray(markets) ? markets : [];
        const parsedCaptureStatus = selectedStatus || "";
        const parsedCaptureDate = [selectedStartDate, selectedEndDate].filter(Boolean);

        const url = `${API_URL}/Detailstatus`;
        const params = {
          market: selectedMarket ? [selectedMarket] : parsedMarkets,
          status: statusMap[parsedCaptureStatus] || [],
          startDate: parsedCaptureDate[0] ? dayjs(parsedCaptureDate[0]).format("YYYY-MM-DD") : null,
          endDate: parsedCaptureDate[1] ? dayjs(parsedCaptureDate[1]).format("YYYY-MM-DD") : null,
        };

        console.log("Fetching with params:", params); // Debug log
        const response = await axios.get(url, { params, withCredentials: true });

        if (response.status === 200) {
          const profilesData = response.data.status_counts || [];
          console.log("Fetched data:", profilesData); // Debug log
          setSelectedProfiles(profilesData);
          localStorage.setItem("selectedProfiles", JSON.stringify(profilesData));
        } else {
          console.error("Error fetching profiles:", response.status, response.data);
        }
      } catch (error) {
        console.error("API Error:", error.message, error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMarket, selectedStartDate, selectedEndDate, selectedStatus]); // Removed myContext from dependencies

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

      if (currentStatus.applicant_names && currentStatus.applicant_names.forEach) {
        currentStatus.applicant_names.forEach((_, index) => {
          const inMarket = selectedMarket
            ? currentStatus.work_location_names?.[index] === selectedMarket
            : markets.length > 0
            ? markets.some((market) => currentStatus.work_location_names?.[index] === market)
            : true;

          const createdDate = new Date(currentStatus.created_at_dates?.[index] || "");
          const [startDate, endDate] = [selectedStartDate, selectedEndDate].map(d => d ? new Date(d) : null);
          if (startDate && endDate) {
            if (startDate.toDateString() === endDate.toDateString()) {
              startDate.setHours(0, 0, 0, 0);
              endDate.setHours(23, 59, 59, 999);
            } else {
              startDate.setHours(0, 0, 0, 0);
              endDate.setHours(23, 59, 59, 999);
            }
          }

          const inDateRange = startDate && endDate
            ? !isNaN(createdDate) && createdDate >= startDate && createdDate <= endDate
            : true;

          const filteredByStatus = statusMap[selectedStatus]?.includes(currentStatus.status);

          if (inMarket && inDateRange && filteredByStatus) {
            filteredData.applicant_names.push(currentStatus.applicant_names?.[index] || "");
            filteredData.phone.push(currentStatus.phone?.[index] || "");
            filteredData.applicant_emails.push(currentStatus.applicant_emails?.[index] || "");
            filteredData.applicant_referred_by.push(currentStatus.applicant_referred_by?.[index] || "");
            filteredData.applicant_reference_ids.push(currentStatus.applicant_reference_ids?.[index] || "");
            filteredData.applicant_uuids.push(currentStatus.applicant_uuids?.[index] || "");
            filteredData.created_at_dates.push(currentStatus.created_at_dates?.[index] || "");
            filteredData.work_location_names.push(currentStatus.work_location_names?.[index] || "");
            filteredData.screening_manager_names.push(currentStatus.screening_manager_names?.[index] || "N/A");
            filteredData.interviewer_names.push(currentStatus.interviewer_names?.[index] || "N/A");
            filteredData.hr_names.push(currentStatus.hr_names?.[index] || "N/A");
            filteredData.joining_dates.push(currentStatus.joining_dates?.[index] || "N/A");
            filteredData.notes.push((currentStatus.notes || [])[index] || "N/A");
            filteredData.first_round_comments.push((currentStatus.first_round_comments || [])[index] || "N/A");
            filteredData.applicant_referrals_comments.push((currentStatus.applicant_referrals_comments || [])[index] || "N/A");
          }
        });
      }

      return filteredData;
    })
    .filter((data) => data.applicant_names.length > 0);

  const flattenedProfiles = filteredProfiles.flatMap((status) =>
    status.applicant_names.map((name, index) => ({
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
      joining_date: status.joining_dates[index] !== "0000-00-00"
        ? dayjs(status.joining_dates[index]).format("YYYY-MM-DD")
        : "N/A",
    }))
  );

  const uniqueFlattenedProfiles = flattenedProfiles.filter(
    (profile, index, self) =>
      index === self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
  );

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = uniqueFlattenedProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const handleDownloadExcel = (profiles) => {
    const worksheetData = profiles.map((profile) => ({
      "Created At": dayjs(profile.created_at_date).format("YYYY-MM-DD HH:mm:ss"),
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
    setCommentProfileApplicantUuid(profile.applicant_uuid);
    setCommentProfileStatus(profile.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      applicant_uuid: commentProfileApplicantUuid,
      status: commentProfileStatus,
      comment: updatedComment,
    };

    try {
      const response = await fetch(`${API_URL}/update-comment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        handleCloseModal();
        toast.success("Comment updated successfully!");
        setTimeout(() => window.location.reload(), 3000);
      } else {
        toast.error(`Failed to update the comment: ${responseData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(`An error occurred while updating the comment: ${error.message}`);
    } finally {
      setUpdatedComment("");
      setCommentProfileApplicantUuid("");
      setCommentProfileStatus("");
    }
  };

  const getStatusStyle = (status) => {
    if (status.includes("selected") || status.includes("Recommended")) {
      return { backgroundColor: "#E3FCEF", color: "#006644", border: "1px solid #79F2C0" };
    } else if (status.includes("rejected") || status.includes("no show")) {
      return { backgroundColor: "#FFEBE6", color: "#BF2600", border: "1px solid #FFBDAD" };
    } else if (status.includes("pending") || status.includes("moved")) {
      return { backgroundColor: "#DEEBFF", color: "#0747A6", border: "1px solid #4C9AFF" };
    } else if (status.includes("hold")) {
      return { backgroundColor: "#FFFAE6", color: "#974F0C", border: "1px solid #FFCC33" };
    }
    return { backgroundColor: "#F4F5F7", color: "#5E6C84", border: "1px solid #DFE1E6" };
  };

  return (
    <Container fluid style={{ backgroundColor: "#F4F5F7", minHeight: "100vh", padding: "16px" }}>
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
          <div className="jira-sidebar jira-container" style={{ width: "280px", height: "fit-content" }}>
            <div className="jira-header">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h5 style={{ margin: 0, color: "#172B4D", fontSize: "16px", fontWeight: "600" }}>Summary</h5>
                <span className="jira-count-badge">{uniqueFlattenedProfiles.length}</span>
              </div>
              <button
                className="jira-button"
                onClick={() => handleDownloadExcel(uniqueFlattenedProfiles)}
              >
                <FileDownloadIcon style={{ marginRight: "8px", fontSize: "16px" }} />
                Export Data
              </button>
              <div style={{ marginTop: "16px" }}>
                <label style={{ color: "#5E6C84", fontSize: "16px", marginBottom: "4px", display: "block" }}>Market</label>
                <select
                  className="jira-input"
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                >
                  <option value="">All Markets</option>
                  {Array.from(new Set(markets)).map((market, index) => (
                    <option key={index} value={market}>{market}</option>
                  ))}
                </select>
                <label style={{ color: "#5E6C84", fontSize: "16px", marginBottom: "4px", display: "block", marginTop: "8px" }}>Start Date</label>
                <input
                  type="date"
                  className="jira-input"
                  value={selectedStartDate}
                  onChange={(e) => setSelectedStartDate(e.target.value)}
                />
                <label style={{ color: "#5E6C84", fontSize: "16px", marginBottom: "4px", display: "block", marginTop: "8px" }}>End Date</label>
                <input
                  type="date"
                  className="jira-input"
                  value={selectedEndDate}
                  onChange={(e) => setSelectedEndDate(e.target.value)}
                />
                <label style={{ color: "#5E6C84", fontSize: "16px", marginBottom: "4px", display: "block", marginTop: "8px" }}>Status</label>
                <select
                  className="jira-input"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {Object.keys(statusMap).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                                <label style={{ color: "#5E6C84", fontSize: "16px", marginBottom: "4px", display: "block", marginTop: "8px" }}>Pages</label>
              <CustomPagination
                totalProfiles={uniqueFlattenedProfiles.length}
                profilesPerPage={profilesPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="jira-container" style={{ flex: 1 }}>
            <div className="jira-header">
              <h6 style={{ margin: 0, color: "#172B4D", fontSize: "18px", fontWeight: "600" }}>
                Applicant Details - {selectedStatus}
              </h6>
              <p style={{ margin: "4px 0 0 0", color: "#5E6C84", fontSize: "14px" }}>
                Showing {indexOfFirstProfile + 1} to {Math.min(indexOfLastProfile, uniqueFlattenedProfiles.length)} of {uniqueFlattenedProfiles.length} applications
              </p>
            </div>

            <TableContainer component={Paper} className="jira-table" style={{ overflowX: "auto", maxHeight: "600px",textWrap:'wrap' }}>
              <Table stickyHeader>
                <TableHead headData={TableHeader} />
                <TableBody>
                  {currentProfiles.map((profile, index) => (
                    <TableRow key={index} className="jira-table-row">
                      <TableCell className="jira-table-cell" style={{ textAlign: "center" }}>
                        {indexOfFirstProfile + index + 1}
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        <div>
                          <div style={{ fontWeight: "600", color: "#172B4D", marginBottom: "2px" }}>
                            {profile.applicant_name || "N/A"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#5E6C84" }}>
                            {profile.applicant_phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        {profile.applicant_referred_by || "N/A"}
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        <span style={{ backgroundColor: "#F4F5F7", color: "#5E6C84", padding: "2px 6px", borderRadius: "3px", fontSize: "12px", fontFamily: "monospace" }}>
                          {profile.applicant_reference_id || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        {profile.work_location_name?.toLowerCase() || "N/A"}
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        {profile.screening_manager_name || "N/A"}
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        {profile.interviewer_name || "N/A"}
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        {profile.hr_name || "N/A"}
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        <span className="jira-status-badge" style={getStatusStyle(profile.status)}>
                          {profile.status || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="jira-table-cell text-nowrap">
                        <div style={{ fontSize: "12px", color: "#5E6C84" }}>
                          {profile.created_at_date.slice(0, 10) || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="jira-table-cell">
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          {(() => {
                            let comment = "N/A";
                            let tooltipId = `tooltip-na-${profile.applicant_uuid}`;

                            if (["pending at Screening", "rejected at Screening", "no show at Screening", "Not Interested at screening", "moved to Interview"].includes(profile.status)) {
                              comment = profile.applicant_referrals_comments;
                              tooltipId = `tooltip-screening-${profile.applicant_uuid}`;
                            } else if (["put on hold at Interview", "Moved to HR", "selected at Interview", "need second opinion at Interview", "rejected at Interview", "no show at Interview"].includes(profile.status)) {
                              comment = profile.first_round_comments;
                              tooltipId = `tooltip-interview-${profile.applicant_uuid}`;
                            } else if (["Recommended For Hiring", "Sent for Evaluation", "Applicant will think about It", "selected at Hr", "Store Evaluation", "Spanish Evaluation", "Not Recommended For Hiring", "rejected at Hr", "backOut", "mark_assigned"].includes(profile.status)) {
                              comment = profile.notes;
                              tooltipId = `tooltip-final-${profile.applicant_uuid}`;
                            }

                            const hasComment = comment && comment !== "N/A";

                            return (
                              <>
                                <OverlayTrigger placement="top" overlay={<Tooltip id={tooltipId}>{hasComment ? comment : "No comments available"}</Tooltip>}>
                                  <button className="jira-action-button">
                                    {hasComment ? <FaEye style={{ fontSize: "14px" }} /> : <IoIosEyeOff style={{ fontSize: "14px" }} />}
                                  </button>
                                </OverlayTrigger>
                                <button className="jira-action-button" onClick={() => handleOpenModal(profile)}>
                                  <FiEdit style={{ fontSize: "14px" }} />
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
          </div>
        </div>
      ) : (
        <NoProfilesFound/>
      )}

      <Modal show={showModal} onHide={handleCloseModal} className="jira-modal">
        <Modal.Header closeButton className="jira-modal-header">
          <Modal.Title className="fs-6">Update Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="comment">
              <Form.Control
                as="textarea"
                rows={3}
                className="jira-input"
                placeholder="Enter Comment"
                value={updatedComment}
                onChange={(e) => setUpdatedComment(e.target.value)}
                required
              />
            </Form.Group>
            <div className="mt-3">
              <Button
                type="submit"
                variant="jira-button"
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

export default StatsTicketView;
import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../pages/MyContext";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import { Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Container } from "react-bootstrap";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
function StatsTicketView() {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 30;
  const [showModal, setShowModal] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const [commentprofileapplicant_uuid, setCommentProfileApplicant_uuid] =
    useState("");
  const [commentprofilestatus, setCommentprofileStatus] = useState("");

  const myContext = useContext(MyContext);
  const { markets, captureStatus, captureDate } = myContext;
  console.log(captureStatus,"caps")

  useEffect(() => {
    // First, use context values
    const { markets, captureStatus, captureDate } = myContext;

    // Check if the context values are set (non-empty) or fall back to localStorage
    let parsedMarkets = markets && markets.length > 0 ? markets : [];
    let parsedCaptureStatus = captureStatus || "";
    let parsedCaptureDate =
      captureDate && captureDate.length > 0 ? captureDate : [];

    // If context values are not available, get them from localStorage
    if (
      parsedMarkets.length === 0 ||
      !parsedCaptureStatus ||
      parsedCaptureDate.length === 0
    ) {
      const storedMarkets = localStorage.getItem("marketsData");
      const storedCaptureStatus = localStorage.getItem("captureStatusData");
      const storedCaptureDate = localStorage.getItem("captureDateData");

      try {
        if (storedMarkets) {
          parsedMarkets = JSON.parse(storedMarkets);
        }
        if (storedCaptureStatus) {
          parsedCaptureStatus = JSON.parse(storedCaptureStatus);
        }
        if (storedCaptureDate) {
          parsedCaptureDate = JSON.parse(storedCaptureDate);
        }
      } catch (error) {
        console.error("Error parsing data from localStorage:", error);
        // Optionally, clear invalid data in localStorage
        localStorage.removeItem("marketsData");
        localStorage.removeItem("captureStatusData");
        localStorage.removeItem("captureDateData");
      }
    }

    // If data exists, update context and localStorage
    if (
      parsedMarkets.length > 0 &&
      parsedCaptureStatus &&
      parsedCaptureDate.length > 0
    ) {
      // Update context values
      myContext.setMarkets(parsedMarkets);
      myContext.setCaptureStatus(parsedCaptureStatus);
      myContext.setCaptureDate(parsedCaptureDate);

      // Store in localStorage for future use
      localStorage.setItem("marketsData", JSON.stringify(parsedMarkets));
      localStorage.setItem(
        "captureStatusData",
        JSON.stringify(parsedCaptureStatus)
      );
      localStorage.setItem(
        "captureDateData",
        JSON.stringify(parsedCaptureDate)
      );
    }

    // Fetch profiles after loading data
    fetchProfiles(parsedMarkets, parsedCaptureStatus, parsedCaptureDate);
  }, [myContext]); // Dependency on myContext

  const fetchProfiles = async (
    markets = [],
    captureStatus = "",
    captureDate = []
  ) => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API}/Detailstatus`;
      const params = {
        market: markets,
        status: statusMap[captureStatus], // Ensure that the `statusMap` exists
        startDate:
          captureDate.length > 0
            ? dayjs(captureDate[0]).format("YYYY-MM-DD")
            : null,
        endDate:
          captureDate.length > 0
            ? dayjs(captureDate[1]).format("YYYY-MM-DD")
            : null,
      };

      const response = await axios.get(url, { params });

      if (response.status === 200) {
        const profilesData = response.data.status_counts || [];
        setSelectedProfiles(profilesData); // Set state to update the UI
        // Update localStorage with the latest selected profiles data
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
        // Market filter
        const inMarket =
          markets.length > 0
            ? markets.some(
                (market) => currentStatus.work_location_names?.[index] === market
              )
            : true;

        // Get created date from profile and convert to native JavaScript Date
        const createdDate = new Date(currentStatus.created_at_dates?.[index]);

        // Get start and end dates from captureDate (if defined)
        const [startDate, endDate] = captureDate;

        // Adjust the startDate and endDate to ensure inclusive range (start of day and end of day)
        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;

        // Date range filter (using JavaScript Date comparison)
        const inDateRange =
          startDateObj && endDateObj
            ? createdDate >= startDateObj && createdDate <= endDateObj
            : true; // If no date range is set, include all

        // Status filter
        const filteredByStatus = statusMap[captureStatus]?.includes(currentStatus.status);

        // Only add profile data if it matches the filters
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

  const headerStyle = {
    backgroundColor: "#E10174",
    color: "#ffffff",
    padding: "4px 8px",
    alignItems: "center",
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
          body: JSON.stringify(data),
        }
      );

      // Log the server's response to understand what's going wrong
      const responseData = await response.json();
      console.log("Server Response:", responseData);

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
    <Container className="mt-3">
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : uniqueFlattenedProfiles.length > 0 ? (
        <>
          <div className="justify-content-between d-flex m-1">
            <h3 style={{ color: "#E10174" }}>
              Total: {uniqueFlattenedProfiles.length}
            </h3>
            <Button
              variant="outlined"
              color="success"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleDownloadExcel(uniqueFlattenedProfiles)}
            >
              Download Data Excel
            </Button>
          </div>

          <TableContainer
            component={Paper}
            sx={{ width: "100%", boxShadow: 2, borderRadius: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={headerStyle}>S.No</TableCell>
                  <TableCell style={headerStyle}>Created At</TableCell>
                  <TableCell style={headerStyle}>Applicant Details</TableCell>
                  <TableCell style={headerStyle}>Referred_by</TableCell>
                  <TableCell style={headerStyle}>Reference ID</TableCell>
                  <TableCell style={headerStyle}>Work Location</TableCell>
                  <TableCell style={headerStyle}>Screening Manager</TableCell>
                  <TableCell style={headerStyle}>Interviewer</TableCell>
                  <TableCell style={headerStyle}>HR Name</TableCell>
                  <TableCell style={headerStyle}>Status</TableCell>
                  <TableCell style={headerStyle}>Joining Date</TableCell>
                  <TableCell style={headerStyle}>Comments</TableCell>
                  <TableCell style={headerStyle}>Update Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProfiles.map((profile, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {indexOfFirstProfile + index + 1}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.created_at_date || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      <Box display="flex" alignItems="center">
                        <Box ml={2}>
                          <Typography
                            variant="body1"
                            style={{ fontWeight: "bold" }}
                          >
                            {" "}
                            {profile.applicant_name || "N/A"}
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            {profile.applicant_phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.applicant_referred_by || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.applicant_reference_id || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.work_location_name || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.screening_manager_name || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.interviewer_name || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.hr_name || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.status || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.joining_date || "N/A"}
                    </TableCell>

                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>
                            {[
                              "pending at Screening",
                              "rejected at Screening",
                              "no show at Screening",
                              "Not Interested at screening","moved to Interview"
                            ].includes(profile.status)
                              ? profile.applicant_referrals_comments
                              : [
                                  "put on hold at Interview","Moved to HR",
                                  "selected at Interview",
                                  "need second opinion at Interview",
                                  "rejected at Interview",
                                  "no show at Interview",
                                ].includes(profile.status)
                              ? profile.first_round_comments
                              : [
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
                                ].includes(profile.status)
                              ? profile.notes
                              : "N/A"}
                          </Tooltip>
                        }
                      >
                        {
                          // Check if the comment data is "N/A" or not, to conditionally render the text
                          [
                            "pending at Screening",
                            "rejected at Screening",
                            "no show at Screening",
                            "Not Interested at screening","moved to Interview"
                          ].includes(profile.status) &&
                          profile.applicant_referrals_comments !== "N/A" ? (
                            <span style={{ color: "green" }}>View </span>
                          ) : [
                              "put on hold at Interview","Moved to HR",
                                  "selected at Interview",
                                  "need second opinion at Interview",
                                  "rejected at Interview",
                                  "no show at Interview",
                            ].includes(profile.status) &&
                            profile.first_round_comments !== "N/A" ? (
                            <span style={{ color: "green" }}>View </span>
                          ) : [
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
                            ].includes(profile.status) &&
                            profile.notes !== "N/A" ? (
                            <span style={{ color: "green" }}>View </span>
                          ) : (
                            <span style={{ color: "red" }}>No data</span>
                          )
                        }
                      </OverlayTrigger>
                    </TableCell>

                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      <Button
                        className="text-white bg-primary "
                        style={{ fontSize: "10px" }}
                        onClick={() => handleOpenModal(profile)}
                      >
                        Update
                      </Button>{" "}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack spacing={2} sx={{ marginTop: 3 }}>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      ) : (
        <Typography variant="h6" color="error">
          No profiles found for the selected filters
        </Typography>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Comment</Modal.Title>
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
              />
            </Form.Group>
            <div className="mt-3">
              <Button
                type="submit"
                className="bg-primary text-white"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Comment"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </Container>
  );
}

export default StatsTicketView;

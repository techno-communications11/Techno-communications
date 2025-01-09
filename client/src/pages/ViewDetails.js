import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../pages/MyContext";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import { Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import '../Adminpages/ModalStyles.css'
import Pagination from "@mui/material/Pagination";
import { IoIosArrowDown } from "react-icons/io";

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
function ViewDetais() {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 100;
  const [showModal, setShowModal] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const [commentprofileapplicant_uuid, setCommentProfileApplicant_uuid] =useState("");
  const [commentprofilestatus, setCommentprofileStatus] = useState("");
  const myContext = useContext(MyContext);
const { captureStatus } = myContext;
const [selectedLocations, setSelectedLocations] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
const captureStatusFromStorage = captureStatus || localStorage.getItem("captureStatuss");  // Fallback to a default value if null

useEffect(() => {
  if (captureStatus) {
    localStorage.setItem("captureStatuss", captureStatus);
  }
}, [captureStatus]);

useEffect(() => {
  fetchProfiles();
}, [myContext]);  // Effect will run when myContext changes
  // Effect will run when myContext changes
  
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API}/viewdetails`;
      const response = await axios.get(url);
  
      if (response.status === 200) {
        const profilesData = response.data.status_counts || [];
        setSelectedProfiles(profilesData); // Set state to update the UI
        // console.log(profilesData, "data is dipped");
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

  // Handle end date change
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  // console.log(setSelectedProfiles,'selecp')
  
  const statusMap = {
    "Total1": [
      "pending at Screening",
      "Not Interested at screening",
      "moved to Interview",
      "rejected at Screening",
      "no show at Screening"
    ],
    "Total2": [
      "put on hold at Interview",
      "selected at Interview",
      "need second opinion at Interview",
      "rejected at Interview",
      "no show at Interview",
      "Moved to HR",
    ],
    "Total3": [
      "Sent for Evaluation",
      "Applicant will think about It",
      "selected at Hr",
      "no show at Hr",
      "rejected at Hr",
      'mark_assigned',
      "Spanish Evaluation",
      "backOut",
      "Not Recommended For Hiring",
      "Store Evaluation",
    ],
   
    // Flattened individual statuses
    'pending at Screening': ["pending at Screening"],
    'No Response At Screening': ["No Response At Screening"],
    'Not Interested at screening': ["Not Interested at screening"],
    'moved to Interview': ["moved to Interview"],
    'rejected at Screening': ["rejected at Screening"],
    "no show at Screening": ["no show at Screening"],
    
    'put on hold at Interview': ["put on hold at Interview"],
    'selected at Interview': ["selected at Interview"],
    'need second opinion at Interview': ["need second opinion at Interview"],
    'rejected at Interview': ["rejected at Interview"],
    'no show at Interview': ["no show at Interview"],
    'Moved to HR': ["Moved to HR"],
  
    'Sent for Evaluation': ["Sent for Evaluation"],
    'Applicant will think about It': ["Applicant will think about It"],
    'selected at Hr': ["selected at Hr"],
    'no show at Hr': ["no show at Hr"],
    'rejected at Hr': ["rejected at Hr"],
    'mark_assigned':['mark_assigned'],
    "Spanish Evaluation":["Spanish for Evaluation"],
    "backOut":["backOut"],"Not recommeneded for Hiring":["Not recommeneded for Hiring"],"Store Evaluation":["Store Evaluation"]
  };
  
  const locations = [
    { id: 4, name: "ARIZONA" },
    { id: 5, name: "Bay Area" },
    { id: 6, name: "COLORADO" },
    { id: 7, name: "DALLAS" },
    { id: 8, name: "El Paso" },
    { id: 9, name: "FLORIDA" },
    { id: 10, name: "HOUSTON" },
    { id: 11, name: "LOS ANGELES" },
    { id: 12, name: "MEMPHIS" },
    { id: 13, name: "NASHVILLE" },
    { id: 14, name: "NORTH CAROL" },
    { id: 15, name: "SACRAMENTO" },
    { id: 16, name: "SAN DEIGIO" },
    { id: 17, name: "SAN FRANCISCO" },
    { id: 18, name: "SAN JOSE" },
    { id: 19, name: "SANTA ROSA" },
    { id: 21, name: "relocation" },
    { id: 23, name: "DirectHiring" },
  ];
 
  
     // Handle checkbox change
     const handleCheckboxChange = (event) => {
      const { value, checked } = event.target;
      if (checked) {
        setSelectedLocations([...selectedLocations, value]);
      } else {
        setSelectedLocations(selectedLocations.filter((name) => name !== value));
      }
    };
  
    // Handle dropdown toggle
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  
    // Handle "Select All" functionality
    const handleSelectAllChange = (event) => {
      const { checked } = event.target;
      if (checked) {
        setSelectedLocations(locations.map((loc) => loc.name.toString()));
      } else {
        setSelectedLocations([]);
      }
    };
    // console.log(selectedLocations,'selec')
 
  
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
  
      // Apply filtering only if both startDate and endDate are selected
      const isDateInRange = (date) => {
        if (startDate && endDate) {
          const dateToCheck = new Date(date);
          return dateToCheck >= new Date(startDate) && dateToCheck <= new Date(endDate);
        }
        return true; // No date filtering if either date is missing
      };
  
      // Apply location filter only if a market/location is selected
      
      
  
      if (currentStatus.applicant_names && currentStatus.applicant_names.forEach) {
        currentStatus.applicant_names.forEach((_, index) => {
          // Default filter: status is applied first
          const filteredByStatus = statusMap[captureStatusFromStorage]?.includes(currentStatus.status);
  
          // Apply date filter only if both start and end dates are selected
          const isInDateRange = isDateInRange(currentStatus.created_at_dates?.[index]);
  
          // Apply location filter if a location is selected
          const inMarket =
            selectedLocations.length > 0
              ? selectedLocations.some(
                  (market) =>
                    currentStatus.work_location_names?.[index] === market
                )
              : true;
  
          // Only include data that matches status, date range, and location (if applicable)
          if (filteredByStatus && inMarket && (startDate && endDate ? isInDateRange : true)) {
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
    .filter((data) => data.applicant_names.length > 0); // Filter out profiles with no names
  

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
    textAlign: "center", // Corrected property name
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
      // console.log("Server Response:", responseData);

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
    <Container fluid className="mt-3">
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
            <div className="dropdown-container">
      {/* Dropdown Button */}
      <div className="dropdown-button" onClick={toggleDropdown}>
        <span>Select Market</span>
        <span className="dropdown-arrow"><IoIosArrowDown /></span>
      </div>

      {/* Dropdown content (checkboxes) */}
      {isDropdownOpen && (
        <div className="checkbox-dropdown">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="select-all"
              checked={selectedLocations.length === locations.length}
              onChange={handleSelectAllChange}
            />
            <label htmlFor="select-all">Select All</label>
          </div>

          {locations.map((location) => (
            <div key={location.name} className="checkbox-item">
              <input
                type="checkbox"
                id={`location-${location.name}`}
                value={location.name}
                checked={selectedLocations.includes(location.name.toString())}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`location-${location.name}`}>{location.name}</label>
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="date-picker">
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>

      {/* End Date Picker */}
      <div className="date-picker">
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
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
                 sx={{
                   width: "100%",
                   boxShadow: 2,
                   borderRadius: 2,
                   maxHeight: "600px", // Define height for scrollable content
                 }}
          >
            <Table stickyHeader className="table-sm">
              <TableHead>
                <TableRow>
                  <TableCell style={headerStyle}>S.No</TableCell>
                  <TableCell style={headerStyle}>Created_At</TableCell>
                  <TableCell style={headerStyle}>Applicant_Details</TableCell>
                  <TableCell style={headerStyle}>Referred_by</TableCell>
                  <TableCell style={headerStyle}>Reference_ID</TableCell>
                  <TableCell style={headerStyle}>Work_Location</TableCell>
                  <TableCell style={headerStyle}>Screening_Manager</TableCell>
                  <TableCell style={headerStyle}>Interviewer</TableCell>
                  <TableCell style={headerStyle}>HR_Name</TableCell>
                  <TableCell style={headerStyle}>Status</TableCell>
                  <TableCell style={headerStyle}>Joining_Date</TableCell>
                  <TableCell style={headerStyle}>Comments</TableCell>
                  <TableCell style={headerStyle}>Update_Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProfiles.map((profile, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ padding: "2px 8px", fontSize: "0.9rem" }}
                      className="text-center"
                    >
                      {indexOfFirstProfile + index + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      {profile.created_at_date.slice(0,10)}
                    </TableCell>
                    <TableCell
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      <Box display="flex" >
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
                    className="text-center"
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.applicant_referred_by || "N/A"}
                    </TableCell>
                    <TableCell
                    className="text-center"
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.applicant_reference_id || "N/A"}
                    </TableCell>
                    <TableCell
                    className="text-center"
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.work_location_name || "N/A"}
                    </TableCell>
                    <TableCell
                    className="text-center"
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.screening_manager_name || "N/A"}
                    </TableCell>
                    <TableCell
                    className="text-center"
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.interviewer_name || "N/A"}
                    </TableCell>
                    <TableCell
                    className="text-center"
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.hr_name || "N/A"}
                    </TableCell>
                    <TableCell
                    className="text-center"
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.status || "N/A"}
                    </TableCell>
                    <TableCell
                    className="text-center"
                      style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                    >
                      {profile.joining_date || "N/A"}
                    </TableCell>

                    <TableCell
                    className="text-center"
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
                    className="text-center"
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
              className="d-flex justify-content-center"
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

export default ViewDetais;

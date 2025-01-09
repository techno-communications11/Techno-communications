import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Form, Card, Col, Row, Container } from "react-bootstrap";
import dayjs from "dayjs";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Dropdown, ButtonGroup } from "react-bootstrap";
const DetailedView = () => {
  const [selectedMarkets, setSelectedMarkets] = useState([]); // Change to handle multiple markets
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]); // Updated to store multiple users
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardShow, SetcardShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const profilesPerPage = 100; // Number of profiles to show per page
  const [selectedGroupStatus, setSelectedGroupStatus] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false); // To check if filters are applied
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const locations = [
    // { id: 1, name: 'test' },
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

  let users = [
    "Alishba Ahmed",
    "ALISHA PADANIYA",
    "Roshan Interview",
    "Roshan Screening",
    "Roshan Shaikh",
    "Bilal Interview",
    // "EL Paso Market",
    "Qamar Shahzad",
    "Shafaque Qureshi",
    "Sultan Interview",
    // "Shah Noor Butt",
    "Shoaib",
    "Kamaran Mohammed",
  ];
  const filteredMarkets = locations.filter((market) =>
    market.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setIsAllSelected(checked);

    if (checked) {
      // Select all markets
      setSelectedMarkets(locations.map((location) => location.name));
    } else {
      // Deselect all markets
      setSelectedMarkets([]);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [
    selectedMarkets,
    selectedCategory,
    selectedStatus,
    selectedUsers,
    dateRange,
  ]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API}/Detailstatus`;
      const params = {
        market: selectedMarkets.map((m) => m.value), // Handle multiple markets
        category: selectedCategory,
        status: selectedStatus,
        users: selectedUsers.map((u) => u.value), // Handle multiple users
        startDate: dateRange[0]
          ? dayjs(dateRange[0]).format("YYYY-MM-DD")
          : null,
        endDate: dateRange[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null,
      };
      const response = await axios.get(url, { params });
      if (response.status === 200) {
        const details = response.data.status_counts;
        // console.log("details", details)
        setSelectedProfiles(details || []);
        setIsFilterApplied(
          selectedMarkets.length > 0 ||
            selectedCategory ||
            selectedStatus.length > 0 ||
            selectedUsers.length > 0 ||
            (dateRange[0] && dateRange[1])
        );
      } else {
        console.error("Error fetching profiles:", response);
      }
    } catch (error) {
      console.error("API Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (event) => {
    const { value, checked } = event.target;
    // console.log("cheking", value, checked)
    if (checked) {
      setSelectedMarkets((prevSelected) => {
        return [...prevSelected, value]; // Add the selected market
      });
    } else {
      setSelectedMarkets((prevSelected) => {
        return prevSelected.filter((market) => market !== value); // Remove the unselected market
      });
    }
    setIsAllSelected(false);
  };

  const handleUserChange = (event, user) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedUsers((prevSelected) => [
        ...prevSelected,
        { value: user, label: user },
      ]);
    } else {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((selected) => selected.value !== user)
      );
    }
  };

  const handleFilterApply = (status) => {
    setSelectedGroupStatus(status);
    const relatedStatuses = statusMap[status] || [];
    setSelectedStatus(relatedStatuses);
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("savedFilters"));
    if (savedFilters) {
      // Apply the saved filters on component load
      setSelectedMarkets(savedFilters.selectedMarkets || []);
      setSelectedCategory(savedFilters.selectedCategory || "");
      setSelectedStatus(savedFilters.selectedStatus || []);
      setSelectedUsers(savedFilters.selectedUsers || []);
      setDateRange(savedFilters.dateRange || [null, null]);
    }
  }, []);

  useEffect(() => {
    const filters = {
      selectedMarkets,
      selectedCategory,
      selectedStatus,
      selectedUsers,
      dateRange,
    };
    localStorage.setItem("savedFilters", JSON.stringify(filters));
  }, [
    selectedMarkets,
    selectedCategory,
    selectedStatus,
    selectedUsers,
    dateRange,
  ]);

  const filteredProfiles = selectedProfiles
    .map((currentStatus) => {
      const filteredData = {
        applicant_names: [],
        phone: [],
        applicant_emails: [],
        applicant_referred_by: [],
        applicant_reference_ids: [],
        applicant_uuids: [], // Added phone field
        created_at_dates: [],
        work_location_names: [],
        screening_manager_names: [],
        interviewer_names: [],
        hr_names: [],
        joining_dates: [],
        status: currentStatus.status,
      };

      currentStatus.applicant_names.forEach((_, index) => {
        // Check if the current profile's work location matches any of the selected markets
        const inMarket =
          selectedMarkets.length > 0
            ? selectedMarkets.some(
                (market) =>
                  currentStatus.work_location_names[index]
                    ?.trim()
                    .toLowerCase() === market.toLowerCase()
              )
            : true;

        const inUsers =
          selectedUsers.length > 0
            ? selectedUsers.some((user) =>
                [
                  currentStatus.screening_manager_names[index],
                  currentStatus.interviewer_names[index],
                  currentStatus.hr_names[index],
                ].includes(user.value)
              )
            : true;

        const createdDate = dayjs(currentStatus.created_at_dates[index]);
        const inDateRange =
          dateRange[0] && dateRange[1]
            ? createdDate.isAfter(dayjs(dateRange[0]).startOf("day")) &&
              createdDate.isBefore(dayjs(dateRange[1]).endOf("day"))
            : true;

        const filteredByStatus =
          selectedStatus.length > 0
            ? selectedStatus.includes(currentStatus.status)
            : true;

        // If all conditions pass, include the current profile data
        if (inMarket && inUsers && inDateRange && filteredByStatus) {
          filteredData.applicant_names.push(
            currentStatus.applicant_names[index]
          );
          filteredData.phone.push(currentStatus.phone[index]);
          filteredData.applicant_emails.push(
            currentStatus.applicant_emails[index]
          );
          filteredData.applicant_referred_by.push(
            currentStatus.applicant_referred_by[index]
          );
          filteredData.applicant_reference_ids.push(
            currentStatus.applicant_reference_ids[index]
          );
          filteredData.applicant_uuids.push(
            currentStatus.applicant_uuids[index]
          );
          filteredData.created_at_dates.push(
            currentStatus.created_at_dates[index]
          );
          filteredData.work_location_names.push(
            currentStatus.work_location_names[index]
          );
          filteredData.screening_manager_names.push(
            currentStatus.screening_manager_names[index]
          );
          filteredData.interviewer_names.push(
            currentStatus.interviewer_names[index]
          );
          filteredData.hr_names.push(currentStatus.hr_names[index]);
          filteredData.joining_dates.push(currentStatus.joining_dates[index]);
        }
      });

      return filteredData;
    })
    .filter((data) => data.applicant_names.length > 0); // Remove empty results

  const statusOrder = [
    "pending at Screening",
    "no show at Screening",
    "rejected at Screening",
    "Not Interested at screening",
    "moved to Interview",
    "no show at Interview",
    "rejected at Interview",
    "selected at Interview",
    "no show at Hr",
    "Moved to HR",
    "selected at Hr",
    "rejected at Hr",
  ];

  const flattenedProfiles = filteredProfiles
    .flatMap((status) => {
      return status.applicant_names.map((name, index) => ({
        applicant_name: name,
        applicant_phone: status.phone[index],
        applicant_email: status.applicant_emails[index],
        applicant_referred_by: status.applicant_referred_by[index],
        applicant_reference_id: status.applicant_reference_ids[index],
        applicant_uuid: status.applicant_uuids[index],
        created_at_date: status.created_at_dates[index],
        work_location_name: status.work_location_names[index],
        screening_manager_name: status.screening_manager_names[index] || "N/A",
        interviewer_name: status.interviewer_names[index] || "N/A",
        hr_name: status.hr_names[index] || "N/A",
        status: status.status,
        joining_date:
          status.joining_dates[index] &&
          status.joining_dates[index] !== "0000-00-00"
            ? dayjs(status.joining_dates[index]).format("YYYY-MM-DD")
            : "N/A",
      }));
    })
    .sort((a, b) => {
      const statusAIndex =
        statusOrder.indexOf(a.status) !== -1
          ? statusOrder.indexOf(a.status)
          : 9999;
      const statusBIndex =
        statusOrder.indexOf(b.status) !== -1
          ? statusOrder.indexOf(b.status)
          : 9999;

      // Sort by status index
      if (statusAIndex < statusBIndex) return -1;
      if (statusAIndex > statusBIndex) return 1;

      // Sort by created_at_date
      return (
        new Date(a.created_at_date) - new Date(b.created_at_date) ||
        a.applicant_name.localeCompare(b.applicant_name)
      ); // Add additional sorting by applicant_name
    });

  const uniqueFlattenedProfiles = flattenedProfiles.filter(
    (profile, index, self) =>
      index ===
      self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
  );

  // console.log("uniqueFlattenedProfiles", uniqueFlattenedProfiles)
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

  let serialNumber = indexOfFirstProfile + 1;
  const smallerFormStyles = {
    borderRadius: "8px",
    padding: "8px",
    fontSize: "14px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    borderColor: "#007bff",
  };
  // console.log("uniqueFlattenedProfiles", uniqueFlattenedProfiles)
  const profileStats = uniqueFlattenedProfiles.reduce((acc, profile) => {
    acc[profile.status] = (acc[profile.status] || 0) + 1;
    return acc;
  }, {});

  const pendingTotal =
    (profileStats["pending at Screening"] || 0) +
    (profileStats["moved to Interview"] || 0) +
    (profileStats["put on hold at Interview"] || 0) +
    (profileStats["selected at Interview"] || 0) +
    (profileStats["Sent for Evaluation"] || 0) +
    (profileStats["need second opinion at Interview"] || 0) +
    (profileStats["Applicant will think about It"] || 0) +
    (profileStats["Moved to HR"] || 0) +
    (profileStats["Recommended For Hiring"] || 0) +
    (profileStats["selected at Hr"] || 0) +
    (profileStats["Spanish Evaluation"] || 0) +
    (profileStats["Store Evaluation"] || 0);
  const rejectedTotal =
    (profileStats["rejected at Screening"] || 0) +
    (profileStats["no show at Screening"] || 0) +
    (profileStats["Not Interested at screening"] || 0) +
    (profileStats["rejected at Interview"] || 0) +
    (profileStats["no show at Interview"] || 0) +
    (profileStats["no show at Hr"] || 0) +
    (profileStats["Not Recommended For Hiring"] || 0) +
    (profileStats["backOut"] || 0) +
    (profileStats["rejected at Hr"] || 0);
  const atscreening = profileStats["pending at Screening"] || 0;
  const firstRoundPendingTotal =
    // (profileStats["pending at Screening"] || 0) +
    (profileStats["moved to Interview"] || 0) +
    (profileStats["put on hold at Interview"] || 0);

  const hrRoundPendingTotal =
    (profileStats["Recommended For Hiring"] || 0) +
    (profileStats["selected at Interview"] || 0) +
    (profileStats["Sent for Evaluation"] || 0) +
    (profileStats["need second opinion at Interview"] || 0) +
    (profileStats["Applicant will think about It"] || 0) +
    (profileStats["Moved to HR"] || 0) +
    (profileStats["Spanish Evaluation"] || 0) +
    (profileStats["Store Evaluation"] || 0);
  const pendingAtNITDSTotal = profileStats["selected at Hr"] || 0;

  const ntidCreatedTotal = profileStats["mark_assigned"] || 0;

  const finalStatusCounts = {
    // "Total": Object.values(profileStats).reduce((acc, val) => acc + val, 0),
    Rejected: rejectedTotal,
    Pending: pendingTotal,
    "Pending At Screening": atscreening,
    "1st Round - Pending": firstRoundPendingTotal,
    "HR Round - Pending": hrRoundPendingTotal,
    "Pending at NTID": pendingAtNITDSTotal,
    "NTID Created": ntidCreatedTotal,
  };

  const groupstatus = [
    "Rejected",
    "Pending",
    "pending at Screening",
    "1st Round - Pending",
    "HR Round - Pending",
    "Pending at NTID",
    "NTID Created",
  ];
  // const userOptions = users.map((user) => ({ value: user, label: user }));
  const statusMap = {
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
    "pending at Screening": ["pending at Screening"],
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
  const handleDownloadExcel = (uniqueFlattenedProfiles) => {
    const worksheetData = uniqueFlattenedProfiles.map((profile, index) => ({
      "Created At": dayjs(profile.created_at_date).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      "Applicant UUID": profile.applicant_uuid,
      "Applicant Name": profile.applicant_name,
      "Phone Number": profile.applicant_phone,
      Email: profile.applicant_email,
      Referred_by: profile.applicant_referred_by,
      Referred_id: profile.applicant_reference_id,
      "Work Location": profile.work_location_name,
      "Screening Manager": profile.screening_manager_name,
      Interviewer: profile.interviewer_name,
      "HR Name": profile.hr_name,
      Status: profile.status,
      "Joining Date": profile.joining_date,
    }));

    // Create worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Applicants_List.xlsx");
  };

  return (
    <Container fluid p={3}>
      {/* Filter Controls */}
      <Box
        display="flex"
        mt={2}
        gap={2}
        mb={3}
        sx={{ width: "100%", flexWrap: "wrap" }}
      >
        {/* Market Selector */}
        <Col md={2}>
          <Form.Group controlId="marketSelector">
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #ddd",
                  width: "320px",
                  height: "56px",
                  textAlign: "left",
                }}
              >
                {selectedMarkets.length > 0
                  ? `${selectedMarkets.length} Market(s) Selected`
                  : "Select Markets"}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  maxHeight: "350px",
                  overflowY: "auto",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Form.Check
                  type="checkbox"
                  label="Select All"
                  checked={isAllSelected}
                  onChange={handleSelectAllChange}
                  style={{
                    marginLeft: "20px",
                    fontWeight: "bold",
                    padding: "0 10px",
                  }}
                />
                {filteredMarkets.map((location) => (
                  <Form.Check
                    key={location.id}
                    type="checkbox"
                    label={location.name}
                    value={location.name}
                    checked={selectedMarkets.includes(location.name)} // Ensure it reflects the state
                    onChange={handleLocationChange}
                    style={{ marginLeft: "20px", padding: "0 10px" }}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Col>

        {/* Status Selector */}

        {/* User Selector */}
        <Form.Group controlId="userSelector" style={{ flex: 2 }}>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              style={{
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                width: "320px",
                height: "56px",
                textAlign: "left",
              }}
            >
              {selectedUsers.length > 0
                ? `${selectedUsers.length} User(s) Selected`
                : "Select One or More Users"}
            </Dropdown.Toggle>

            <Dropdown.Menu
              style={{
                maxHeight: "350px",
                overflowY: "auto",
                width: "100%",
                padding: "10px",
                backgroundColor: "#f8f9fa",
              }}
            >
              {users.map((user) => (
                <Form.Check
                  key={user}
                  type="checkbox"
                  label={user}
                  value={user}
                  checked={selectedUsers.some(
                    (selected) => selected.value === user
                  )} // Ensure it reflects the state
                  onChange={(e) => handleUserChange(e, user)}
                  style={{ marginLeft: "20px", padding: "0 10px" }}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
        <Form.Group controlId="statusSelector" style={{ flex: 1 }}>
          <Form.Select
            value={selectedGroupStatus}
            onChange={(e) => handleFilterApply(e.target.value)}
            style={{ ...smallerFormStyles, height: "52px" }} // Adjust the height here
          >
            <option value="">SELECT STATUS</option>
            {groupstatus.map((status, index) => (
              <option key={index} value={status}>
                {status.toUpperCase()}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Date Range Picker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <Form.Group controlId="startDate" style={{ flex: 1 }}>
                  <Form.Control
                    {...startProps}
                    type="text"
                    style={smallerFormStyles}
                  />
                </Form.Group>
                <Form.Group controlId="endDate" style={{ flex: 1 }}>
                  <Form.Control
                    {...endProps}
                    type="text"
                    style={smallerFormStyles}
                  />
                </Form.Group>
              </>
            )}
          />
        </LocalizationProvider>
      </Box>

      {/* Total Count Card */}
      {isFilterApplied && (
        <Row className="mb-1 d-flex justify-content-between align-items-center">
          <Col xs={6}>
            <div className="text-start fw-bold fs-4 text-primary">
              Total profiles: {uniqueFlattenedProfiles.length}
            </div>
          </Col>
          <Col xs={6} className="text-end">
            <Button
              variant="contained"
              onClick={() => handleDownloadExcel(uniqueFlattenedProfiles)}
            >
              Download Data Excel
            </Button>
          </Col>
        </Row>
      )}

      {/* Table to display filtered profiles */}
      {loading ? (
        <Typography variant="h6">
          <div class="spinner-border text-primary"></div>
        </Typography>
      ) : isFilterApplied ? (
        uniqueFlattenedProfiles.length > 0 ? (
          <>
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
                    <TableCell style={headerStyle}>Created At</TableCell>
                    <TableCell style={headerStyle}>Applicant Name</TableCell>
                    <TableCell style={headerStyle}> Referred_by</TableCell>
                    <TableCell style={headerStyle}>Rreference_ids</TableCell>
                    <TableCell style={headerStyle}>Work Location</TableCell>
                    <TableCell style={headerStyle}>Screening Manager</TableCell>
                    <TableCell style={headerStyle}>Interviewer</TableCell>
                    <TableCell style={headerStyle}>HR Name</TableCell>
                    <TableCell style={headerStyle}>Status</TableCell>
                    <TableCell style={headerStyle}>Joining Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentProfiles.map((profile, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{serialNumber++}</TableCell>
                      <TableCell className="text-center">
                        {profile.created_at_date
                          ? dayjs(profile.created_at_date).format("YYYY-MM-DD")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Box display="flex">
                          <Box ml={2}>
                            <Typography
                              variant="body1"
                              style={{ fontWeight: "bold" }}
                            >
                              {" "}
                              {profile.applicant_name || "N/A"}
                            </Typography>

                            <Typography variant="body1" color="textSecondary"  >
                              {profile.applicant_phone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell className="text-center">
                        {profile.applicant_referred_by || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {profile.applicant_reference_id || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {profile.work_location_name || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {profile.screening_manager_name || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">{profile.interviewer_name || "N/A"}</TableCell>
                      <TableCell className="text-center">{profile.hr_name || "N/A"}</TableCell>
                      <TableCell className="text-center">{profile.status || "N/A"}</TableCell>
                      <TableCell className="text-center">{profile.joining_date || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Component */}
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
            No profiles found For Above Filters
          </Typography>
        )
      ) : (
        <Typography variant="h6" color="textSecondary">
          Please apply filters to view profiles
        </Typography>
      )}
    </Container>
  );
};

// Styling for the Table header
const headerStyle = {
  backgroundColor: "#E10174",
  color: "#ffffff",
  textAlign:'center'
};

export default DetailedView;

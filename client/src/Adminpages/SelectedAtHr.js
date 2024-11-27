import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import "react-toastify/dist/ReactToastify.css";
import CustomDateRangePicker from "./DateFilter";
import MarketSelector from "./MarketSelector";
import { Tabs, Tab, Card, Typography } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  Popover,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { MdOutlineArrowDropDown } from "react-icons/md";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import decodeToken from "../decodedDetails";
function SelectedAtHr() {
  const apiurl = process.env.REACT_APP_API;
  const [data, setData] = useState([]);
  const [showDateInput, setShowDateInput] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState(new Set());
  const [selectedTab, setSelectedTab] = useState(0);
  const [marketFilter, setMarketFilter] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [joiningDateFilter, setJoiningDateFilter] = useState([null, null]);
  const [candidateFilter, setCandidateFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMarket1, setSelectedMarket1] = useState([]);
  const [marketFilter1, setMarketFilter1] = useState([]);
  const [selectedMarket2, setSelectedMarket2] = useState([]);
  // const [marketFilter2, setMarketFilter2] = useState([]);
  const userData = decodeToken()?.name;
  const role = decodeToken()?.role;
  const userMarket = {
    "Ali Khan": "ARIZONA",
    "Rahim Nasir Khan": "BAY AREA",
    "Shah Noor Butt": "COLORADO",
    "Nazim Sundrani": "DALLAS",
    "Afzal Muhammad": "El Paso",
    "Adnan Barri": "HOUSTON",
    "Maaz Khan": "LOS ANGELES",
    "Mohamad Elayan": "MEMPHIS/NASHVILLE / FLORIDA",
    "Uzair Uddin": "NORTH CAROL",
    "Faizan Jiwani": "SACRAMENTO",
    "Hassan Saleem": "SAN DEIGIO",
    "Kamaran Mohammed": "SAN FRANCISCO",
  };
  const tokenMarket = userMarket[userData]?.toLowerCase();
  // console.log(selectedMarket, selectedMarket1, selectedMarket2);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    const fetchApplicantsData = async () => {
      try {
        const response = await axios.get(`${apiurl}/applicants/selected-at-hr`);
        // console.log(response.data.data, "redd");
        if (response.status === 200) {
          setData(response.data.data);
          setFilteredData(response.data.data);
        } else {
          toast.error("Error fetching applicants data");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Error fetching applicants");
      }
    };

    fetchApplicantsData();
  }, [apiurl]);

  useEffect(() => {
    let candidateDetails = [...data];
    if (candidateFilter) {
      const lowerCaseCandidateFilter = candidateFilter.toLowerCase().trim();
      candidateDetails = candidateDetails.filter((row) => {
        const candidateDetails = `${row.name?.toLowerCase()} ${row.email?.toLowerCase()} ${row.phone?.toLowerCase()}`;
        return candidateDetails.includes(lowerCaseCandidateFilter);
      });
    }
    setFilteredData(candidateDetails);
  }, [candidateFilter]);

  useEffect(() => {
    let updatedData = [...data];
  
    // If `tokenMarket` is present, filter based on `tokenMarket` in either `MarketHiringFor` or `TrainingAt`
    if (tokenMarket) {
      const lowerCaseTokenMarket = tokenMarket.toLowerCase().trim();
      updatedData = updatedData.filter((row) => {
        const marketValue = row.MarketHiringFor?.toLowerCase().trim() || "";
        // Check if either `MarketHiringFor` or `TrainingAt` matches `tokenMarket`
        return marketValue.includes(lowerCaseTokenMarket);
      });
      // console.log("Filtered by tokenMarket (MarketHiringFor or TrainingAt):", updatedData);
    } else {
      // First filter: `marketFilter` on `MarketHiringFor` and `TrainingAt`
      if (marketFilter.length > 0) {
        const lowerCaseMarketFilter = marketFilter.map((market) =>
          market.toLowerCase().trim()
        );
        updatedData = updatedData.filter((row) => {
          const marketValue = row.MarketHiringFor?.toLowerCase().trim() || "";
          return lowerCaseMarketFilter.some(
            (filter) => marketValue.includes(filter)
          );
        });
        // console.log("After First Market Filter (MarketHiringFor and TrainingAt):", updatedData);
      }
  
      // Second filter: `marketFilter1` on `MarketHiringFor` and `TrainingAt`
      if (marketFilter1.length > 0) {
        const lowerCaseMarketFilter1 = marketFilter1.map((market) =>
          market.toLowerCase().trim()
        );
        updatedData = updatedData.filter((row) => {
          const marketValue = row.MarketHiringFor?.toLowerCase().trim() || "";
          return lowerCaseMarketFilter1.some(
            (filter) => marketValue.includes(filter)
          );
        });
        // console.log("After Second Market Filter (MarketHiringFor and TrainingAt):", updatedData);
      }
    }
  
    // Date filter on `DateOfJoining`
    const [startDate, endDate] = joiningDateFilter;
    if (startDate && endDate) {
      // Convert startDate and endDate to Date objects (local timezone)
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
  
      if (startDateObj && endDateObj) {
        // Adjust the start date to the beginning of the day (00:00:00) in local time
        const adjustedStartDate = new Date(startDateObj);
        adjustedStartDate.setHours(0, 0, 0, 0);
  
        // Adjust the end date to the end of the day (23:59:59.999) in local time
        const adjustedEndDate = new Date(endDateObj);
        adjustedEndDate.setHours(23, 59, 59, 999);
  
        // Convert the local adjusted dates to UTC for filtering
        const adjustedStartDateUTC = new Date(adjustedStartDate).toISOString();
        const adjustedEndDateUTC = new Date(adjustedEndDate).toISOString();
  
        // Filter rows by checking if the joining date (in UTC) is within the range
        updatedData = updatedData.filter((row) => {
          // Assuming row.created_at is in UTC format
          const joiningDate = new Date(row.created_at);  // The row's created_at should be in UTC
  
          // Compare joiningDate with adjustedStartDate and adjustedEndDate (both in UTC)
          return joiningDate >= new Date(adjustedStartDateUTC) && joiningDate <= new Date(adjustedEndDateUTC);
        });
  
        // console.log("After Date Filter:", updatedData);
      }
    }
  
    // Status filter based on `selectedTab`
    updatedData = updatedData.filter((row) => {
      switch (selectedTab) {
        case 0:
          return row.status === "selected at Hr";
        case 1:
          return row.status === "mark_assigned";
        case 2:
          return row.status === "backOut";
        default:
          return true;
      }
    });
  
    // console.log("Final Filtered Data:", updatedData);
  
    // Update filtered data state
    setFilteredData(updatedData);
  
  }, [
    marketFilter,
    marketFilter1,
    joiningDateFilter,
    data,
    selectedTab,
    tokenMarket,
  ]);
  

  const handleInputChange = (uuid, field, value) => {
    setFilteredData((prevFilteredData) =>
      prevFilteredData.map((row) =>
        row.applicant_uuid === uuid ? { ...row, [field]: value } : row
      )
    );

    setData((prevData) =>
      prevData.map((row) =>
        row.applicant_uuid === uuid ? { ...row, [field]: value } : row
      )
    );
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  }

  const isValidRow = (row) => {
    // Ensure row is not null or undefined
    if (!row) return false;

    // Check the properties if row is valid
    return (
      row.ntidCreated && row.ntidCreatedDate && row.ntid && row.addedToSchedule
    );
  };

  const handleIconClick = async (applicant_uuid) => {
    // console.log("Icon clicked for applicant_uuid:", applicant_uuid);

    const newClickedIndexes = new Set(clickedIndexes);

    // Log the clickedIndexes set to ensure it contains the correct uuid
    // console.log("Previous clicked indexes:", clickedIndexes);

    if (newClickedIndexes.has(applicant_uuid)) {
      newClickedIndexes.delete(applicant_uuid);
    } else {
      // Find rowData using applicant_uuid directly
      const rowData = filteredData.find(
        (row) => row.applicant_uuid === applicant_uuid
      );

      if (!rowData) {
        console.error("No row data found for applicant_uuid:", applicant_uuid);
        return; // Exit early if no data exists for this uuid
      }

      // console.log("Row Data:", rowData);

      if (isValidRow(rowData)) {
        newClickedIndexes.add(applicant_uuid);

        const { ntidCreated, ntidCreatedDate, ntid, addedToSchedule } = rowData;
        // console.log("Data to send:", {
        //   ntidCreated,
        //   ntidCreatedDate,
        //   ntid,
        //   addedToSchedule,
        // });

        try {
          const response = await axios.post(`${apiurl}/ntids`, {
            ntidCreated,
            ntidCreatedDate,
            ntid,
            addedToSchedule,
            markAsAssigned: true,
            applicant_uuid,
          });

          if (response.status === 201) {
            toast.success("NTID entry created successfully!");
            setClickedIndexes(newClickedIndexes);
            setTimeout(() => {
              window.location.reload(); // Corrected to 'window.location.reload()'
            }, 2000); // 2000 milliseconds = 2 seconds
          }
        } catch (error) {
          console.error("API error:", error);
          toast.error("Error creating NTID entry: " + error.message);
        }
      } else {
        toast.error("Please fill all required fields before submitting!");
      }
    }

    // Update clicked indexes after operation
    setClickedIndexes(newClickedIndexes);
  };

  const confirmAction = async (applicant_uuid, action, name) => {
    // Ask for confirmation using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} for this applicant ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const payload = {
        applicant_uuid: applicant_uuid,
        action,
      };
      // console.log(payload, "payload");

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/updatestatus`,
          payload
        );

        if (res.status === 200) {
          toast.success(res.data.message);

          setTimeout(() => {
            window.location.reload();
          }, 1800);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status.");
      }
    } else {
      toast.info("Action canceled");
    }
  };
  const confirmContractSign = async (applicant_uuid, name) => {
    // Ask for confirmation using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to sign the contract for this applicant ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const payload = {
        applicant_uuid: applicant_uuid,
      };
      // console.log(payload, "payload");

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/contractsign`,
          payload
        );

        if (res.status === 200) {
          toast.success(res.data.message);

          setTimeout(() => {
            window.location.reload();
          }, 1800);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status.");
      }
    } else {
      toast.info("Action canceled");
    }
  };

  const downloadAsExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      console.error("No data available to export");
      return;
    }
    // Create a new worksheet from the filtered data
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((row) => ({
        Name: row.name,
        Email: row.email,
        Phone: row.phone,
        ReferedBy: row.referred_by,
        Reference_id: row.reference_id,
        created_at: row.created_at,
        DateOfJoining:
          new Date(row.DateOfJoining).toLocaleDateString() || "N/A", // Formatting the date
        MarketHiringFor: row.MarketHiringFor || "N/A",
        TrainingAt: row.TrainingAt || "N/A",
        CompensationType: row.compensation_type || "N/A",
        Payment: row.payment || "N/A",
        Payroll: row.payroll || "N/A",
        NoOfDays: row.noOFDays || "N/A",
        OffDays: row.offDays || "N/A", // Handle null
        Status: row.status,
        NTIDCreated: row.ntidCreated || "N/A", // Handle null
        NTIDCreatedDate: row.ntidCreatedDate
          ? new Date(row.ntidCreatedDate).toLocaleDateString()
          : "N/A",
        AddedToSchedule: row.addedToSchedule || "N/A", // Handle null
        ContractDisclosed: row.contractDisclosed || "N/A",
        // Handle null
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants Data");
    XLSX.writeFile(workbook, `FilteredData.xlsx`);
  };

  function getDifferenceInDays(created_at, updatedDate) {
    if (!updatedDate) {
      return 0;
    }
    // Parse the input date strings
    const inputDate = new Date(created_at);
    const currentDate = new Date(updatedDate);

    // Check if both dates are valid
    if (isNaN(inputDate.getTime()) || isNaN(currentDate.getTime())) {
      return 0; // Return 0 if either date is invalid
    }

    // Calculate the absolute difference in milliseconds
    const differenceInMilliseconds = Math.abs(currentDate - inputDate);

    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return differenceInDays;
  }

  const uniqdata = filteredData
    .filter(
      (profile, index, self) =>
        index ===
        self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
    )
    .sort((a, b) => new Date(a.DateOfJoining) - new Date(b.DateOfJoining));

    function formatDateToCST(dateString) {
     const x=dateString.slice(0,4)
     const y=dateString.slice(5,)
     return y+"-"+x;  
     
    }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Selected at HR" />
        <Tab label="Mark Assigned" />
        <Tab label="Backed Out" />
      </Tabs>

      <Row className="d-flex justify-content-between mt-4">
        <Col className="col-md-2">
          {role !== "market_manager" && (
            <MarketSelector
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
              isAllSelected={isAllSelected}
              setIsAllSelected={setIsAllSelected}
              setMarketFilter={setMarketFilter}
              text={"Select Market"}
            />
          )}

          <Button
            className="btn btn-success mb-2"
            onClick={() => downloadAsExcel()}
          >
            Download In Excel
          </Button>
        </Col>
        <Col className="col-md-6"></Col>
        <Col className="col-md-4">
          <CustomDateRangePicker
            joiningDateFilter={joiningDateFilter}
            setJoiningDateFilter={setJoiningDateFilter}
          />
        </Col>
      </Row>

      {uniqdata.length === 0 ? (
        <Card
          style={{
            padding: "30px", // Adjusted padding
            marginTop: "20px",
            justifyContent: "center",
            textAlign: "center",
            width: "60%",
            margin: "0 auto",
            backgroundColor: "#f5f5f5",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            style={{ color: "#3f51b5", fontWeight: "bold" }}
          >
            Select Markets to Create NTID Right Now
          </Typography>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          style={{ maxHeight: "600px", overflowY: "auto", margin: "0 16px" }}
        >
          <Table
            stickyHeader
            style={{ tableLayout: "auto", fontSize: "0.6rem" }}
          >
            {" "}
            {/* Reduced font size */}
            <TableHead>
            <TableRow style={{ headerStyle }}>
  {[
    "SINo",
    "CandidateDetails",
    "Market Hiring For",
    "Training Hiring For",
    "Duration",
    "DOJ",
    "Payroll/Compensation Type",
    "Payment",
    "work Hours/No.Of Days & Off-Days",
    "Back Out",
    "Contract Disclosed",
    "Added to Schedule",
    "Contract Signed",
    "NTID Created",
    "NTID Created Date",
    "NTID",
    "Mark As Assigned",
  ].map((header) =>
    // Conditionally render the 'Back Out' column based on uniqdata
    header === "Back Out" ? (
      uniqdata.some((row) => row.status !== "mark_assigned") && (
        <TableCell
          key={header}
          style={headerStyle}
          className="text-center text-capitalize"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body4" style={{ marginRight: "1px" }}>
              {header}
            </Typography>
          </div>
        </TableCell>
      )
    ) : header === "Contract Signed" ? (
      uniqdata.some((row) => row.status !== "backOut" && row.status !== "mark_assigned") && (
        <TableCell
          key={header}
          style={headerStyle}
          className="text-center text-capitalize"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body4" style={{ marginRight: "1px" }}>
              {header}
            </Typography>
          </div>
        </TableCell>
      )
    ) : (
      <TableCell
        key={header}
        style={headerStyle}
        className="text-center text-capitalize"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body4" style={{ marginRight: "1px" }}>
            {header}
          </Typography>

          {/* CandidateDetails Filter */}
          {header === "CandidateDetails" && (
            <>
              <IconButton onClick={handleClick}>
                <MdOutlineArrowDropDown className="text-secondary" />
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Candidate..."
                  value={candidateFilter}
                  onChange={(e) => setCandidateFilter(e.target.value)}
                  style={{ width: "200px" }}
                />
              </Popover>
            </>
          )}
        </div>
      </TableCell>
    )
  )}
</TableRow>

            </TableHead>
            <TableBody>
              {uniqdata.map((row, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
                    height: "32px", // Set a fixed height for rows
                  }}
                >
                  <TableCell
                    style={{ padding: "2px 4px" }}
                    className="text-center"
                  >
                    {index + 1}
                  </TableCell>

                  <TableCell style={{ padding: "2px 4px" }}>
                    <Box display="flex" alignItems="center">
                      <Box ml={2}>
                        <Tooltip
                          title={
                            <>
                              <Typography variant="body2">
                                {row.email}
                              </Typography>
                              <Typography variant="body2">
                                {row.phone}
                              </Typography>
                              <Typography variant="body2">
                                {row.applicant_uuid}
                              </Typography>
                            </>
                          }
                          arrow
                        >
                          <Typography
                            variant="body2"
                            style={{
                              fontWeight: "bold",
                              cursor: "pointer",
                              padding: "2px 4px",
                              fontSize: "0.8rem",
                            }}
                          >
                            {row.name}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell
                    className="text-capitalize text-center"
                    style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                  >
                    {row.MarketHiringFor?.toLowerCase()}
                  </TableCell>
                  <TableCell
                    className="text-capitalize text-center"
                    style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                  >
                    {row.TrainingAt?.toLowerCase() || "N/A"}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    style={{ padding: "1px 2px", fontSize: "0.6rem" }}
                  >
                    <Typography style={{ fontSize: "0.7rem" }}>
                      {getDifferenceInDays(row.created_at, row.updatedDate) ||
                        0}{" "}
                      days
                    </Typography>
                  </TableCell>

                  <TableCell
                    className="text-center"
                    style={{ padding: "1px 2px", fontSize: "0.6rem" }}
                  >
                    {row.status === "mark_assigned" ||
                    row.status === "backOut" ? (
                      <Typography
                        style={{
                          fontSize: "0.7rem",
                          color: "inherit", // No red color if status is 'mark_assigned' or 'backOut'
                        }}
                      >
                        {formatDateToCST(row.DateOfJoining.slice(0,10))}
                      </Typography>
                    ) : (
                      <Typography
                        style={{
                          fontSize: "0.7rem",
                          color:
                            new Date(row.DateOfJoining) < new Date()
                              ? "red"
                              : "inherit", // Set color to red if the date has passed and status is not 'mark_assigned' or 'backOut'
                        }}
                      >
                        {formatDateToCST(row.DateOfJoining.slice(0,10))}
                        {/* Display the DateOfJoining */}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                    <Box display="flex" alignItems="center">
                      <Box ml={2}>
                        <Typography variant="body3">
                          {row.payroll || "NA"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {row.compensation_type}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell
                    className="text-center"
                    style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                  >
                    {row.payment > 0 ? `$ ${row.payment}` : "N/A"}
                  </TableCell>

                  <TableCell
                    className="text-center"
                    style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                  >
                    {row.noOFDays || "N/A"}
                    {row.offDays?.length > 0 && (
                      <span>
                        <br />
                        OffDays:
                        {row.offDays}
                      </span>
                    )}
                  </TableCell>
                  {row.status !== "mark_assigned" &&
                    row.status !== "backOut" && (
                      <TableCell
                        className="text-center"
                        style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                      >
                        <button
                          className="btn"
                          style={{
                            padding: "2px 4px",
                            fontSize: "0.7rem",
                            color: "white",
                            backgroundColor: "#ff0000",
                          }}
                          onClick={() =>
                            confirmAction(
                              row.applicant_uuid,
                              "backOut",
                              row.name
                            )
                          }
                        >
                          Back Out
                        </button>
                      </TableCell>
                    )}
                  {row.status === "backOut" && (
                    <TableCell
                      className="text-center"
                      style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                    >
                      <button
                        className="btn"
                        style={{
                          padding: "2px 4px",
                          fontSize: "0.7rem",
                          color: "white",
                          backgroundColor: "green",
                        }}
                        onClick={() =>
                          confirmAction(row.applicant_uuid, "selected at Hr")
                        }
                      >
                        call back
                      </button>
                    </TableCell>
                  )}

                  <TableCell
                    className="text-center"
                    style={{ padding: "2px 4px", fontSize: "0.6rem" }}
                  >
                    {row.contractDisclosed === 1 ? (
                      <CheckCircleSharpIcon className="text-success" />
                    ) : (
                      <CancelRoundedIcon className="text-danger" />
                    )}
                  </TableCell>

                  <TableCell
                    className="text-center"
                    style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                  >
                    <Checkbox
                      checked={row.addedToSchedule}
                      onChange={(e) =>
                        handleInputChange(
                          row.applicant_uuid,
                          "addedToSchedule",
                          e.target.checked
                        )
                      }
                      disabled={
                        row.status === "mark_assigned" ||row.contract_sined===0||
                        row.status === "backOut"
                      }
                      sx={{
                        color:
                          row.status === "mark_assigned"
                            ? "#46aba2"
                            : undefined,
                        "&.Mui-checked": {
                          color:
                            row.status === "mark_assigned"
                              ? "#46aba2"
                              : undefined,
                        },
                        "&.Mui-disabled": {
                          color:
                            row.status === "mark_assigned"
                              ? "#46aba2"
                              : undefined,
                        },
                      }}
                      size="small"
                      style={
                        row.status === "mark_assigned"
                          ? { color: "#46aba2" }
                          : {}
                      }
                    />
                  </TableCell>
                  {row.status !== "mark_assigned" &&
                    row.status !== "backOut" && (
                      <TableCell
                        className="text-center"
                        style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                      >
                        <button
                          className="btn"
                          style={{
                            padding: "2px 4px",
                            fontSize: "0.7rem",
                            color: "white",
                            backgroundColor: row.contract_sined === 0 ? "#ff0000" : "#46ab2f", // Red if not signed, Green if signed
                          }}
                          onClick={() =>
                            confirmContractSign(row.applicant_uuid, row.name)
                          }
                        >
                          {row.contract_sined===0
                            ? " Sign "
                            : "Signed"}
                        </button>
                      </TableCell>
                    )}

                  <TableCell
                    className="text-center"
                    style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                  >
                    <Checkbox
                      checked={row.ntidCreated}
                      onChange={(e) =>
                        handleInputChange(
                          row.applicant_uuid,
                          "ntidCreated",
                          e.target.checked
                        )
                      }
                      disabled={
                        row.status === "mark_assigned" ||row.contract_sined === 0||
                        row.status === "backOut"
                      }
                      sx={{
                        color:
                          row.status === "mark_assigned"
                            ? "#46aba2"
                            : undefined,
                        "&.Mui-checked": {
                          color:
                            row.status === "mark_assigned"
                              ? "#46aba2"
                              : undefined,
                        },
                        "&.Mui-disabled": {
                          color:
                            row.status === "mark_assigned"
                              ? "#46aba2"
                              : undefined,
                        },
                      }}
                      size="small"
                      style={
                        row.status === "mark_assigned"
                          ? { color: "#46aba2" }
                          : {}
                      }
                    />
                  </TableCell>

                  <TableCell sx={{ padding: "2px" }} className="text-center">
                    {row.status === "mark_assigned" ? (
                      formatDate(row.ntidCreatedDate)
                    ) : showDateInput ? (
                      <TextField
                        type="date"
                        value={row.ntidCreatedDate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            row.applicant_uuid,
                            "ntidCreatedDate",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                          readOnly: row.status === "mark_assigned",
                        }}
                        sx={{ width: "120px" }}
                        disabled={row.status === "backOut"||row.contract_sined === 0} // Adjusted width
                      />
                    ) : (
                      <IconButton
                        onClick={() => setShowDateInput(true)}
                        size="small"
                      >
                        <CalendarTodayIcon className="fs-6" />
                      </IconButton>
                    )}
                  </TableCell>

                  <TableCell
                    className="text-center"
                    style={{ padding: "2px 4px", fontSize: "0.7rem" }}
                  >
                    <TextField
                      value={row.ntid || ""}
                      onChange={(e) =>
                        handleInputChange(
                          row.applicant_uuid,
                          "ntid",
                          e.target.value
                        )
                      }
                      variant="outlined"
                      size="small" // Adjusted size to small
                      sx={{
                        width: "80px",
                        "& .MuiInputBase-input": {
                          fontSize: "14px",
                          padding: "4px 6px",
                        }, // Set font size and padding inside the input
                      }}
                      InputProps={{
                        readOnly: row.status === "mark_assigned",
                      }}
                      disabled={row.status === "backOut"|| row.contract_sined === 0}
                    />
                  </TableCell>

                  <TableCell
  className="text-center"
  style={{ padding: "2px 4px", fontSize: "0.7rem" }}
>
  {row.status === "mark_assigned" || row.status === "backOut" || row.contract_sined === 0 ? (
    <IconButton disabled>
      <CheckCircleIcon
        style={{
          color: row.status === "backOut" ? "#f44336" : "#46aba2", // red for 'backOut', green otherwise
        }}
      />
    </IconButton>
  ) : (
    <IconButton
      onClick={() => handleIconClick(row.applicant_uuid)}
      disabled={clickedIndexes.has(index)}
    >
      <CheckCircleIcon
        style={{
          color: "#3f51b5",
        }}
      />
    </IconButton>
  )}
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ToastContainer />
        </TableContainer>
      )}
    </LocalizationProvider>
  );
}
const headerStyle = {
  backgroundColor: "#3f51b5",
  color: "#ffffff",
  padding: "2px",
  position: "sticky",
  top: 0,
  fontSize: "0.7vw",
  textAlign: "center",
  width: "5%", // Adjust the width to decrease it (you can change the value as needed)
  lineHeight: "1.2", // Decrease the line height for tighter text
};

export default SelectedAtHr;

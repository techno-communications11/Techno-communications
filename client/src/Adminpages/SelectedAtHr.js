import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, Tab, Typography } from "@mui/material";
import { Row, Col, Button } from "react-bootstrap";
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
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { debounce } from "lodash";
import { FixedSizeList } from "react-window";
import MarketSelector from "./MarketSelector";
import DateFilter from "./DateFilter";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useContext } from "react";
import { MyContext } from "../pages/MyContext";
import Loader from "../utils/Loader";

// Reusable Hook for Filtering Logic
const useFilters = (
  data,
  tokenMarket,
  marketFilter,
  marketFilter1,
  joiningDateFilter,
  selectedTab,
  candidateFilter
) => {
  const filteredData = useMemo(() => {
    if (!data) return [];
    let updatedData = data;

    // Pre-compute lowercase values for efficiency
    const lowerCaseTokenMarket = tokenMarket?.toLowerCase().trim();
    const lowerCaseMarketFilter = marketFilter.map((market) =>
      market.toLowerCase().trim()
    );
    const lowerCaseMarketFilter1 = marketFilter1.map((market) =>
      market.toLowerCase().trim()
    );
    const lowerCaseCandidateFilter = candidateFilter?.toLowerCase().trim();

    // Single-pass filtering
    updatedData = updatedData.filter((row) => {
      const marketValue = row.MarketHiringFor?.toLowerCase().trim() || "";
      const candidateDetails = `${row.name?.toLowerCase() || ""} ${
        row.email?.toLowerCase() || ""
      } ${row.phone?.toLowerCase() || ""}`;

      // Token Market Filter
      if (lowerCaseTokenMarket && !marketValue.includes(lowerCaseTokenMarket)) {
        return false;
      }

      // Market Filter 1
      if (
        lowerCaseMarketFilter.length > 0 &&
        !lowerCaseMarketFilter.some((filter) => marketValue.includes(filter))
      ) {
        return false;
      }

      // Market Filter 2 (retained for compatibility, though unused)
      if (
        lowerCaseMarketFilter1.length > 0 &&
        !lowerCaseMarketFilter1.some((filter) => marketValue.includes(filter))
      ) {
        return false;
      }

      // Date Filter
      const [startDate, endDate] = joiningDateFilter;
      if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        if (startDateObj && endDateObj) {
          const adjustedStartDate = new Date(
            startDateObj.setHours(0, 0, 0, 0)
          ).toISOString();
          const adjustedEndDate = new Date(
            endDateObj.setHours(23, 59, 59, 999)
          ).toISOString();
          const joiningDate = new Date(row.created_at);
          if (
            joiningDate < new Date(adjustedStartDate) ||
            joiningDate > new Date(adjustedEndDate)
          ) {
            return false;
          }
        }
      }

      // Status Filter
      const statusMap = {
        0: "selected at Hr",
        1: "mark_assigned",
        2: "backOut",
      };
      if (statusMap[selectedTab] && row.status !== statusMap[selectedTab]) {
        return false;
      }

      // Candidate Filter
      if (
        lowerCaseCandidateFilter &&
        !candidateDetails.includes(lowerCaseCandidateFilter)
      ) {
        return false;
      }

      return true;
    });

    return updatedData;
  }, [
    data,
    tokenMarket,
    marketFilter,
    marketFilter1,
    joiningDateFilter,
    selectedTab,
    candidateFilter,
  ]);

  return filteredData;
};

// Reusable Filters Component
const Filters = memo(
  ({
    role,
    selectedMarket,
    setSelectedMarket,
    isAllSelected,
    setIsAllSelected,
    setMarketFilter,
    joiningDateFilter,
    setJoiningDateFilter,
    onDownload,
  }) => (
    <Row className="d-flex justify-content-between mt-2 mb-2">
      <Col className="col-md-4 d-flex align-items-end">
        {role !== "market_manager" && (
          <>
            <div className="me-2">
              <MarketSelector
                selectedMarket={selectedMarket}
                setSelectedMarket={setSelectedMarket}
                isAllSelected={isAllSelected}
                setIsAllSelected={setIsAllSelected}
                setMarketFilter={setMarketFilter}
                text="Select Market"
              />
            </div>
            <Button className="btn btn-success" onClick={onDownload}>
              Download In Excel
            </Button>
          </>
        )}
      </Col>
      <Col className="col-md-4"></Col>
      <Col className="col-md-4">
        <DateFilter
          dateFilter={joiningDateFilter}
          setDateFilter={setJoiningDateFilter}
        />
      </Col>
    </Row>
  )
);

// Reusable Row Actions Component
const RowActions = memo(
  ({
    row,
    clickedIndexes,
    handleIconClick,
    confirmAction,
    confirmContractSign,
    handleInputChange,
    showDateInput,
    setShowDateInput,
    formatDate,
    columns,
  }) => {
    let columnIndex = 11; // Start after the first 9 columns defined in RenderRow
    return (
      <>
        {row.status !== "mark_assigned" && row.status !== "backOut" && (
          <TableCell
            className="text-center "
            style={{
              padding: "7px 8px",
              fontSize: "0.6rem",
              width: columns[columnIndex].width,
            }}
          >
            <button
              className="btn"
              style={{
                padding: "4px 6px",
                fontSize: "0.6rem",
                color: "white",
                backgroundColor: "#ff0000",
              }}
              onClick={() =>
                confirmAction(row.applicant_uuid, "backOut", row.name)
              }
            >
              Back Out
            </button>
          </TableCell>
        )}
        {row.status === "backOut" && (
          <TableCell
            className="text-center ms-3 "
            style={{
              padding: "7px 8px",
              fontSize: "0.6rem",
              width: columns[columnIndex].width,
            }}
          >
            <button
              className="btn"
              style={{
                padding: "7px 8px",
                fontSize: "0.6rem",
                color: "white",
                backgroundColor: "green",
              }}
              onClick={() =>
                confirmAction(row.applicant_uuid, "selected at Hr", row.name)
              }
            >
              Call Back
            </button>
          </TableCell>
        )}
        {row.status !== "mark_assigned" && row.status !== "backOut"}
        {row.status === "backOut"}
        <TableCell
          className="text-center ms-2"
          style={{
            padding: "7px 8px",
            fontSize: "0.6rem",
            width: columns[columnIndex++].width,
          }}
        >
          {row.contractDisclosed === 1 ? (
            <CheckCircleSharpIcon className="text-success" />
          ) : (
            <CancelRoundedIcon className="text-danger" />
          )}
        </TableCell>
        <TableCell
          className="text-center"
          style={{
            padding: "7px 8px",
            fontSize: "0.6rem",
            width: columns[columnIndex++].width,
          }}
        >
          <Checkbox
            checked={!!row.addedToSchedule}
            onChange={(e) =>
              handleInputChange(
                row.applicant_uuid,
                "addedToSchedule",
                e.target.checked
              )
            }
            disabled={
              row.status === "mark_assigned" ||
              row.contract_sined === 0 ||
              row.status === "backOut"
            }
            sx={{
              color: row.status === "mark_assigned" ? "#46aba2" : undefined,
              "&.Mui-checked": {
                color: row.status === "mark_assigned" ? "#46aba2" : undefined,
              },
              "&.Mui-disabled": {
                color: row.status === "mark_assigned" ? "#46aba2" : undefined,
              },
            }}
            size="small"
            style={row.status === "mark_assigned" ? { color: "#46aba2" } : {}}
          />
        </TableCell>
        {row.status !== "mark_assigned" && row.status !== "backOut" && (
          <TableCell
            className="text-center"
            style={{
              padding: "7px 8px",
              fontSize: "0.6rem",
              width: columns[columnIndex].width,
            }}
          >
            <button
              className="btn"
              style={{
                padding: "4px 6px",
                fontSize: "0.6rem",
                color: "white",
                backgroundColor:
                  row.contract_sined === 0 ? "#ff0000" : "#46ab2f",
              }}
              onClick={() => confirmContractSign(row.applicant_uuid, row.name)}
            >
              {row.contract_sined === 0 ? " Sign " : "Signed"}
            </button>
          </TableCell>
        )}
        {row.status !== "mark_assigned" && row.status !== "backOut"}
        <TableCell
          className="text-center"
          style={{
            padding: "7px 8px",
            fontSize: "0.6rem",
            width: columns[columnIndex++].width,
          }}
        >
          <Checkbox
            checked={!!row.ntidCreated}
            onChange={(e) =>
              handleInputChange(
                row.applicant_uuid,
                "ntidCreated",
                e.target.checked
              )
            }
            disabled={
              row.status === "mark_assigned" ||
              row.contract_sined === 0 ||
              row.status === "backOut"
            }
            sx={{
              color: row.status === "mark_assigned" ? "#46aba2" : undefined,
              "&.Mui-checked": {
                color: row.status === "mark_assigned" ? "#46aba2" : undefined,
              },
              "&.Mui-disabled": {
                color: row.status === "mark_assigned" ? "#46aba2" : undefined,
              },
            }}
            size="small"
            style={row.status === "mark_assigned" ? { color: "#46aba2" } : {}}
          />
        </TableCell>
        <TableCell
          sx={{ padding: "7px 8px" }}
          className="text-center"
          style={{ width: columns[columnIndex++].width }}
        >
          {row.status === "mark_assigned" ? (
            formatDate(row.ntidCreatedDate)
          ) : showDateInput[row.applicant_uuid] ? (
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
              InputProps={{ readOnly: row.status === "mark_assigned" }}
              sx={{ width: "120px" }}
              disabled={row.status === "backOut" || row.contract_sined === 0}
            />
          ) : (
            <IconButton
              onClick={() =>
                setShowDateInput((prev) => ({
                  ...prev,
                  [row.applicant_uuid]: true,
                }))
              }
              size="small"
            >
              <CalendarTodayIcon className="fs-6" />
            </IconButton>
          )}
        </TableCell>
        <TableCell
          className="text-center"
          style={{
            padding: "5px 6px",
            fontSize: "0.6rem",
            width: columns[columnIndex++].width,
          }}
        >
          <TextField
            value={row.ntid || ""}
            onChange={(e) =>
              handleInputChange(row.applicant_uuid, "ntid", e.target.value)
            }
            variant="outlined"
            size="small"
            sx={{
              width: "80px",
              "& .MuiInputBase-input": {
                fontSize: "0.8rem",
                padding: "7px 8px",
              },
            }}
            InputProps={{ readOnly: row.status === "mark_assigned" }}
            disabled={row.status === "backOut" || row.contract_sined === 0}
          />
        </TableCell>
        <TableCell
          className="text-center"
          style={{
            padding: "7px 8px",
            fontSize: "0.6rem",
            width: columns[columnIndex++].width,
          }}
        >
          {row.status === "mark_assigned" ||
          row.status === "backOut" ||
          row.contract_sined === 0 ? (
            <IconButton disabled>
              <CheckCircleIcon
                style={{
                  color: row.status === "backOut" ? "#f44336" : "#46aba2",
                }}
              />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleIconClick(row.applicant_uuid)}
              disabled={clickedIndexes.has(row.applicant_uuid)}
            >
              <CheckCircleIcon style={{ color: "#3f51b5" }} />
            </IconButton>
          )}
        </TableCell>
      </>
    );
  }
);

// Virtualized Table Row
const RenderRow = memo(
  ({
    index,
    style,
    data: {
      uniqdata,
      clickedIndexes,
      handleIconClick,
      confirmAction,
      confirmContractSign,
      handleInputChange,
      showDateInput,
      setShowDateInput,
      formatDate,
      getDifferenceInDays,
      formatDateToCST,
      columns,
    },
  }) => {
    const row = uniqdata[index];
    return (
      <TableRow
        key={row.applicant_uuid}
       
        style={{
          ...style,
          backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
          height: "50px",
          display: "flex",
          width: "100%",
        }}
      >
        <TableCell
          style={{ padding: "4px 6px", width: columns[0].width }}
          className="text-center"
        >
          {index + 1}
        </TableCell>
        <TableCell
          style={{ padding: "4px 6px", width: columns[1].width }}
          className="ms-2"
        >
          <Box display="flex" alignItems="center">
            <Box ml={2}>
              <Tooltip
                title={
                  <>
                    <Typography variant="body2">
                      {row.email || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      {row.phone || "N/A"}
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
                    padding: "4px 6px",
                    fontSize: "0.8rem",
                  }}
                >
                  {row.name || "N/A"}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </TableCell>
        <TableCell
          className="text-capitalize text-center"
          style={{
            padding: "4px 6px",
            fontSize: "0.6rem",
            width: columns[2].width,
          }}
        >
          {row.MarketHiringFor?.toLowerCase() || "N/A"}
        </TableCell>
        <TableCell
          className="text-capitalize text-center"
          style={{
            padding: "4px 6px",
            fontSize: "0.6rem",
            width: columns[3].width,
          }}
        >
          {row.TrainingAt?.toLowerCase() || "N/A"}
        </TableCell>
        <TableCell
          className="text-center"
          style={{
            padding: "2px 3px",
            fontSize: "0.6rem",
            width: columns[4].width,
          }}
        >
          <Typography style={{ fontSize: "0.6rem" }}>
            {row.created_at && row.updatedDate
              ? getDifferenceInDays(row.created_at, row.updatedDate)
              : 0}{" "}
            days
          </Typography>
        </TableCell>
        <TableCell
          className="text-center"
          style={{
            padding: "2px 3px",
            fontSize: "0.6rem",
            width: columns[5].width,
          }}
        >
          {row.status === "mark_assigned" || row.status === "backOut" ? (
            <Typography
              style={{
                fontSize: "0.6rem",
                color: "inherit",
              }}
            >
              {row.DateOfJoining
                ? formatDateToCST(row.DateOfJoining.slice(0, 10))
                : "N/A"}
            </Typography>
          ) : (
            <Typography
              style={{
                fontSize: "0.6rem",
                color:
                  row.DateOfJoining && new Date(row.DateOfJoining) < new Date()
                    ? "red"
                    : "inherit",
              }}
            >
              {row.DateOfJoining
                ? formatDateToCST(row.DateOfJoining.slice(0, 10))
                : "N/A"}
            </Typography>
          )}
        </TableCell>
        <TableCell
          style={{
            padding: "6px 10px",
            fontSize: "0.6rem",
            width: columns[6].width,
          }}
          className="text-start"
        >
          <Box display="flex" alignItems="center">
            <Box ml={3}>
              <Typography variant="body3" style={{ fontSize: "0.6rem" }}>
                {row.payroll || "NA"}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ fontSize: "0.6rem" }}
              >
                {row.compensation_type || "N/A"}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell
          className="text-center"
          style={{
            padding: "4px 6px",
            fontSize: "0.6rem",
            width: columns[7].width,
          }}
        >
          {row.payment > 0 ? `$ ${row.payment}` : "N/A"}
        </TableCell>
        <TableCell
          className="text-center"
          style={{
            padding: "4px 6px",
            fontSize: "0.6rem",
            width: columns[8].width,
          }}
        >
          {row.noOFDays || "N/A"}
          {row.offDays?.length > 0 && (
            <span>
              <br />
              OffDays: {row.offDays}
            </span>
          )}
        </TableCell>
        <RowActions
          row={row}
          clickedIndexes={clickedIndexes}
          handleIconClick={handleIconClick}
          confirmAction={confirmAction}
          confirmContractSign={confirmContractSign}
          handleInputChange={handleInputChange}
          showDateInput={showDateInput}
          setShowDateInput={setShowDateInput}
          formatDate={formatDate}
          columns={columns}
        />
      </TableRow>
    );
  }
);

// Main Component
function SelectedAtHr({
  apiEndpoint = `${process.env.REACT_APP_API}/applicants/selected-at-hr`,
}) {
  const [data, setData] = useState(null);
  const [showDateInput, setShowDateInput] = useState({});
  const [clickedIndexes, setClickedIndexes] = useState(new Set());
  const [selectedTab, setSelectedTab] = useState(0);
  const [marketFilter, setMarketFilter] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [joiningDateFilter, setJoiningDateFilter] = useState([null, null]);
  const [candidateFilter, setCandidateFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { userData } = useContext(MyContext);

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
  const tokenMarket = userMarket[userData.role]?.toLowerCase();

  // Define columns with fixed widths for alignment
  const columns = [
    { header: "SINo", width: "60px" },
    { header: "CandidateDetails", width: "200px" },
    { header: "Market Hiring For", width: "150px" },
    { header: "Training Hiring For", width: "150px" },
    { header: "Duration", width: "80px" },
    { header: "DOJ", width: "100px" },
    { header: "Payroll/Compensation Type", width: "120px" },
    { header: "Payment", width: "90px" },
    { header: "work Hours/No.Of Days & Off-Days", width: "90px" },
    { header: "Back Out", width: "100px" },
    { header: "Contract Disclosed", width: "80px" },
    { header: "Added to Schedule", width: "80px" },
    { header: "Contract Signed", width: "70px" },
    { header: "NTID Created", width: "80px" },
    { header: "NTID Created Date", width: "120px" },
    { header: "NTID", width: "80px" },
    { header: "Mark As Assigned", width: "80px" },
  ];

  // Fetch Data
  useEffect(() => {
    let isMounted = true;
    const debouncedFetch = debounce(async () => {
      try {
        const response = await axios.get(apiEndpoint, {
          withCredentials: true,
        });
         console.log(response.data.data,'dddddddddddd')
        if (isMounted && response.status === 200) {
          setData(response.data.data || []);
        } else {
          toast.error("Error fetching applicants data");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Error fetching applicants");
      }
    }, 300);

    debouncedFetch();
    return () => {
      isMounted = false;
      debouncedFetch.cancel();
    };
  }, [apiEndpoint]);

  // Use the Filtering Hook
  const filteredData = useFilters(
    data,
    tokenMarket,
    marketFilter,
    [],
    joiningDateFilter,
    selectedTab,
    candidateFilter
  );

  // Memoized Functions
  const handleTabChange = useCallback((event, newValue) => {
    setSelectedTab(newValue);
  }, []);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const debouncedSetCandidateFilter = useMemo(
    () => debounce((value) => setCandidateFilter(value), 300),
    []
  );

  const handleInputChange = useCallback((uuid, field, value) => {
    setData(
      (prev) =>
        prev?.map((row) =>
          row.applicant_uuid === uuid ? { ...row, [field]: value } : row
        ) || prev
    );
  }, []);

  const isValidRow = useCallback((row) => {
    return (
      row?.ntidCreated && row.ntidCreatedDate && row.ntid && row.addedToSchedule
    );
  }, []);

  const handleIconClick = useCallback(
    async (applicant_uuid) => {
      if (clickedIndexes.has(applicant_uuid)) return;

      const rowData = filteredData?.find(
        (row) => row.applicant_uuid === applicant_uuid
      );
      if (!rowData) {
        toast.error("No row data found");
        return;
      }

      if (!isValidRow(rowData)) {
        toast.error("Please fill all required fields before submitting!");
        return;
      }

      const newClickedIndexes = new Set(clickedIndexes);
      newClickedIndexes.add(applicant_uuid);
      setClickedIndexes(newClickedIndexes);

      try {
        const { ntidCreated, ntidCreatedDate, ntid, addedToSchedule } = rowData;
        const response = await axios.post(
          `${process.env.REACT_APP_API}/ntids`,
          {
            ntidCreated,
            ntidCreatedDate,
            ntid,
            addedToSchedule,
            markAsAssigned: true,
            applicant_uuid,
          }
        );
        if (response.status === 201) {
          toast.success("NTID entry created successfully!");
          setTimeout(() => window.location.reload(), 2000);
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Error creating NTID entry: " + error.message);
        newClickedIndexes.delete(applicant_uuid);
        setClickedIndexes(newClickedIndexes);
      }
    },
    [clickedIndexes, filteredData]
  );

  const confirmAction = useCallback(async (applicant_uuid, action, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} for this applicant ${name || "N/A"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/updatestatus`,
          { applicant_uuid, action }
        );
        if (res.status === 200) {
          toast.success(res.data.message || "Status updated successfully");
          setTimeout(() => window.location.reload(), 1800);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status.");
      }
    } else {
      toast.info("Action canceled");
    }
  }, []);

  const confirmContractSign = useCallback(async (applicant_uuid, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to sign the contract for this applicant ${
        name || "N/A"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/contractsign`,
          { applicant_uuid }
        );
        if (res.status === 200) {
          toast.success(res.data.message || "Contract signed successfully");
          setTimeout(() => window.location.reload(), 1800);
        }
      } catch (error) {
        console.error("Error signing contract:", error);
        toast.error("Failed to sign contract.");
      }
    } else {
      toast.info("Action canceled");
    }
  }, []);

  const downloadAsExcel = useCallback(() => {
    if (!filteredData?.length) {
      toast.error("No data available to export");
      return;
    }

    const mappedData = filteredData.map((row) => ({
      Name: row.name || "N/A",
      Email: row.email || "N/A",
      Phone: row.phone || "N/A",
      ReferedBy: row.referred_by || "N/A",
      Reference_id: row.reference_id || "N/A",
      created_at: row.created_at || "N/A",
      DateOfJoining: row.DateOfJoining
        ? new Date(row.DateOfJoining).toLocaleDateString()
        : "N/A",
      MarketHiringFor: row.MarketHiringFor || "N/A",
      TrainingAt: row.TrainingAt || "N/A",
      CompensationType: row.compensation_type || "N/A",
      Payment: row.payment || "N/A",
      Payroll: row.payroll || "N/A",
      NoOfDays: row.noOFDays || "N/A",
      OffDays: row.offDays || "N/A",
      Status: row.status || "N/A",
      NTIDCreated: row.ntidCreated ? "Yes" : "No",
      NTIDCreatedDate: row.ntidCreatedDate
        ? new Date(row.ntidCreatedDate).toLocaleDateString()
        : "N/A",
      AddedToSchedule: row.addedToSchedule ? "Yes" : "No",
      ContractDisclosed: row.contractDisclosed ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants Data");
    XLSX.writeFile(workbook, `FilteredData.xlsx`);
  }, [filteredData]);

  const getDifferenceInDays = useCallback((created_at, updatedDate) => {
    if (!created_at || !updatedDate) return 0;
    const inputDate = new Date(created_at);
    const currentDate = new Date(updatedDate);
    if (isNaN(inputDate.getTime()) || isNaN(currentDate.getTime())) return 0;
    return Math.floor(
      Math.abs(currentDate - inputDate) / (1000 * 60 * 60 * 24)
    );
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, []);

  const formatDateToCST = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const x = dateString.slice(0, 4);
    const y = dateString.slice(5);
    return `${y}-${x}`;
  }, []);

  // Memoized Unique Data
  const uniqdata = useMemo(() => {
    if (!filteredData) return [];
    const seen = new Set();
    return filteredData
      .filter((profile) => {
        if (seen.has(profile.applicant_uuid)) return false;
        seen.add(profile.applicant_uuid);
        return true;
      })
      .sort((a, b) =>
        a.DateOfJoining && b.DateOfJoining
          ? new Date(a.DateOfJoining) - new Date(b.DateOfJoining)
          : 0
      );
  }, [filteredData]);

  const open = Boolean(anchorEl);

  return (
    <div dateAdapter={AdapterDateFns}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Selected at HR" />
        <Tab label="Mark Assigned" />
        <Tab label="Backed Out" />
      </Tabs>

      <Filters
        role={userData.role}
        selectedMarket={selectedMarket}
        setSelectedMarket={setSelectedMarket}
        isAllSelected={isAllSelected}
        setIsAllSelected={setIsAllSelected}
        setMarketFilter={setMarketFilter}
        joiningDateFilter={joiningDateFilter}
        setJoiningDateFilter={setJoiningDateFilter}
        onDownload={downloadAsExcel}
      />

      {data === null ? (
        <Loader />
      ) : (
        <TableContainer
          component={Paper}
          style={{ maxHeight: "700px", overflowY: "auto", margin: "0 16px" }}
        >
          <Table
            stickyHeader
            style={{ tableLayout: "fixed", fontSize: "0.6rem", width: "100%" }}
          >
            <TableHead>
              <TableRow style={headerStyle}>
                {columns.map(({ header, width }, index) => {
                  const conditional =
                    (header !== "Back Out" && header !== "Contract Signed") ||
                    (header === "Back Out" &&
                      uniqdata.some((row) => row.status !== "mark_assigned")) ||
                    (header === "Contract Signed" &&
                      uniqdata.some(
                        (row) =>
                          row.status !== "backOut" &&
                          row.status !== "mark_assigned"
                      ));
                  return conditional ? (
                    <TableCell
                      key={header}
                      style={{ ...headerStyle, width }}
                      className="text-center text-capitalize"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="body4"
                          style={{ marginRight: "1px" }}
                        >
                          {header}
                        </Typography>
                        {header === "CandidateDetails" && (
                          <>
                            <IconButton onClick={handleClick}>
                              <MdOutlineArrowDropDown className="text-secondary" />
                            </IconButton>
                            <Popover
                              id={open ? "simple-popover" : undefined}
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
                                onChange={(e) =>
                                  debouncedSetCandidateFilter(e.target.value)
                                }
                                style={{ width: "200px" }}
                              />
                            </Popover>
                          </>
                        )}
                      </div>
                    </TableCell>
                  ) : null;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={17} style={{ padding: 0, border: "none" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "700px",
                      overflowY: "auto",
                      overflowX: "auto",
                    }}
                  >
                    <FixedSizeList
                      height={700}
                      width="100%"
                      itemCount={uniqdata.length}
                      itemSize={50}
                      itemData={{
                        uniqdata,
                        clickedIndexes,
                        handleIconClick,
                        confirmAction,
                        confirmContractSign,
                        handleInputChange,
                        showDateInput,
                        setShowDateInput,
                        formatDate,
                        getDifferenceInDays,
                        formatDateToCST,
                        columns,
                      }}
                    >
                      {RenderRow}
                    </FixedSizeList>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <ToastContainer />
        </TableContainer>
      )}
    </div>
  );
}

const headerStyle = {
  backgroundColor: "#3f51b5",
  color: "#ffffff",
  padding: "3px",
  position: "sticky",
  top: 0,
  fontSize: "0.7vw",
  textAlign: "center",
  lineHeight: "1.5",
};

export default SelectedAtHr;

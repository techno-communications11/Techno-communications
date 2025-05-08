import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,

} from "@mui/material";
import { Form, Col, Row, Container } from "react-bootstrap";
import { Dropdown,  } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import axios from "axios";
import MarketSelector from "./MarketSelector";
import DateFilter from "./DateFilter";
import Loader from "../utils/Loader";
import API_URL from "../Constants/ApiUrl";
import TableHead from "../utils/TableHead";
import Button from "../utils/Button";

// FilterControls Component
const FilterControls = ({
  selectedMarkets,
  setSelectedMarkets,
  selectedUsers,
  setSelectedUsers,
  selectedGroupStatus,
  setSelectedGroupStatus,
  setSelectedStatus,
  dateRange,
  setDateRange,
  users,
  groupStatus,
  statusMap,
  isAllSelected,
  setIsAllSelected,
  setMarketFilter,
}) => {
  const handleUserChange = (event, user) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedUsers((prev) => [...prev, { value: user, label: user }]);
    } else {
      setSelectedUsers((prev) => prev.filter((selected) => selected.value !== user));
    }
  };

  const handleFilterApply = (status) => {
    setSelectedGroupStatus(status);
    const relatedStatuses = statusMap[status] || [];
    setSelectedStatus(relatedStatuses);
  };

  return (
    <div className="d-flex flex-wrap align-items-center gap-5 p-3 bg-white border rounded shadow-sm ">
      {/* Market Selector */}
      <div className="flex-grow-1" style={{ minWidth: "250px" }}>
        <MarketSelector
          isAllSelected={isAllSelected}
          selectedMarket={selectedMarkets}
          setIsAllSelected={setIsAllSelected}
          setSelectedMarket={setSelectedMarkets}
          setMarketFilter={setMarketFilter}
          text="Select Market"
        />
      </div>

      {/* Users Dropdown */}
      <div className="flex-grow-1" style={{ minWidth: "250px" }}>
        <Dropdown as="div" className="w-100">
          <Dropdown.Toggle
            as="button"
            className="btn btn-light w-100 d-flex justify-content-between align-items-center text-start"
            id="dropdown-user"
          >
            <span className="text-truncate">
              {selectedUsers.length > 0
                ? `${selectedUsers.length} User${selectedUsers.length > 1 ? 's' : ''} Selected`
                : "Select Users"}
            </span>
            <i className="fas fa-chevron-down ms-2 text-muted" style={{ fontSize: "0.75rem" }} />
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100 mt-1 shadow border">
            <div className="px-3 py-2 fw-bold border-bottom">Select User(s)</div>
            {users.map((user) => (
              <div key={user} className="px-3 py-1">
                <Form.Check
                  type="checkbox"
                  id={`user-${user.replace(/\s+/g, '-').toLowerCase()}`}
                  label={user}
                  value={user}
                  checked={selectedUsers.some((selected) => selected.value === user)}
                  onChange={(e) => handleUserChange(e, user)}
                />
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Status Dropdown */}
      <div className="flex-grow-1" style={{ minWidth: "200px" }}>
        <select
          className="form-select"
          value={selectedGroupStatus}
          onChange={(e) => handleFilterApply(e.target.value)}
        >
          <option value="">Status</option>
          {groupStatus.map((status, index) => (
            <option key={index} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex-grow-1" style={{ minWidth: "200px" }}>
        <DateFilter dateFilter={dateRange} setDateFilter={setDateRange} className="w-100" />
      </div>
    </div>
  );
};



// ProfileCountCard Component
const ProfileCountCard = ({ profileCount, onDownload }) => (
  <Row className="mb-4 align-items-center justify-content-between g-3 mt-2">
    {/* Left side: Profile Count */}
    <Col xs="auto" className="d-flex align-items-center">
      <span className="fs-5 fw-bold text-primary">
        Total profiles: <span className="text-dark">{profileCount}</span>
      </span>
    </Col>

    {/* Right side: Download Button */}
    <Col xs="auto">
      <Button
        variant="btn-primary"
        onClick={onDownload}
        label={"Download Data"}
      />
       
    </Col>
  </Row>
);


const ProfileTable = ({ profiles, serialNumberStart }) => {
 

  let serialNumber = serialNumberStart;

   const TableHeaders=[
    "SI.No",
    "Created At",
    "Applicant Name",
    "Referred_by",
    "Reference_ids",
    "Work Location",
    "Screening Manager",
    "Interviewer",
    "HR Name",
    "Status",
    "Joining Date",
  ]

  return (
    <TableContainer
      component={Paper}
      className="w-full shadow-lg rounded-lg max-h-[600px] overflow-y-auto"
    >
      <Table stickyHeader className="table-sm">
        <TableHead headData={TableHeaders}/>
        <TableBody>
          {profiles.map((profile, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="text-center">{serialNumber++}</TableCell>
              <TableCell className="text-center">
                {profile.created_at_date
                  ? dayjs(profile.created_at_date).format("YYYY-MM-DD")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Box className="flex">
                  <Box className="ml-2">
                    <Typography className="font-bold">
                      {profile.applicant_name || "N/A"}
                    </Typography>
                    <Typography className="text-gray-500">
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
              <TableCell className="text-center">
                {profile.interviewer_name || "N/A"}
              </TableCell>
              <TableCell className="text-center">
                {profile.hr_name || "N/A"}
              </TableCell>
              <TableCell className="text-center">
                {profile.status || "N/A"}
              </TableCell>
              <TableCell className="text-center">
                {profile.joining_date || "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// PaginationControls Component
const PaginationControls = ({ pageCount, currentPage, onPageChange }) => (
  <Stack spacing={2} className="mt-6 d-flex justify-center">
    <Pagination
      count={pageCount}
      page={currentPage}
      onChange={onPageChange}
      color="primary"
      className="flex justify-center"
    />
  </Stack>
);

// Main DetailedView Component
const DetailedView = () => {
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGroupStatus, setSelectedGroupStatus] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const profilesPerPage = 100;

  const users = [
    "Alishba Ahmed",
    "ALISHA PADANIYA",
    "Roshan Interview",
    "Roshan Screening",
    "Roshan Shaikh",
    "Bilal Interview",
    "Qamar Shahzad",
    "Shafaque Qureshi",
    "Sultan Interview",
    "Shoaib",
    "Kamaran Mohammed",
  ];

  const groupStatus = [
    "Rejected",
    "Pending",
    "pending at Screening",
    "1st Round - Pending",
    "HR Round - Pending",
    "Pending at NTID",
    "NTID Created",
  ];

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

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("savedFilters"));
    if (savedFilters) {
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
  }, [selectedMarkets, selectedCategory, selectedStatus, selectedUsers, dateRange]);

  useEffect(() => {
    fetchProfiles();
  }, [selectedMarkets, selectedCategory, selectedStatus, selectedUsers, dateRange]);

  const setMarketFilter = (markets) => {
    setSelectedMarkets(markets);
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/Detailstatus`;
      const params = {
        market: selectedMarkets.map((m) => m.value),
        category: selectedCategory,
        status: selectedStatus,
        users: selectedUsers.map((u) => u.value),
        startDate: dateRange[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD") : null,
        endDate: dateRange[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null,
      };
      const response = await axios.get(url, { params, withCredentials: true });
      if (response.status === 200) {
        setSelectedProfiles(response.data.status_counts || []);
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
      };

      currentStatus.applicant_names.forEach((_, index) => {
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

        if (inMarket && inUsers && inDateRange && filteredByStatus) {
          filteredData.applicant_names.push(currentStatus.applicant_names[index]);
          filteredData.phone.push(currentStatus.phone[index]);
          filteredData.applicant_emails.push(currentStatus.applicant_emails[index]);
          filteredData.applicant_referred_by.push(currentStatus.applicant_referred_by[index]);
          filteredData.applicant_reference_ids.push(currentStatus.applicant_reference_ids[index]);
          filteredData.applicant_uuids.push(currentStatus.applicant_uuids[index]);
          filteredData.created_at_dates.push(currentStatus.created_at_dates[index]);
          filteredData.work_location_names.push(currentStatus.work_location_names[index]);
          filteredData.screening_manager_names.push(currentStatus.screening_manager_names[index]);
          filteredData.interviewer_names.push(currentStatus.interviewer_names[index]);
          filteredData.hr_names.push(currentStatus.hr_names[index]);
          filteredData.joining_dates.push(currentStatus.joining_dates[index]);
        }
      });

      return filteredData;
    })
    .filter((data) => data.applicant_names.length > 0);

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
          status.joining_dates[index] && status.joining_dates[index] !== "0000-00-00"
            ? dayjs(status.joining_dates[index]).format("YYYY-MM-DD")
            : "N/A",
      }));
    })
    .sort((a, b) => {
      const statusAIndex =
        statusOrder.indexOf(a.status) !== -1 ? statusOrder.indexOf(a.status) : 9999;
      const statusBIndex =
        statusOrder.indexOf(b.status) !== -1 ? statusOrder.indexOf(b.status) : 9999;

      if (statusAIndex < statusBIndex) return -1;
      if (statusAIndex > statusBIndex) return 1;

      return (
        new Date(a.created_at_date) - new Date(b.created_at_date) ||
        a.applicant_name.localeCompare(b.applicant_name)
      );
    });

  const uniqueFlattenedProfiles = flattenedProfiles.filter(
    (profile, index, self) =>
      index === self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
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

  const handleDownloadExcel = () => {
    const worksheetData = uniqueFlattenedProfiles.map((profile, index) => ({
      "Created At": dayjs(profile.created_at_date).format("YYYY-MM-DD HH:mm:ss"),
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

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
    XLSX.writeFile(workbook, "Applicants_List.xlsx");
  };

  return (
    <Container fluid className="p-6">
      <FilterControls
        selectedMarkets={selectedMarkets}
        setSelectedMarkets={setSelectedMarkets}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        selectedGroupStatus={selectedGroupStatus}
        setSelectedGroupStatus={setSelectedGroupStatus}
        setSelectedStatus={setSelectedStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        users={users}
        groupStatus={groupStatus}
        statusMap={statusMap}
        isAllSelected={isAllSelected}
        setIsAllSelected={setIsAllSelected}
        setMarketFilter={setMarketFilter}
      />
      {loading ? (
        <Loader />
      ) : isFilterApplied ? (
        uniqueFlattenedProfiles.length > 0 ? (
          <>
            <ProfileCountCard
              profileCount={uniqueFlattenedProfiles.length}
              onDownload={handleDownloadExcel}
            />
            <ProfileTable
              profiles={currentProfiles}
              serialNumberStart={indexOfFirstProfile + 1}
            />
            <PaginationControls
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <Typography className="text-xl text-red-600">
            No profiles found for the applied filters
          </Typography>
        )
      ) : (
        <Typography className="text-xl text-gray-500">
          Please apply filters to view profiles
        </Typography>
      )}
    </Container>
  );
};

export default DetailedView;
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import axios from "axios";
import DateFilter from "../utils/DateFilter";
import Loader from "../utils/Loader";
import API_URL from "../Constants/ApiUrl";
import ProfileTable from "./DetailedViewComponents/ProfileTable";
import Sidebar from "./DetailedViewComponents/Sidebar";
import {
  users,
  groupStatus,
  statusMap,
  statusOrder,
} from "../Constants/DetailedViewConstants";
import NoProfilesFound from "../utils/NoProfilesFound";
import ReadyToSearch from "../utils/ReadyToSearch";

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
  const [markets, setMarkets] = useState([]);
  const profilesPerPage = 50;

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
  }, [
    selectedMarkets,
    selectedCategory,
    selectedStatus,
    selectedUsers,
    dateRange,
  ]);

  useEffect(() => {
    fetchProfiles();
  }, [
    selectedMarkets,
    selectedCategory,
    selectedStatus,
    selectedUsers,
    dateRange,
  ]);

  useEffect(() => {
    if (selectedProfiles.length > 0) {
      const allMarkets = selectedProfiles
        .flatMap((status) => status.work_location_names || [])
        .filter((name, index, self) => name && self.indexOf(name) === index)
        .map((name, index) => ({ id: index, location_name: name }));
      setMarkets(allMarkets);
    }
  }, [selectedProfiles]);

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
        startDate: dateRange[0]
          ? dayjs(dateRange[0]).format("YYYY-MM-DD")
          : null,
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

      if (statusAIndex < statusBIndex) return -1;
      if (statusAIndex > statusBIndex) return 1;

      return (
        new Date(a.created_at_date) - new Date(b.created_at_date) ||
        a.applicant_name.localeCompare(b.applicant_name)
      );
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

  const handleDownloadExcel = () => {
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

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
    XLSX.writeFile(workbook, "Applicants_List.xlsx");
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#F4F5F7",
        display: "flex",
      }}
    >
      <Sidebar
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
        markets={markets}
        profileCount={uniqueFlattenedProfiles.length}
        onDownload={handleDownloadExcel}
        currentPage={currentPage}
        uniqueFlattenedProfiles={uniqueFlattenedProfiles}
        profilesPerPage={profilesPerPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid #DFE1E6",
            boxShadow: "0 1px 2px rgba(9, 30, 66, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Typography
              variant="h5"
              style={{
                color: "#172B4D",
                fontWeight: 600,
                fontSize: "20px",
                margin: 0,
              }}
            >
              Recruitment Dashboard
            </Typography>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Typography
                style={{
                  color: "#5E6C84",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {uniqueFlattenedProfiles.length} profiles found
              </Typography>
            </div>
          </div>

          {/* Date Filter */}
          <DateFilter dateFilter={dateRange} setDateFilter={setDateRange} />
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {loading ? (
              <Loader />
          ) : isFilterApplied ? (
            uniqueFlattenedProfiles.length > 0 ? (
              <ProfileTable
                profiles={currentProfiles}
                serialNumberStart={indexOfFirstProfile + 1}
              />
            ) : (
              <NoProfilesFound />
            )
          ) : (
           <ReadyToSearch />
          )}
        </div>
      </div>
    </div>
  );
};
export default DetailedView;

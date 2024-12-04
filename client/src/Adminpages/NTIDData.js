import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MyContext } from "../pages/MyContext";
import { IoMdDownload } from "react-icons/io";
import * as XLSX from "xlsx";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function NTIDData() {
  const { endDate, startDate, markets, captureStatus } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const apiurl = process.env.REACT_APP_API;

  const fetchApplicantsData = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/applicants/ntidDashboardCount`
      );
      if (response.status === 200) {
        const fetchedData = response.data.data;
        console.log(response.data.data);
        setData(fetchedData);
        applyFilters(fetchedData);
      } else {
        console.error("Error fetching applicants data");
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  const applyFilters = (dataToFilter) => {
    let filtered = dataToFilter;

    // Filter by market
    if (markets.length > 0) {
      filtered = filtered.filter((item) => markets.includes(item.market));
    }
    if (captureStatus) {
      if (captureStatus === "contract_signed0") {
        // Filter for contract_signed === 0
        filtered = filtered.filter((item) => item.contract_sined === 0);
      } else if (captureStatus === "contract_signed1") {
        // Filter for contract_signed === 1
        filtered = filtered.filter((item) => item.contract_sined === 1);
      } else {
        // Filter by item.status if captureStatus is not '0' or '1'
        filtered = filtered.filter((item) =>
          captureStatus.includes(item.status)
        );
      }
    }
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (startDateObj && endDateObj) {
        const adjustedStartDateUTC = new Date(
          Date.UTC(
            startDateObj.getUTCFullYear(),
            startDateObj.getUTCMonth(),
            startDateObj.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );

        const adjustedEndDateUTC = new Date(
          Date.UTC(
            endDateObj.getUTCFullYear(),
            endDateObj.getUTCMonth(),
            endDateObj.getUTCDate(),
            23,
            59,
            59,
            999
          )
        );

        filtered = filtered.filter((item) => {
          const joiningDate = new Date(item.joining_date);
          return (
            joiningDate >= adjustedStartDateUTC &&
            joiningDate <= adjustedEndDateUTC
          );
        });
      }
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchApplicantsData();
  }, []);

  useEffect(() => {
    applyFilters(data);
  }, [markets, startDate, endDate]);
  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Prepare data for Excel
    const excelData = filteredData.map((item) => ({
      "Applicant ID": item.applicant_id,
      "Joining Date": new Date(item.joining_date).toLocaleDateString(),
      Market: item.market,
      "Contract Signed": item.contract_sined ? "Yes" : "No",
      Status: item.status,
      NTID: item.ntid,
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NTID Data");

    // Generate an Excel file and trigger download
    XLSX.writeFile(workbook, "NTID_Data.xlsx");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Total Count */}
        <h3 className="text-capitalize" style={{ color: "#E10174" }}>
          Total: {filteredData.length}
        </h3>

        {/* Download Excel Button */}
        <button
          className="btn btn-outline-success text-capitalize"
          onClick={handleDownloadExcel}
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
        >
          <IoMdDownload /> Download
        </button>
      </div>
      {filteredData.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th style={{ backgroundColor: "#E10174" }}>index</th>
              <th style={{ backgroundColor: "#E10174" }}>Applicant ID</th>
              <th style={{ backgroundColor: "#E10174" }}>Joining Date</th>
              <th style={{ backgroundColor: "#E10174" }}>Market</th>
              <th style={{ backgroundColor: "#E10174" }}>Contract Signed</th>
              <th style={{ backgroundColor: "#E10174" }}>Status</th>
              <th style={{ backgroundColor: "#E10174" }}>NTID</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.applicant_id}>
                <td>{index + 1}</td>
                <td>{item.applicant_id}</td>
                <td>{new Date(item.joining_date).toLocaleDateString()}</td>
                <td>{item.market}</td>
                <td>{item.contract_sined ? "Yes" : "No"}</td>
                <td>{item.status}</td>
                <td>{item.ntid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div class="spinner-border text-primary"></div>
      )}
    </div>
  );
}

export default NTIDData;

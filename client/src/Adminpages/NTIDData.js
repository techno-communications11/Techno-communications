import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../pages/MyContext";
import { IoMdDownload } from "react-icons/io";
import { Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import TableHead from "../utils/TableHead";
import Button from "../utils/Button";
import useFetchNtidDashCount from "../Hooks/useFetchNtidDashCount";
import Loader from "../utils/Loader";
import { useParams } from "react-router";
 const TableHeaders = [
    "S.No",
    "Applicant ID",
    "Name",
    "Joining Date",
    "Market",
    "Contract Signed",
    "Status",
    "NTID",
  ];


function NTIDData() {
  const { endDate, startDate, markets } = useContext(MyContext);
  const [filteredData, setFilteredData] = useState([]);
   const {data,loading,error}=useFetchNtidDashCount();
   const {captureStatus}=useParams();

  const applyFilters = (dataToFilter) => {
    let filtered = dataToFilter;

    if (markets.length > 0) {
      filtered = filtered.filter((item) => markets.includes(item.market));
    }
    if (captureStatus) {
      if (captureStatus === "contract_signed0") {
        filtered = filtered.filter((item) => item.contract_sined === 0);
      } else if (captureStatus === "contract_signed1") {
        filtered = filtered.filter((item) => item.contract_sined === 1);
      } else {
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
    applyFilters(data);
  }, [markets, startDate, endDate,data]);
  
  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }

  
    const excelData = filteredData.map((item) => ({
      "Applicant ID": item.applicant_id,
      "Joining Date": new Date(item.joining_date).toLocaleDateString(),
      Market: item.market,
      "Contract Signed": item.contract_sined ? "Yes" : "No",
      Status: item.status,
      NTID: item.ntid,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NTID Data");
    XLSX.writeFile(workbook, "NTID_Data.xlsx");
  };

  
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h5 style={{ color: "#F44336" }}>{error}</h5>
      </div>
    );
  }

  return (
    <div className="container-flex mx-4 mt-1">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h3 className="text-capitalize" style={{ color: "#E10174" }}>
          Total: {filteredData.length}
        </h3>
        <Button
          variant="btn-success text-capitalize"
          onClick={handleDownloadExcel}
          icon={<IoMdDownload />}
          label="Downlooad"
        />
        
      </div>
      {filteredData.length > 0 ? (
        <Table className="table table-sm table-bordered table-striped">
          <TableHead  headData={TableHeaders} />
          <tbody>
            {filteredData.map((item, index) => (
              <tr  key={item.applicant_id}>
                <td className="p-2" >{index + 1}</td>
                <td className="p-2">{item.applicant_id}</td>
                <td className="p-2 text-capitalize">{item.name?.toLowerCase()}</td>
                <td className="p-2">{new Date(item.joining_date).toLocaleDateString()}</td>
                <td className="p-2 text-capitalize">{item.market?.toLowerCase()}</td>
                <td className="p-2">{item.contract_sined ? "Yes" : "No"}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2">{item.ntid}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div class="spinner-border text-primary"></div>
      )}
    </div>
  );
}

export default NTIDData;

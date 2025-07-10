import { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import { Table } from "react-bootstrap";
import * as XLSX from "xlsx";

import { MyContext } from "../pages/MyContext";
import useFetchNtidDashCount from "../Hooks/useFetchNtidDashCount";
import TableHead from "../utils/TableHead";
import Button from "../utils/Button";
import Loader from "../utils/Loader";

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
  const { data, loading, error } = useFetchNtidDashCount();
  const { captureStatus } = useParams();

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let filtered = [...data];

    if (markets.length > 0) {
      filtered = filtered.filter((item) =>
        markets.includes((item.location_name || item.market || "").toLowerCase())
      );
    }

    if (captureStatus) {
      if (captureStatus === "contract_signed0") {
        filtered = filtered.filter((item) => item.contract_sined === 0);
      } else if (captureStatus === "contract_signed1") {
        filtered = filtered.filter((item) => item.contract_sined === 1);
      } else {
        filtered = filtered.filter((item) =>
          captureStatus.toLowerCase() === (item.status?.toLowerCase() || "")
        );
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startUTC = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0));
      const endUTC = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59));

      filtered = filtered.filter((item) => {
        const joining = new Date(item.joining_date);
        return joining >= startUTC && joining <= endUTC;
      });
    }

    return filtered;
  }, [data, markets, captureStatus, startDate, endDate]);

  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const excelData = filteredData.map((item) => ({
      "Applicant ID": item.applicant_id || "N/A",
      "Joining Date": item.joining_date
        ? new Date(item.joining_date).toLocaleDateString()
        : "N/A",
      Market: (item.location_name || item.market || "Unknown"),
      "Contract Signed": item.contract_sined ? "Yes" : "No",
      Status: item.status || "Unknown",
      NTID: item.ntid || "N/A",
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
          label="Download"
        />
      </div>

      {filteredData.length > 0 ? (
        <Table className="table table-sm table-bordered table-striped">
          <TableHead headData={TableHeaders} />
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.applicant_id || index}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.applicant_id || "N/A"}</td>
                <td className="p-2 text-capitalize">{item.name?.toLowerCase() || "N/A"}</td>
                <td className="p-2">
                  {item.joining_date
                    ? new Date(item.joining_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-2 text-capitalize">
                  {(item.location_name || item.market || "Unknown").toLowerCase()}
                </td>
                <td className="p-2">{item.contract_sined ? "Yes" : "No"}</td>
                <td className="p-2">{item.status || "Unknown"}</td>
                <td className="p-2">{item.ntid || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center mt-3">
          <p>No data available for the selected filters.</p>
        </div>
      )}
    </div>
  );
}

export default NTIDData;
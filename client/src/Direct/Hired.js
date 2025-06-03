import React, { useEffect, useState } from "react";

import axios from "axios";
import TableHead from "../utils/TableHead";
import { useContext } from "react";
import { MyContext } from "../pages/MyContext";

 const tableHeadings = [
    "Applicant UUID",
    "Status",
    "Compensation Type",
    "Evaluation Date",
    "Joining Date",
    "Market",
    "Market Training",
    "Notes",
    "Off Days",
    "Offered Salary",
    "Payroll",
    "Reason for Back Out",
    "Return Date",
    "Training Location",
    "Work Hours/Days",
    "Contract Disclosed",
    "Accept Offer",
    "Back Out",
    "Selected Evaluation",
  ];

function Hired() {
  const [applicants, setApplicants] = useState([]);
  const { userData } = useContext(MyContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = userData.id;
        const response = await axios.post(
          `${process.env.REACT_APP_API}/getdirecthiringdetails`,
          { assigned_user_id: userId },
          { withCredentials: true }
        );
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setApplicants([]); // Clear data on error
      }
    };
    fetchUserData();
  }, []); // Empty dependency array to run only on component mount

  const renderStatus = (status) => {
    if (status === 1) {
      return <span style={{ color: "green" }}>✔</span>;
    } else if (status === 0) {
      return <span style={{ color: "red" }}>✘</span>;
    }
    return "-";
  };

  // Check if there is any evaluation data available
  const hasEvaluationData = applicants.some(
    (applicant) =>
      applicant.hrevaluationData && applicant.hrevaluationData.length > 0
  );

  // Filter applicants to only show those with a "pending" status at screening
  const pendingApplicants = applicants.filter(
    (applicant) =>
      ["selected at Hr", "mark_assigned"].includes(applicant.status) &&
      applicant.hrevaluationData &&
      applicant.hrevaluationData.length > 0
  );

 

  return (
    <div>
      <h1>Applicant Details</h1>
      {/* Show the table only if there are pending applicants with evaluation data */}
      {hasEvaluationData && pendingApplicants.length > 0 ? (
        <table
          className="table table-striped"
          style={{ padding: "2px 4px", fontSize: "0.7rem" }}
        >
          <TableHead headData={tableHeadings} />
          <tbody>
            {pendingApplicants.map((applicant, index) => (
              <tr key={index}>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.applicant_uuid}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.status}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].compensation_type}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {new Date(
                    applicant.hrevaluationData[0].evaluationDate
                  ).toLocaleDateString()}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {new Date(
                    applicant.hrevaluationData[0].joining_date
                  ).toLocaleDateString()}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].market}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].market_training}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].notes || "N/A"}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].offDays || "N/A"}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].offered_salary}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].payroll}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].reason_back_out || "N/A"}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {new Date(
                    applicant.hrevaluationData[0].return_date
                  ).toLocaleDateString()}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].training_location}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].work_hours_days}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {renderStatus(
                    applicant.hrevaluationData[0].Contract_disclosed
                  )}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {renderStatus(applicant.hrevaluationData[0].accept_offer)}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {renderStatus(applicant.hrevaluationData[0].back_out)}
                </td>
                <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                  {applicant.hrevaluationData[0].selectedEvalution || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending applicants with evaluation data available.</p> 
      )}
    </div>
  );
}

export default Hired;

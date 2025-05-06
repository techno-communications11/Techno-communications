import React, { useEffect, useState } from "react";
import decodeToken from "../decodedDetails";
import axios from "axios";
import TableHead from "../utils/TableHead";

function DetailedView() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Decode token to get user data
        const userData = decodeToken();
        const userId = userData.id;
        // Send request to the server with userId
        const response = await axios.post(
          `${process.env.REACT_APP_API}/getdirecthiringdetails`,
          { assigned_user_id: userId },{withCredentials:true}
        );

        // Update state with the fetched data
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
  const filteredApplicants = applicants.filter((applicant) =>
    [
      "Spanish Evaluation",
      "Store Evaluation",
      "Applicant Will Think About It",
      "selected at Hr",
      "Sent for Evaluation",
    ].includes(applicant.status)
  );
  const TableHeaders = [
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
    "Applicant ID",
    "Selected Evaluation",
  ];
  return (
    <div>
      <h1>Applicant Details</h1>
      {/* Show the table only if evaluation data exists */}
      {!filteredApplicants && hasEvaluationData ? (
        <table
          className="table table-striped"
          style={{ padding: "2px 4px", fontSize: "0.7rem" }}
        >
          <TableHead headData={TableHeaders} />
          <tbody>
            {applicants.map((applicant, index) =>
              applicant.hrevaluationData &&
              applicant.hrevaluationData.length > 0 ? (
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
                    {applicant.hrevaluationData[0].notes}
                  </td>
                  <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                    {applicant.hrevaluationData[0].offDays}
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
                    {applicant.applicant_id}
                  </td>
                  <td style={{ padding: "2px 4px", fontSize: "0.7rem" }}>
                    {applicant.hrevaluationData[0].selectedEvalution || "N/A"}
                  </td>
                </tr>
              ) : null // Only render rows where evaluation data exists
            )}
          </tbody>
        </table>
      ) : (
        <p>No evaluation data available.</p> // Only display this message when there's no evaluation data
      )}
    </div>
  );
}

export default DetailedView;

import  { useEffect, useState } from "react";
import TableHead from "../utils/TableHead";
import { useContext } from "react";
import {MyContext} from "../pages/MyContext";
import api from "../api/axios";
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
  "Selected Evaluation"
];


function Pending() {
  const [applicants, setApplicants] = useState([]);
  const { userData } = useContext(MyContext); // Assuming userData is available in context

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = userData.id;
        const response = await api.post(
          "/getdirecthiringdetails",
          { assigned_user_id: userId }
        );
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setApplicants([]); 
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

  // Filter applicants based on status: "Spanish Evaluation", "Send for Evaluation", or "Applicant Will Think About It"
  const filteredApplicants = applicants.filter((applicant) =>
    [
      "Spanish Evaluation",
      "Store Evaluation",
      "Sent for Evaluation",
      "Applicant Will Think About It",
      "Recommended for Hiring",
    ].includes(applicant.status)
  );

  return (
    <div>
      <h1>Applicant Details</h1>
      {/* Show the table only if there are applicants with the relevant statuses */}
      {filteredApplicants.length > 0 ? (
        <table
          className="table table-striped"
          style={{ padding: "2px 4px", fontSize: "0.7rem" }}
        >
         <TableHead headData={TableHeaders} />  
          <tbody>
            {filteredApplicants.map((applicant, index) => (
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
        <p>
          No pending applicants with evaluation data available for the specified
          status.
        </p>
      )}
    </div>
  );
}

export default Pending;

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../pages/MyContext";
import { Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../utils/Loader";
import Button from "../utils/Button";
import TableHead from "../utils/TableHead";
import API_URL from "../Constants/ApiUrl";
const TableHeaders = [
  "S.No",
  "Applicant UUID",
  "Applicant Name",
  "Phone",
  "HR Name",
  "Action",
];

function AdminHrEdit() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]); // Ensure profiles is always an array
  const { setapplicant_uuid } = useContext(MyContext);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchInterviewApplicants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/formDetailsForAllHRs`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          if (Array.isArray(response.data.rows)) {
            const uniqueProfiles = response.data.rows.filter(
              (profile, index, self) =>
                index ===
                self.findIndex((p) => p.applicant_id === profile.applicant_id)
            );
            setProfiles(uniqueProfiles);
          } else {
            toast.error("Unexpected data format from server.");
          }
        } else {
          toast.error("Failed to fetch profiles. Status: " + response.status);
        }
      } catch (err) {
        // Enhanced error logging
        if (axios.isAxiosError(err)) {
          console.error("Axios error:", err.message);
          if (err.response) {
            console.error("Error response data:", err.response.data);
            console.error("Error response status:", err.response.status);
          }
        } else {
          console.error("Unexpected error:", err);
        }
        toast.error("Failed to load profiles");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchInterviewApplicants();
  }, []);

  const handleEdit = (profile) => {
    setapplicant_uuid(profile.applicant_id); // If this is required
    navigate("/edit", { state: { profile } }); // Pass the full profile object in state
  };
  if (loading) {
    return <Loader />; // Loading state
  }

  return (
    <div className="container-fluid">
      <div className="col-12 container-fluid w-80">
        <Table className="table table-striped table-sm">
          <TableHead headData={TableHeaders} />
          <tbody>
            {Array.isArray(profiles) && profiles.length > 0 ? (
              profiles.map((profile, index) => (
                <tr className="p-2" key={profile.id}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{profile.applicant_id}</td>
                  <td className="p-2">{profile.applicant_name}</td>
                  <td className="p-2">{profile.applicant_phone}</td>
                  <td className="p-2">{profile.hr_name}</td>
                  <td className="p-2">
                    <Button
                      variant="btn-primary"
                      className="border-0"
                      label="Edit Record"
                      onClick={() => handleEdit(profile)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No profiles found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminHrEdit;

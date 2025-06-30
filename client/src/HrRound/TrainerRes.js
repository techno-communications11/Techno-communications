import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import Loader from "../utils/Loader";
import TableHead from "../utils/TableHead";
import ConfirmationModal from "../utils/ConfirmationModal";
import { MyContext } from "../pages/MyContext";
import API_URL from "../Constants/ApiUrl";

function TrainerRes({ setTrainerCount }) {
 
  const { userData } = useContext(MyContext);
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    console.log("userData:", userData);
    console.log("userData.id:", userData?.id);

    const assignedToInterviewer = async () => {
      if (!userData?.id) {
        console.error("User ID not available");
        toast.error("User ID not available. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fullUrl = `${API_URL}/users/${userData.id}/getAllTrainerFeedbackApplicants`;
        console.log("Fetching from URL:", fullUrl);
        const response = await axios.get(fullUrl, {
          withCredentials: true,
          timeout: 5000,
        });

        if (response.status === 200) {
          setProfiles(response.data || []);
          setTrainerCount((response.data || []).length);
        }
      } catch (err) {
        console.error("Error fetching trainer feedback applicants:", err);
        if (err.response?.status === 404) {
          setProfiles([]);
          setTrainerCount(0);
        } else {
           console.log(err);
        }
      } finally {
        setLoading(false);
      }
    };

    assignedToInterviewer();
  }, [API_URL, userData?.id, setTrainerCount]);

  const handleActionClick = (profile, action) => {
    console.log("handleActionClick called with:", { profile, action });
    setSelectedProfile(profile);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedProfile || !actionType) {
      console.error("Missing selectedProfile or actionType");
      return;
    }

    setActionLoading(true);
    const payload = {
      applicant_uuid: selectedProfile.applicant_uuid,
      action: actionType === "Selected" ? "selected at Hr" : "rejected at Hr",
      comments: "Action taken by HR",
    };

    try {
      const res = await axios.post(`${API_URL}/updatestatus`, payload, {
        withCredentials: true,
        timeout: 5000,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1800);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setActionLoading(false);
      setShowModal(false);
      setSelectedProfile(null);
      setActionType("");
    }
  };

  if (loading) {
    return <Loader />;
  }

  const tableHeaders = [
    "S.No",
    "Applicant Name",
    "Applicant UUID",
    "Trainer Feedback",
    "Final Action",
  ];

  return (
    <div className="container-fluid">
      <div className="col-12 w-100">
        <Table striped bordered hover className="table-sm">
          <TableHead headData={tableHeaders} />
          <tbody>
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center">
                  No profiles available.
                </td>
              </tr>
            ) : (
              profiles.map((profile, index) => (
                <tr key={profile.id || profile.applicant_uuid || index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{profile.applicant_name || "-"}</td>
                  <td className="p-2">{profile.applicant_uuid || "-"}</td>
                  <td className="p-2">{profile.applicant_status || "-"}</td>
                  <td className="p-2">
                    <MuiButton
                      variant="contained"
                      sx={{
                        backgroundColor: "#E10174",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#c6005e",
                        },
                        mr: 1,
                      }}
                      onClick={() => handleActionClick(profile, "Selected")}
                      disabled={actionLoading}
                    >
                      Select
                    </MuiButton>
                    <MuiButton
                      variant="contained"
                      color="primary"
                      sx={{
                        "&:hover": {
                          backgroundColor: "#1565c0",
                        },
                      }}
                      onClick={() => handleActionClick(profile, "Rejected")}
                      disabled={actionLoading}
                    >
                      Reject
                    </MuiButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <ConfirmationModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedProfile(null);
          setActionType("");
        }}
        handleConfirm={confirmAction}
        message={`Are you sure you want to mark this applicant as ${
          actionType === "Selected" ? "selected" : "rejected"
        } at HR?`}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default TrainerRes;
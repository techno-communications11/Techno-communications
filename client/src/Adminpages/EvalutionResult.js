import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../utils/Loader";
import Button from "../utils/Button";
import TableHead from "../utils/TableHead";
import { MyContext } from "../pages/MyContext";
import API_URL from "../Constants/ApiUrl";

const TableHeader = [
  "SI.No",
  "Applicant Name",
  "Applicant UUID",
  "HR Name",
  "Current Status",
  "Response Period",
  "Final Action",
];

function EvalutionResult({ setTrainerCount }) {

  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(MyContext);

  useEffect(() => {
    const assignedToInterviewer = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/users/get_All_Trainer_Feedback_Applicant_details`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setProfiles(response.data);
          if (typeof setTrainerCount === 'function') {
            setTrainerCount(response.data.length);
          }
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userData?.id) {
      assignedToInterviewer();
    }
  }, [API_URL, userData?.id, setTrainerCount]);

  const handleActionClick = (profile, action) => {
    setSelectedProfile(profile);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedProfile || !actionType) return;

    const payload = {
      applicant_uuid: selectedProfile.applicant_uuid,
      action: actionType === "Selected" ? "selected at Hr" : "rejected at Hr",
    };

    try {
      const res = await axios.post(
        `${API_URL}/updatestatus`,
        payload,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 1800);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="col-12 container-fluid w-80">
        <Table className="table table-striped table-sm">
          <TableHead headData={TableHeader} />
          <tbody>
            {profiles.map((profile, index) => (
              <tr className="p-2" key={profile.id}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{profile.applicant_name}</td>
                <td className="p-2">{profile.applicant_uuid}</td>
                <td className="p-2">{profile.hr_name}</td>
                <td className="p-2">{profile.applicant_status}</td>
                <td className="p-2">
                  {(() => {
                    const days =
                      Math.floor(
                        (new Date() - new Date(profile.updated_at)) /
                          (1000 * 60 * 60 * 24)
                      ) + 1;
                    return `${days} ${days > 1 ? "Days" : "Day"}`;
                  })()}
                </td>
                <td className="d-flex gap-3 p-2">
                  <Button
                    variant="btn-primary w-100"
                    onClick={() => handleActionClick(profile, "Selected")}
                    label="Select"
                  />
                  <Button
                    variant="btn-danger w-100"
                    onClick={() => handleActionClick(profile, "Rejected")}
                    label="Reject"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {actionType.toLowerCase()} {selectedProfile?.applicant_name}?
        </Modal.Body>
        <Modal.Footer className="d-flex">
          <Button
            variant="btn-secondary w-25"
            onClick={() => setShowModal(false)}
            label="Cancel"
          />
          <Button
            variant="btn-primary w-25"
            onClick={confirmAction}
            label="Confirm"
          />
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default EvalutionResult;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function TrainerRes() {
    const apiurl = process.env.REACT_APP_API;

    const navigate = useNavigate();
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        const assignedToInterviewer = async () => {
            try {
                const response = await axios.get(`${apiurl}/users/${userData.id}/trainerfeedbackapplicants`, {
                    headers: getAuthHeaders()
                });

                console.log(response.data);
                if (response.status === 200) {
                    setProfiles(response.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        assignedToInterviewer();
    }, [apiurl, userData.id]);

    const handleInterviewClick = (profile) => {
        setSelectedProfile(profile);
        setShowModal(true);
    };

    const confirmAction = async () => {
        const payload = {
            applicant_uuid: selectedProfile.applicant_uuid,
            action: selectedProfile.applicant_status === "Recommended For Hiring" ? "selected at Hr" : "rejected at Hr",
        };

        console.log("finalllllstatus....", payload);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/updatestatus`, payload);

            if (res.status === 200) {
                // Show success message
                toast.success(res.data.message);

                // Reload the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1800);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Show error message
            toast.error("Failed to update status.");
        }

        setShowModal(false);
    };

    return (
        <div>
            <div className="col-12 container w-80">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Applicant Name</th>
                            <th>Applicant UUID</th>
                            <th>Trainer Feedback</th>
                            <th>Final Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((profile, index) => (
                            <tr key={profile.id}>
                                <td>{index + 1}</td>
                                <td>{profile.applicant_name}</td>
                                <td>{profile.applicant_uuid}</td>
                                <td>{profile.applicant_status}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleInterviewClick(profile)}
                                    >
                                        Confirm
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you are Hirring  {selectedProfile?.applicant_name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmAction}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default TrainerRes;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button as MuiButton } from '@mui/material';

function TrainerRes({ setTrainerCount }) {
    const apiurl = process.env.REACT_APP_API;
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        const assignedToInterviewer = async () => {
            try {
                const response = await axios.get(`${apiurl}/users/${userData.id}/trainerfeedbackapplicants`, {
                    headers: getAuthHeaders()
                });

                if (response.status === 200) {
                    setProfiles(response.data);
                    setTrainerCount(response.data.length); // Pass count back to HrTabs
                }
            } catch (err) {
                console.log(err);
            }
        };
        assignedToInterviewer();
    }, [apiurl, userData.id, setTrainerCount]);

    const handleActionClick = (profile, action) => {
        setSelectedProfile(profile);
        setActionType(action); // Track if it's "Selected" or "Rejected"
        setShowModal(true);
    };

    const confirmAction = async () => {
        const payload = {
            applicant_uuid: selectedProfile.applicant_uuid,
            action: actionType === 'Selected' ? 'selected at Hr' : 'rejected at Hr',
        };

        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/updatestatus`, payload);

            if (res.status === 200) {
                toast.success(res.data.message);

                setTimeout(() => {
                    window.location.reload();
                }, 1800);
            }
        } catch (error) {
            console.error("Error updating status:", error);
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
                                    <MuiButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleActionClick(profile, 'Selected')}
                                    >
                                        Select
                                    </MuiButton>
                                    <MuiButton
                                        variant="contained"
                                        color="secondary"
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => handleActionClick(profile, 'Rejected')}
                                    >
                                        Reject
                                    </MuiButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to {actionType.toLowerCase()} {selectedProfile?.applicant_name}?
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button,Table } from 'react-bootstrap';
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
            <div className="col-12 container-fluid w-80">
                <Table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th style={{backgroundColor:'#E10174'}}>S.No</th>
                            <th style={{backgroundColor:'#E10174'}}>Applicant Name</th>
                            <th style={{backgroundColor:'#E10174'}}>Applicant UUID</th>
                            <th style={{backgroundColor:'#E10174'}}>Trainer Feedback</th>
                            <th style={{backgroundColor:'#E10174'}}>Final Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((profile, index) => (
                            <tr key={profile.id}>
                                <td className='p-2'>{index + 1}</td>
                                <td className='p-2'>{profile.applicant_name}</td>
                                <td className='p-2'>{profile.applicant_uuid}</td>
                                <td className='p-2'>{profile.applicant_status}</td>
                                <td className='p-2'>
                                    <MuiButton
                                        style={{backgroundColor:'#E10174'}} className='text-white'
                                        onClick={() => handleActionClick(profile, 'Selected')}
                                    >
                                        Select
                                    </MuiButton>
                                    <MuiButton
                                        style={{marginLeft: '10px'}} className=' bg-primary text-white'
                                        onClick={() => handleActionClick(profile, 'Rejected')}
                                    >
                                        Reject
                                    </MuiButton>
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

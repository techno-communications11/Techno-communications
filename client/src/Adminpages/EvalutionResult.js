import React, { useEffect, useState } from 'react';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button,Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button as MuiButton } from '@mui/material';

function EvalutionResult({ setTrainerCount }) {
    const apiurl = process.env.REACT_APP_API;
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        const assignedToInterviewer = async () => {
            try {
                const response = await axios.get(`${apiurl}/users/getAllTrainerFeedbackApplicants`, {
                    headers: getAuthHeaders()
                });

                if (response.status === 200) {
                    // console.log(">>", response.data)
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
                            <th style={{backgroundColor:"#E10174"}}>S.No</th>
                            <th style={{backgroundColor:"#E10174"}}>Applicant Name</th>
                            <th style={{backgroundColor:"#E10174"}}>Applicant UUID</th>
                            <th style={{backgroundColor:"#E10174"}}>HR Name</th>
                            <th style={{backgroundColor:"#E10174"}}>Current Status</th>
                            <th style={{backgroundColor:"#E10174"}}>Response Period</th>
                            <th style={{backgroundColor:"#E10174"}}>Final Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((profile, index) => (
                            <tr className='p-2' key={profile.id}>
                                <td className='p-2'>{index + 1}</td>
                                <td className='p-2'>{profile.applicant_name}</td>
                                <td className='p-2'>{profile.applicant_uuid}</td>
                                <td className='p-2'>{profile.hr_name}</td>
                                <td className='p-2'>{profile.applicant_status}</td>
                                <td className='p-2'>
                                {`${Math.floor((new Date() - new Date(profile.updated_at)) / (1000 * 60 * 60 * 24)) + 1} ${Math.floor((new Date() - new Date(profile.updated_at)) / (1000 * 60 * 60 * 24)) + 1 > 1 ? 'Days' : 'Day'}`}
                                </td>

                                <td className='p-2'>
                                    <MuiButton
                                        style={{backgroundColor:"#E10174",color:'white'}} className='border-0'
                                        onClick={() => handleActionClick(profile, 'Selected')}
                                    >
                                        Select
                                    </MuiButton>
                                    <MuiButton
                                        variant="contained"
                                        color="primary"
                                        style={{ marginLeft: '10px' }}
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

export default EvalutionResult;

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import { Button, Dropdown, Modal } from 'react-bootstrap'; // Using React Bootstrap for modal and dropdown
import { Assignment } from '@mui/icons-material'; // Assignment icon
import { toast, ToastContainer } from 'react-toastify';

function AdminInterviewd() {
    const apiurl = process.env.REACT_APP_API;
    const navigate = useNavigate();
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]);
    const [hrs, setHrs] = useState([]); // State to store HRs
    const { setapplicant_uuid } = useContext(MyContext);
    const [activeDropdownRow, setActiveDropdownRow] = useState(null); // Track active dropdown row
    const [selectedHR, setSelectedHR] = useState(null); // Track selected HR
    const [selectedProfile, setSelectedProfile] = useState(null); // Track selected profile
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Control confirmation modal visibility

    // Fetch the applicants assigned for HR interviews
    useEffect(() => {
        const fetchInterviewApplicants = async () => {
            try {
                const response = await axios.get(`${apiurl}/users/getAllApplicationsForHR`, {
                    headers: getAuthHeaders()
                });

                if (response.status === 200) {
                    setProfiles(response.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchInterviewApplicants();
    }, [apiurl, userData]);

    // Fetch the list of HRs
    useEffect(() => {
        const fetchHRs = async () => {
            try {
                const response = await axios.get(`${apiurl}/hrs`, {
                    headers: getAuthHeaders(),
                });
                setHrs(response.data); // Set the HRs data
            } catch (err) {
                console.error(err);
            }
        };

        fetchHRs();
    }, [apiurl]);

    // Handle assignment of an applicant to selected HR after confirmation
    const handleSelect = async () => {
        try {
            await axios.post(
                `${apiurl}/newhr`, // Assuming you have an endpoint for assigning HR
                { applicantId: selectedProfile.applicant_uuid, newUserId: selectedHR.id }, // Payload format
                { headers: getAuthHeaders() }
            );
            toast.success('Assigned to New HR successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1800);
        } catch (error) {
            console.error('Error assigning HR:', error);
            toast.error('Error assigning New HR:');
        } finally {
            setShowConfirmModal(false); // Close modal after action
        }
    };

    // Open confirmation modal with selected HR
    const handleHRSelect = (hr, profile) => {
        setSelectedHR(hr); // Set selected HR
        setSelectedProfile(profile); // Set selected profile
        setShowConfirmModal(true); // Open confirmation modal
    };

    // Toggle dropdown only for the selected row
    const handleChangeScrenningToggle = (isOpen, index) => {
        if (isOpen) {
            setActiveDropdownRow(index); // Open dropdown for the current row
        } else {
            setActiveDropdownRow(null); // Close all dropdowns
        }
    };

    return (
        <div className="container">
            <div className="col-12 container w-80">
                <p className='m-1'>ALL Applicants IN Pending At HR </p>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Applicant Name</th>
                            <th>Applicant UUID</th>
                            <th>Time Of Interview</th>
                            <th>HR Name</th>
                            <th>Assign New HR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((profile, index) => (
                            <tr key={profile.id}>
                                <td>{index + 1}</td>
                                <td>{profile.applicant_name}</td>
                                <td>{profile.applicant_uuid}</td>
                                <td>{new Date(profile.time_of_hrinterview).toLocaleString('en-US', { hour12: true })}</td>
                                <td>{profile.hr_name}</td>
                                <td>
                                    <Dropdown
                                        onSelect={(eventKey) => {
                                            const selectedHR = hrs.find(hr => hr.id === parseInt(eventKey));
                                            handleHRSelect(selectedHR, profile); // Open confirmation modal
                                        }}
                                        show={activeDropdownRow === index} // Show dropdown only for the active row
                                        onToggle={(isOpen) => handleChangeScrenningToggle(isOpen, index)} // Track the row's dropdown toggle state
                                    >
                                        <Dropdown.Toggle className="w-100 bg-primary text-white border-secondary" id="dropdown-basic">
                                            <Assignment /> Change Assign To 
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-auto">
                                            {hrs
                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                .map((hr) => (
                                                    <Dropdown.Item key={hr.id} eventKey={hr.id} className="bg-light text-dark">
                                                        {hr.name}
                                                    </Dropdown.Item>
                                                ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to assign <strong>{selectedProfile?.applicant_name}</strong> to HR <strong>{selectedHR?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSelect}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default AdminInterviewd;

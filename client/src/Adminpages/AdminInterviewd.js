import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import { Button, Dropdown, Modal, Table, Container } from 'react-bootstrap'; // Using React Bootstrap for modal, dropdown, table, and container
import { Assignment } from '@mui/icons-material'; // Assignment icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function AdminInterviewd() {
    const apiurl = process.env.REACT_APP_API;
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]);
    const [hrs, setHrs] = useState([]); // State to store HRs
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
        <Container className="mt-1">
            <Table responsive striped bordered hover className="text-center">
                <thead>
                    <tr>
                        <th className="p-2" style={{ backgroundColor: "#E10174", color: "#fff" }}>S.No</th>
                        <th className="p-2" style={{ backgroundColor: "#E10174", color: "#fff" }}>Applicant Name</th>
                        <th className="p-2" style={{ backgroundColor: "#E10174", color: "#fff" }}>Applicant UUID</th>
                        <th className="p-2" style={{ backgroundColor: "#E10174", color: "#fff" }}>Time Of Interview</th>
                        <th className="p-2" style={{ backgroundColor: "#E10174", color: "#fff" }}>HR Name</th>
                        <th className="p-2" style={{ backgroundColor: "#E10174", color: "#fff" }}>Assign New HR</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((profile, index) => (
                        <tr key={profile.id}>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 text-capitalize">{profile.applicant_name}</td>
                            <td className="p-2">{profile.applicant_uuid}</td>
                            <td className="p-2">{new Date(profile.time_of_hrinterview).toLocaleString('en-US', { hour12: true })}</td>
                            <td className="p-2">{profile.hr_name}</td>
                            <td className="p-2">
                                <Dropdown
                                    onSelect={(eventKey) => {
                                        const selectedHR = hrs.find(hr => hr.id === parseInt(eventKey));
                                        handleHRSelect(selectedHR, profile); // Open confirmation modal
                                    }}
                                    show={activeDropdownRow === index} // Show dropdown only for the active row
                                    onToggle={(isOpen) => handleChangeScrenningToggle(isOpen, index)} // Track the row's dropdown toggle state
                                >
                                    <Dropdown.Toggle className=" border-0 text-white" style={{ backgroundColor: "#E10174" }} id="dropdown-basic">
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
            </Table>

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
        </Container>
    );
}

export default AdminInterviewd;

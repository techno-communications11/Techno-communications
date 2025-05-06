import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Container, Row, Col, Table, Modal } from 'react-bootstrap';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import decodeToken from '../decodedDetails';
import '../pages/loader.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useContext } from 'react';
import { MyContext } from '../pages/MyContext';
function DirectNew() {
    let userData = decodeToken();
    const [profiles, setProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [mobileNumber, setMobileNumber] = useState('');
    const [applicantDetails, setApplicantDetails] = useState(null);
    const apiurl = process.env.REACT_APP_API;
    const navigate = useNavigate();
    const { setapplicant_uuid } = useContext(MyContext);
    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiurl}/getApplicantsForDirect/${userData.id}`, {
                  withCredentials:true
                });
                setProfiles(response.data);
            } catch (error) {
                setError('No Avilable Profiles.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const filteredProfiles = profiles.filter(profile => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
            profile.applicant_name?.toLowerCase().includes(lowercasedTerm) ||
            profile.applicant_email?.toLowerCase().includes(lowercasedTerm) ||
            profile.applicant_phone?.toString().includes(lowercasedTerm) ||
            profile.created_at?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const sortedProfiles = [...filteredProfiles].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const uniqueApplicants = sortedProfiles.filter((applicant, index, self) =>
        index === self.findIndex(a => a.applicant_uuid === applicant.applicant_uuid)
    );


    

    const handleSearch = async () => {
        try {
            const response = await fetch(`${apiurl}/getstatusnyphone/${mobileNumber}`,{withCredentials:true});
            const data = await response.json();
            setApplicantDetails(data);
            // console.log('data', data);
        } catch (error) {
            console.error('Error fetching applicant details:', error);
        }
    };

    const handleProceed = (profileId) => {
        // Logic for proceeding the applicant, e.g., updating status
        // console.log('Proceed clicked for profile ID:', profileId);
        setapplicant_uuid(profileId)
        navigate("/hrinterview");
        // You can make an API call here to update the applicant status to 'Proceed'
    };

    const handleReject = async (applicant_uuid) => {
        // console.log("Rejecting applicant with UUID:", applicant_uuid);
        const action = "rejected at Screening";

        const payload = {
            applicant_uuid: applicant_uuid,
            action,
        };

        // console.log("Payload for rejection:", payload);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/updatestatus`, payload,{withCredentials:true});

            if (res.status === 200) {
                toast.success(res.data.message);

                // Reload the page after a short delay
                setTimeout(() => {
                    window.location.reload(); // use window.location.reload() to refresh the page
                }, 1800);
            }
        } catch (error) {
            console.error("Error updating rejection status:", error);
            toast.error("Failed to update rejection status.");
        }
    };
    return (
        <Container>
            <ToastContainer />
            <Form className='mb-3'>
                <Row className='align-items-center'>
                    <Row className='text-start'>
                        <p>Want To Check Applicant Status?</p>
                    </Row>
                    <Col xs="auto">
                        <Form.Label htmlFor="mobileNumber" visuallyHidden>
                            Mobile Number to check Applicant status
                        </Form.Label>
                        <Form.Control
                            type="text"
                            id="mobileNumber"
                            placeholder="Enter mobile number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button onClick={handleSearch} variant="outlined">
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>

            {applicantDetails && (
                <Box mb={3}>
                    <Typography variant="h6">Applicant Details</Typography>
                    <Typography><span style={{ color: "blue" }}>Name:</span> {applicantDetails.name}</Typography>
                    <Typography><span style={{ color: "blue" }}>Status:</span> {applicantDetails.status}</Typography>
                    <Typography><span style={{ color: "blue" }}>Screening Manager:</span> {applicantDetails.screening_manager_name}</Typography>

                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                            setApplicantDetails(null);
                            setMobileNumber("");
                        }}
                        sx={{ marginTop: 2 }}
                    >
                        Close
                    </Button>
                </Box>
            )}

            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Form className="mb-4">
                        <Form.Control
                            className="m-auto border-black fw-bolder w-100 custom-placeholder"
                            type="text"
                            placeholder="Search by Name, Email, Phone, Market, or Date..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form>
                </Col>
            </Row>

            {loading ? (
                <p>Loading profiles...</p>
            ) : (
                <Row>
                    <Col>
                        <Table striped>
                            <thead>
                                <tr>
                                    {['SC.NO', 'Name', 'Phone', 'Referred By', 'Reference NTID', 'Created At', 'Action'].map((header, index) => (
                                        <th key={index} style={{ backgroundColor: '#E10174', color: 'white' }}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueApplicants.length > 0 ? (
                                    uniqueApplicants.map((profile, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{profile.applicant_name}</td>
                                            <td>{profile.applicant_phone}</td>
                                            <td>{profile.referred_by}</td>
                                            <td>{profile.reference_id}</td>
                                            <td>{new Date(profile.created_at).toLocaleString('en-US', { hour12: true })}</td>
                                            <td>
                                                <Button
                                                    variant='contained'
                                                    color="primary"
                                                    onClick={() => handleProceed(profile.applicant_uuid)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Proceed
                                                </Button>
                                                <Button
                                                    variant='contained'
                                                    color="secondary"
                                                    onClick={() => handleReject(profile.applicant_uuid)}
                                                >
                                                    Reject
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No profiles available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}

            {showModal && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProfile?.applicant_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Email: {selectedProfile?.applicant_email}</p>
                        <p>Phone: {selectedProfile?.applicant_phone}</p>
                        <p>Referred By: {selectedProfile?.referred_by}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Container>
    );
}

export default DirectNew;

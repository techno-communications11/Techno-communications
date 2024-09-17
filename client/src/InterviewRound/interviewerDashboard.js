import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Modal, Button, Table, Form } from 'react-bootstrap';
import decodeToken from '../decodedDetails';
import getStatusCounts from '../pages/getStatusCounts'; // Ensure this path is correct
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure this is imported

function InterviewerDashboard() {
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState([]);
    const userData = decodeToken();

    useEffect(() => {
        const fetchStatusCounts = async () => {
            try {
                const data = await getStatusCounts();
                setStats(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching status counts:", error);
            }
        };
        fetchStatusCounts();
    }, []);

    // Static statuses with colors
   // Assuming stats is an array of objects with properties { status, count }
const filteredStatuses = [
    { status: "no show at Interview", bgColor: "#FF5733" }, // Orange
    { status: "selected at Interview", bgColor: "#28A745" }, // Green
    { status: "rejected at Interview", bgColor: "#DC3545" }, // Red
    { status: "put on hold at Interview", bgColor: "#6C757D" }, // Gray
    { status: "Moved to HR", bgColor: "#007BFF" }, // Blue
    { status: "need second opinion at Interview", bgColor: "#FFCC00" } // Yellow
  ];
  
  // Filter the stats based on statuses in filteredStatuses
  const TotalCount = stats
    .filter(stat => filteredStatuses.some(fStatus => fStatus.status === stat.status)) // Filter only matching statuses
    .reduce((total, stat) => total + stat.count, 0); // Sum the count for matching statuses
  
  console.log("TotalCount>>>>>>>>>", TotalCount);
  
    useEffect(() => {
        if (searchQuery) {
            const filtered = profiles.filter(profile =>
                profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                profile.phone.toString().includes(searchQuery) ||
                profile.status.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProfiles(filtered);
        } else {
            setFilteredProfiles(profiles);
        }
    }, [searchQuery, profiles]);

    const handleShow = (status) => {
        // Fake data for demonstration purposes
        const fakeProfiles = [
            { id: 1, name: "John Doe", email: "johndoe@example.com", phone: "1234567890", status },
            { id: 2, name: "Jane Smith", email: "janesmith@example.com", phone: "0987654321", status }
        ];
        setShowModal(true);
        setProfiles(fakeProfiles);
        setFilteredProfiles(fakeProfiles);
        setSelectedStatus(status);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setProfiles([]);
        setFilteredProfiles([]);
        setSearchQuery('');
    };

    return (
        <Container>
            <div className='d-flex my-4'>
                <h2 className="text-start fw-bolder">{`Interviewer Dashboard`}</h2>
                <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
            </div>
            <Row>
                {/* Total Card */}
                <Col xs={12} sm={6} md={4} lg={2} className="mb-4">
                    <Card className="shadow-sm card-style h-100" style={{ cursor: "pointer", backgroundColor: "#F0F0F0" }}>
                        <Card.Body className="d-flex flex-column justify-content-center">
                            <Card.Title className="fw-bold" style={{
                                textTransform: 'capitalize',
                                fontFamily: 'Roboto, sans-serif',
                            }}>
                                {TotalCount}
                            </Card.Title>
                            <Card.Text className='fs-6 fw-bold'>Total</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Cards for each status */}
                {filteredStatuses.map(({ status, bgColor }) => {
                    const stat = stats.find(stat => stat.status === status) || { count: 0 };
                    return (
                        <Col key={status} xs={12} sm={6} md={4} lg={2} className="mb-4">
                            <Card
                                // onClick={() => handleShow(status)}
                                className="shadow-sm card-style h-100"
                                style={{ cursor: "pointer", backgroundColor: bgColor }}
                            >
                                <Card.Body className="d-flex flex-column justify-content-center">
                                    <Card.Title className="fw-bold" style={{
                                        textTransform: 'capitalize',
                                        fontFamily: 'Roboto, sans-serif',
                                    }}>
                                        {stat.count}
                                    </Card.Title>
                                    <Card.Text className='fs-6 fw-bold' style={{ textTransform: 'capitalize' }}>{status}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Modal for displaying profiles */}
            <Modal show={showModal} onHide={handleCloseModal} size='xl' className="custom-modal-width" style={{ marginTop: '7vh' }}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedStatus} Profiles</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <Form className="mb-3 w-50">
                        <Form.Control
                            type="text"
                            placeholder="Search profiles by name, email, phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form>
                    {filteredProfiles.length > 0 ? (
                        <Table striped bordered hover responsive className='border-dark'>
                            <thead>
                                <tr>
                                    <th>SC.No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProfiles.map((profile, index) => (
                                    <tr key={profile.id}>
                                        <td>{index + 1}</td>
                                        <td>{profile.name}</td>
                                        <td>{profile.email}</td>
                                        <td>{profile.phone}</td>
                                        <td>{profile.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No profiles available for this status.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </Container>
    );
}

export default InterviewerDashboard;

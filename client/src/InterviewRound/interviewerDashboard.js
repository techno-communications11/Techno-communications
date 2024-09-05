import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Modal, Button, Table, Form } from 'react-bootstrap';
import decodeToken from '../decodedDetails';
import getStatusCounts from '../pages/getStatusCounts';
function InterviewerDashboard() {
    const [stats, setStats] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const userData = decodeToken();

    useEffect(() => {
        // Function to fetch and set the status counts
        const fetchStatusCounts = async () => {
            try {
                const data = await getStatusCounts(); // Await the async function
                setStats(data);
                console.log(data) // Set the data to state
            } catch (error) {
                console.error("Error fetching status counts:", error);
            }
        };
        fetchStatusCounts(); // Call the async function
    }, []);

    const filteredStatuses = [
        "need second opinion at Interview",
        "no show at Interview",
        "Moved to HR",
        "selected at Interview",
        "put on hold at Interview"
    ];
    let TotalCount = 0;
    stats.filter((stat) => filteredStatuses.includes(stat.status))
        .map((stat) => (TotalCount += stat.count))
    console.log(TotalCount)


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

    const handleShow = async (status) => {
        try {
            setShowModal(true);
            const response = await axios.get('http://localhost:5000/api/profiles-by-status', {
                params: { status }
            });
            setProfiles(response.data);
            setFilteredProfiles(response.data);
            setSelectedStatus(status);

        } catch (error) {
            console.error('Failed to fetch profiles:', error);
        }
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
  <Col xs={12} sm={6} md={4} lg={2} className="mb-4">
    <Card className="shadow-sm card-style h-100" onClick={() => handleShow('total')} style={{ cursor: "pointer" }}>
      <Card.Body className="d-flex flex-column justify-content-center">
        <Card.Title className="fw-bold" style={{
          textTransform: 'capitalize',
          fontFamily: 'Roboto, sans-serif',
        }}>
          {TotalCount}
        </Card.Title>
        <Card.Text className='fs-6 fw-bold' >Total</Card.Text>
      </Card.Body>
    </Card>
  </Col>

  {stats
    .filter((stat) => filteredStatuses.includes(stat.status))
    .map((stat) => (
      <Col key={stat.id} xs={12} sm={6} md={4} lg={2} className="mb-4">
        <Card
          onClick={() => handleShow(stat.status)}
          className="shadow-sm card-style h-100"
          style={{ cursor: "pointer" }}
        >
          <Card.Body className="d-flex flex-column justify-content-center">
            <Card.Title className="fw-bold" style={{
              textTransform: 'capitalize',
              fontFamily: 'Roboto, sans-serif',
            }}>
              {stat.count}
            </Card.Title>
            <Card.Text className='fs-6 fw-bold'>{stat.status}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ))}
</Row>



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
                                    {/* Add other relevant columns */}
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
                                        {/* Add other relevant fields */}
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
        </Container>
    );
}

export default InterviewerDashboard;

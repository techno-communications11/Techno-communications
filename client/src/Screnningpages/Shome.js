import React, { useEffect, useState } from 'react';
import { Container, Modal, Button, Form, Table, Card, Row, Col } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import '../pages/loader.css';
import getStatusCounts from '../pages/getStatusCounts';

function ScreeningHome() {
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
      } catch (error) {
        console.error("Error fetching status counts:", error);
      }
    };
    fetchStatusCounts();
  }, []);

  // Fake numbers for the statuses
  const filteredStatuses = [
    { status: 'pending at Screening', color: '#f0ad4e' },
    { status: 'no response at Screening', color: '#d9534f' },
    { status: 'Not Interested at screening', color: '#5bc0de' },
    { status: 'rejected at Screening', color: '#d9534f' },
    { status: 'moved to Interview', color: '#5cb85c' },
  ];

  const TotalCount = stats
    .filter(stat => filteredStatuses.some(fStatus => fStatus.status === stat.status)) // Filter only matching statuses
    .reduce((total, stat) => total + stat.count, 0); // Sum the count for matching statuses

  console.log("TotalCount>>>>>>>>>", TotalCount);
  useEffect(() => {
    if (searchQuery) {
      const filtered = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.profileStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.phone.toString().includes(searchQuery) ||
        profile.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.referBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.date && profile.date.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(profiles);
    }
  }, [searchQuery, profiles]);

  const handleShow = async (status) => {
    setShowModal(true);
    const fakeProfiles = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', referBy: 'Jane', referedId: 'NT001', market: 'New York', profileStatus: status, createdAt: new Date(), comments: 'N/A' },
      // Add more fake profiles if needed
    ];
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

  const formatTime = (date) => {
    return date ? format(parseISO(date), 'EEE dd MMM yyyy HH:mm') : 'N/A';
  };

  return (
    <Container style={{ minHeight: "80vh" }}>
      <div className='d-flex my-4'>
        <h2 className="text-start fw-bolder">{`Screening Dashboard`}</h2>
        <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
      </div>
      <Link to="/marketjobopenings" style={{ textDecoration: 'none' }}>
        <h5 className='text-end mb-4'>Click here to view Market Job Openings</h5>
      </Link>

      <Row>
        {/* Total Card */}
        <Col xs={12} sm={6} md={4} lg={2} className="mb-4">
          <Card className="shadow-sm h-100" style={{ backgroundColor: '#0275d8', cursor: 'pointer', color: 'white' }}>
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="fw-bold" style={{ fontSize: '2rem' }}>
                {TotalCount}
              </Card.Title>
              <Card.Text className='fs-6 fw-bold'>
                Total
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Status Cards */}
        {filteredStatuses.map(({ status, color }) => {
          const stat = stats.find(stat => stat.status === status);
          return (
            <Col key={status} xs={12} sm={6} md={4} lg={2} className="mb-4">
              <Card
                className="shadow-sm h-100"
                style={{ backgroundColor: color, cursor: 'pointer', color: 'white' }}
              // onClick={() => handleShow(status)}
              >
                <Card.Body className="d-flex flex-column justify-content-center">
                  <Card.Title className="fw-bold" style={{ fontSize: '2rem' }}>
                    {stat ? stat.count : 0}
                  </Card.Title>
                  <Card.Text className='fs-6 fw-bold' style={{ textTransform: 'capitalize' }}>
                    {status}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal for displaying profiles */}
      <Modal show={showModal} onHide={handleCloseModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStatus} Profiles</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Form className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search profiles by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
          {filteredProfiles.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>SC.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((profile, index) => (
                  <tr key={profile.id}>
                    <td>{index + 1}</td>
                    <td>{profile.name}</td>
                    <td>{profile.email}</td>
                    <td>{profile.phone}</td>
                    <td>{profile.profileStatus}</td>
                    <td>{formatTime(profile.createdAt)}</td>
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

export default ScreeningHome;

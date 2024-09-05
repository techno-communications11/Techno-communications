import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Modal, Button, Form, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import getStatusCounts from '../pages/getStatusCounts';
import '../pages/loader.css';
import { Link } from 'react-router-dom';

function ScreeningHome() {
  const [stats, setStats] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const apiUrl = process.env.REACT_APP_API;
  const userData = decodeToken();

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const data = await getStatusCounts();
        setStats(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching status counts:", error);
        setError('Failed to fetch status counts. Please try again later.');
      }
    };
    fetchStatusCounts();
  }, []);

  const filteredStatuses = [
    "pending at Screening",
    "no show at Screening",
    "moved to Interview",
    "rejected at Screening",
    "Not Interested at screening"
  ];

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
    try {
      setShowModal(true);
      const response = await axios.get(`${apiUrl}/auth/getprofiles`, {
        params: { status },
        headers: getAuthHeaders(),
      });
      setProfiles(response.data);
      setFilteredProfiles(response.data);
      setSelectedStatus(status);

    } catch (error) {
      console.error("Error fetching profiles:", error);
      setError('Failed to fetch profiles. Please try again later.');
    }
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
  let TotalCount = 0;
  stats.filter((stat) => filteredStatuses.includes(stat.status))
    .map((stat) => (TotalCount += stat.count))
  console.log(TotalCount)


  return (
    <Container style={{ minHeight: "80vh" }}>
      <div className='d-flex my-4'>
        <h2 className="text-start fw-bold">Screening Dashboard</h2>
        <h2 className='ms-auto fw-bold'>{userData.name}</h2>
      </div>
      <Link to="/marketjobopenings" style={{ textDecoration: 'none' }}>
        <p className='text-end'>
          Click here to view Market Job Openings
        </p>
      </Link>

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
          <Form className="mb-3 m-auto w-50 ">
            <Form.Control
              type="text"
              className='fw-bolder border-dark'
              placeholder="Search profiles by name, status, market, date, referred by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
          {filteredProfiles.length > 0 ? (
            <Table striped bordered hover responsive className='border-dark fw-bolder'>
              <thead>
                <tr>
                  <th>SC.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Referred By</th>
                  <th>Reference NTID</th>
                  <th>Market</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((profile, index) => (
                  <tr key={profile.id}>
                    <td>{index + 1}</td>
                    <td>{profile.name}</td>
                    <td>{profile.email}</td>
                    <td>{profile.phone}</td>
                    <td>{profile.referBy}</td>
                    <td>{profile.referedId}</td>
                    <td>{profile.market}</td>
                    <td>{profile.profileStatus}</td>
                    <td>{formatTime(profile.createdAt)}</td>
                    <td>{profile.comments}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No profiles available for this status.</p>
          )}
        </Modal.Body>
        <Modal.Footer className='py-4'>
          <Button variant="secondary" className='bg-transparent text-dark' onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ScreeningHome;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Modal, Button, Form, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import '../pages/loader.css'

import decodeToken from '../decodedDetails';
function Home() {
  const [counts, setCounts] = useState({
    totalProfiles: 0,
    movedProfiles: 0,
    noResponseProfiles: 0,
    notInterestedProfiles: 0,
    rejectedProfiles: 0,
  });
  let userData = decodeToken();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/profilecounts', {
          headers: getAuthHeaders(),
        });
        setCounts(response.data);
      } catch (error) {
        setError('Failed to fetch profile counts. Please try again later.');
      }
    };

    fetchCounts();
  }, []);

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

  const fetchProfilesByStatus = async (status) => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/getprofiles', {
        params: { status },
        headers: getAuthHeaders(),
      });
      setProfiles(response.data);
      setFilteredProfiles(response.data);
      setSelectedStatus(status);
      setShowModal(true);
    } catch (error) {
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


  

  return (
    <Container style={{ minHeight: "80vh" }} >
      <div className='d-flex my-4'>
      <h2 className=" text-start fw-bold"  style={{color:'#E10174',fontFamily:"Kanit"}} >{`Screening Dahshboard`}</h2>
      <h2 className='ms-auto fw-bold' style={{color:'#E10174',fontFamily:"Kanit"}}>{userData.name}</h2>
      </div>
    
      <Row>
        <Col xs={12} sm={6} md={4} className="mb-4">
          <Card border="warning" onClick={() => fetchProfilesByStatus('Total')} className='border card-style p-4 shadow-lg card-hover-effect'>
            <div className="d-flex align-items-center">
              <img src="./image.png" alt="total" height={155} className="me-3" />
              <Card.Body>
                <Card.Title className="fw-bolder text-success">Total</Card.Title>
                <Card.Text className="display-4 fw-bolder">{counts.totalProfiles}</Card.Text>
              </Card.Body>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} className="mb-4">
          <Card border="warning" onClick={() => fetchProfilesByStatus('Moved')} className='border card-style p-4 shadow-lg card-hover-effect'>
            <div className="d-flex align-items-center">
              <img src="./success.png" alt="moved" height={155} className="me-3" />
              <Card.Body>
                <Card.Title className="fw-bolder text-success">Moved</Card.Title>
                <Card.Text className="display-4 fw-bolder">{counts.movedProfiles}</Card.Text>
              </Card.Body>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} className="mb-4">
          <Card border="warning" onClick={() => fetchProfilesByStatus('No Response')} className='border p-4 card-style shadow-lg card-hover-effect'>
            <div className="d-flex align-items-center">
              <img src="./noresponse.webp" alt="No Response" height={150} className="me-3" />
              <Card.Body>
                <Card.Title className="fw-bolder text-success">No Response</Card.Title>
                <Card.Text className="display-4 fw-bolder">{counts.noResponseProfiles}</Card.Text>
              </Card.Body>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} className="mb-4">
          <Card border="warning" onClick={() => fetchProfilesByStatus('Not Interested')} className='border card-style p-4 shadow-lg card-hover-effect'>
            <div className="d-flex align-items-center">
              <img src="./notintrested.jfif" alt="Not Interested" height={155} className="me-3" />
              <Card.Body>
                <Card.Title className="fw-bolder text-success">Not Interested</Card.Title>
                <Card.Text className="display-4 fw-bolder">{counts.notInterestedProfiles}</Card.Text>
              </Card.Body>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} className="mb-4">
          <Card border="warning" onClick={() => fetchProfilesByStatus('Reject')} className='border card-style p-4 shadow-lg card-hover-effect'>
            <div className="d-flex align-items-center">
              <img src="./rejected.webp" alt="Rejected" height={155} className="me-3" />
              <Card.Body>
                <Card.Title className="fw-bolder text-success">Rejected</Card.Title>
                <Card.Text className="display-4 fw-bolder">{counts.rejectedProfiles}</Card.Text>
              </Card.Body>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} size='xl' className="custom-modal-width"  style={{marginTop:'7vh'}}  >
        <Modal.Header closeButton>
          <Modal.Title>{selectedStatus} Profiles</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Form className="mb-3 m-auto w-50 ">
            <Form.Control
              type="text"
              className='fw-bolder  border-dark'
              placeholder="Search profiles by name, status, market, date, referred by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
          {filteredProfiles.length > 0 ? (
            <Table striped bordered hover responsive className='border-dark fw-bolder'>
              <thead>
                {["S.No", "Name", "Email", "Phone", "Referred By", "Reference NTID", "Market", "Status", "Date", "Comments"].map((header, index) => (
                  <th key={index} className="text-center" style={{ backgroundColor: "#E10174", color: "white" }}>
                    {header}
                  </th>
                ))}    
              </thead>
              <tbody>
                {filteredProfiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((profile,index) => (
                  <tr key={profile.id}>
                    <td>{index+1}</td>
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
          <Button variant="secondary" className='bg-transparent text-dark' onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Home;

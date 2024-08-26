import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Modal, Button, Table } from 'react-bootstrap';
import CanvasJSReact from '@canvasjs/react-charts';
import {jwtDecode} from 'jwt-decode';
import './AdminHome.css'; // Import custom CSS file

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function AdminHome() {
  const [profileStats, setProfileStats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [profiles, setProfiles] = useState([]);
  const token = localStorage.getItem('token');
  let name = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      name = decodedToken.name;
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }

  const fetchProfileStats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/user-status`);
      const data = response.data;

      const stats = {};
      let total = 0;

      data.forEach(status => {
        stats[status.status] = status.count;
        if (status.status === 'Total') total = status.count;
      });

      setProfileStats({
        ...stats,
        total
      });
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    }
  };

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const handleCardClick = async (type) => {
    setModalTitle(type);

    try {
      const response = await axios.get(`http://localhost:3001/api/auth/getprofilesbytype/${type}`, {
        withCredentials: true,
      });
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const chartOptions = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1", // Use a light theme for the background
    title: {
      text: "Profile Status Distribution",
      fontFamily: 'Roboto, sans-serif'
    },
    backgroundColor: "white",
    data: [{
      type: "pie",
      indexLabel: "{label}: {y}", // Display actual numbers
      startAngle: -90,
      endAngle: 90, // To create a semi-circle effect
      innerRadius: 0.5, // Adjust to make it look more like a semi-circle
      dataPoints: Object.keys(profileStats).filter(status => status !== 'Total').map(status => ({
        y: profileStats[status],
        label: status.charAt(0).toUpperCase() + status.slice(1)
      }))
    }]
  };

  return (
    <div className="container mt-5">
      <div className='d-flex'>
      <h2 className="text-start mb-4" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>{`Admin Dashboard`}</h2>
      <h2 className='ms-auto'>{name}</h2>
      </div>
      <Row className="text-center mb-4">
        {Object.entries(profileStats).filter(([status]) => status !== 'Total').map(([status, count]) => (
          <Col key={status} md={4} className="mb-3">
            <Card className="shadow-lg card-style" style={{ height: '8rem', cursor: 'pointer' }} onClick={() => handleCardClick(status)}>
              <Card.Body>
                <Card.Title style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>{status.charAt(0).toUpperCase() + status.slice(1)}</Card.Title>
                <Card.Text style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{count}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {/* <Col md={4} className="mb-3">
          <Card className="shadow-lg card-style" style={{ height: '8rem', cursor: 'pointer' }} onClick={() => handleCardClick('Total')}>
            <Card.Body>
              <Card.Title style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>Total</Card.Title>
              <Card.Text style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{profileStats.total}</Card.Text>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>

      <Row className="mb-4">
        <Col>
          <div style={{ width: '100%', height: '400px' }}>
            <CanvasJSChart options={chartOptions} />
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle} Profiles</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Market</th>
                <th>referBy</th>
                <th>referedNtid</th>
                <th>comments</th>
                <th>status</th>
                <th>createdAt</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td>{profile.id}</td>
                  <td>{profile.name}</td>
                  <td>{profile.email}</td>
                  <td>{profile.phone}</td>
                  <td>{profile.market}</td>
                  <td>{profile.referBy}</td>
                  <td>{profile.referedNtid}</td>
                  <td>{profile.comments}</td>
                  <td>{profile.status}</td>
                  <td>{profile.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminHome;

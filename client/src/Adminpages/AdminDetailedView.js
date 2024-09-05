import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Modal, Table, Container } from 'react-bootstrap';
import CanvasJSReact from '@canvasjs/react-charts';
import { jwtDecode } from 'jwt-decode';
import './AdminHome.css'; // Import custom CSS file
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { toast, ToastContainer } from 'react-toastify';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function AdminDetailedView() {
  const [profileStats, setProfileStats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [showPieModal, setShowPieModal] = useState(false);
  const token = localStorage.getItem('token');
  let name = null;
  const apiurl = process.env.REACT_APP_API;

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
      const response = await axios.get(`${apiurl}/status`);
      const data = response.data;
      let total = 0;
      const stats = {};

      data.forEach(status => {
        total += status.count;
        stats[status.status] = status.count;
      });

      setProfileStats({
        total,
        ...stats
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
    setShowModal(true);

    try {
      // Fetch profiles logic here...
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowPieModal(false);
  };

  const handleClickPieButton = () => {
    setShowPieModal(true);
  };

  const DownloadApplicantData = async () => {
    try {
      const res = await axios.get(`${apiurl}/datadowload`, {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'applicant_data.xlsx';
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Data downloaded successfully.");
    } catch (err) {
      console.error("Error downloading data:", err);
      toast.error("Failed to download data.");
    }
  }

  const chartOptions = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1",
    title: {
      text: "Profile Status Distribution",
      fontFamily: 'Roboto, sans-serif'
    },
    backgroundColor: "white",
    data: [{
      type: "pie",
      indexLabel: "{label}: {y}",
      startAngle: -90,
      endAngle: 90,
      innerRadius: 0.5,
      dataPoints: Object.keys(profileStats).filter(status => status !== 'total').map(status => ({
        y: profileStats[status],
        label: status.charAt(0).toUpperCase() + status.slice(1)
      }))
    }]
  };

  return (
    <Container className="mt-3">
      <div className='d-flex'>
        <h2 className="text-start mb-4" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>{`Detailed Admin Dashboard`}</h2>
        <h2 className='ms-auto'>{name}</h2>
      </div>
      <div md={6} className='text-start'>
        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={DownloadApplicantData} style={{ color: "green", margin: '2px', alignSelf: "end", outlineStyle: "none !important" }}>
          Download Applicants Data
        </Button>
        <Button variant="outlined" onClick={handleClickPieButton} style={{ margin: '2px' }}>
          Pie Chart view
        </Button>
      </div>
      <Row className="mb-4 mt-2">
        <Col xs={12} md={12} lg={12}>
          <Row>
            {Object.entries(profileStats).map(([status, count]) => (
              <Col key={status} xs={12} md={2} onClick={() => handleCardClick(status)} className="mb-3 d-flex align-items-stretch rounded" style={{ cursor: 'pointer' }}>
                <Card.Body className="text-center card-style p-4 w-100 d-flex flex-column justify-content-center">
                  <Card.Text
                    style={{
                      fontSize: '1rem',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </Card.Text>
                  <Card.Title
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '1rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {status !== "" ? status : "New"}
                  </Card.Title>
                </Card.Body>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Modal show={showPieModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>PIE CHART VIEW</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ width: '100%', height: '400px' }}>
            <CanvasJSChart options={chartOptions} />
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" className="custom-modal-width mt-5">
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
                <th>Refer By</th>
                <th>Referred ID</th>
                <th>Comments</th>
                <th>Status</th>
                <th>Created At</th>
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
                  <td>{profile.referedId}</td>
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
      <ToastContainer />
    </Container>
  );
}

export default AdminDetailedView;

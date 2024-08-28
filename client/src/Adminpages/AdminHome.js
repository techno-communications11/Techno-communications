import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Modal, Table } from 'react-bootstrap';
import CanvasJSReact from '@canvasjs/react-charts';
import { jwtDecode } from 'jwt-decode';
import './AdminHome.css'; // Import custom CSS file
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
// import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast, ToastContainer } from 'react-toastify';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function AdminHome() {
  const [profileStats, setProfileStats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [excel, setExcel] = useState()
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
      const response = await axios.get('http://localhost:5000/api/status');
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
      const response = await axios.get(`http://localhost:5000/api/getprofilesbytype/${type}`, {
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

  const DownloadApplicantData = async () => {
    try {
      const res = await axios.get(`${apiurl}/datadowload`, {
        responseType: 'blob',  // Important: This tells Axios to handle the response as a Blob
      });
  
      // Create a new Blob object using the response data
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Create a link element, set its href to a URL created from the Blob, and set the download attribute
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'applicant_data.xlsx';  // Set the desired file name
      document.body.appendChild(a);
      a.click();
  
      // Clean up and remove the link
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
      <Row className="mb-4">
        <Col md={8}>
          <Row>
            {Object.entries(profileStats).map(([status, count]) => (
              <Col key={status} md={4} className="mb-3">
                {status === "total" ? "" :
                  <Card className="shadow-lg card-style" style={{ height: '8rem', cursor: 'pointer' }} onClick={() => handleCardClick(status)}>
                    <Card.Body className="text-center">
                      <Card.Text style={{ fontSize: '2rem', fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>
                        {count}
                      </Card.Text>
                      <Card.Title style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                }
              </Col>
            ))}
            <Col md={4} className="mb-3">
              <Card className="shadow-lg card-style" style={{ height: '8rem', cursor: 'pointer' }}>
                <Card.Body className="text-center">
                  <Card.Text style={{ fontSize: '2rem', fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>
                    {profileStats.total || 10}
                  </Card.Text>
                  <Card.Title style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
                    Total
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={4}>

          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={DownloadApplicantData} style={{ color: "green", margin: "10px", alignSelf: "end", outlineStyle: "none !immportant" }}>
            Download  Applicants Data
          </Button>
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
    </div>
  );
}

export default AdminHome;

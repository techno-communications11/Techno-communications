import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Modal, Table, Container,Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';  // Fix import for jwtDecode
import AdminFilters from './AdminFilters';
import AdminStatusCards from './AdminStatusCards';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast, ToastContainer } from 'react-toastify';
import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function AdminDetailedView() {
  const [profileStats, setProfileStats] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusRes, setStatusRes] = useState([]);
  const [showPieModal, setShowPieModal] = useState(false);
  const token = localStorage.getItem('token');
  const [dateRange, setDateRange] = useState([null, null]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [loading, setLoading] = useState(false);
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
  // ${apiurl}/getStatusCountsByLocation/11
  const fetchProfileStats = async () => {
    setLoading(true); // Start loading
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
    }finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const handleMarketChange = (selectedId) => {
    // setSelectedMarket(selectedId);
    setSelectedLocationId(selectedId);
    console.log(selectedId); // Make sure this is defined and accessible3
  };

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
  };

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

      
      <ToastContainer />
      <AdminFilters
        setStatusCounts={setStatusCounts}
        handleMarketChange={handleMarketChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        DownloadApplicantData={DownloadApplicantData}
        handleClickPieButton={handleClickPieButton}
        setSelectedLocationId={setSelectedLocationId}
      />

      <AdminStatusCards
        handleCardClick={handleCardClick}
        showModal={showModal}
        statusCounts={statusCounts}
        modalTitle={modalTitle}
        profiles={profiles}  // Your original profiles array
        handleCloseModal={handleCloseModal}
        chartOptions={chartOptions}
        showPieModal={showPieModal}
        total={total}
        selectedLocationId={selectedLocationId}
        dateRange={dateRange} // New prop for selected location ID
      />

    </Container>
  );
}

export default AdminDetailedView;

import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import decodeToken from '../decodedDetails';
import getStatusCounts from '../pages/getStatusCounts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { MyContext } from '../pages/MyContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function InterviewerDashboard() {
  const [stats, setStats] = useState([]);
  const userData = decodeToken();
  const { setCaptureStatus } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const data = await getStatusCounts();
        setStats(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching status counts:", error);
      }
    };
    fetchStatusCounts();
  }, []);

  const filteredStatuses = [
    { status: "no show at Interview", bgColor: "#FF5733" }, // Orange
    { status: "selected at Interview", bgColor: "#28A745" }, // Green
    { status: "rejected at Interview", bgColor: "#DC3545" }, // Red
    { status: "put on hold at Interview", bgColor: "#6C757D" }, // Gray
    { status: "Moved to HR", bgColor: "#007BFF" }, // Blue
    { status: "need second opinion at Interview", bgColor: "#FFCC00" } // Yellow
  ];

  const handleData = (status) => {
    try {
      // console.log(status);
      setCaptureStatus(status);
      navigate('/detailview');
    } catch (error) {
      console.error('Error in handleData:', error);
    }
  };

  // Filter the stats based on statuses in filteredStatuses
  const TotalCount = stats
    .filter(stat => filteredStatuses.some(fStatus => fStatus.status === stat.status)) // Filter only matching statuses
    .reduce((total, stat) => total + stat.count, 0); // Sum the count for matching statuses

  // Prepare the Pie chart data
  const pieData = {
    labels: filteredStatuses.map(({ status }) => status),
    datasets: [{
      label: 'Interview Status Distribution',
      data: filteredStatuses.map(({ status }) => {
        const stat = stats.find(stat => stat.status === status) || { count: 0 };
        return stat.count;
      }),
      backgroundColor: filteredStatuses.map(({ bgColor }) => bgColor),
    }],
  };

  return (
    <Container>
      <div className='d-flex my-4'>
        <h2 className="text-start fw-bolder">{`Interviewer Dashboard`}</h2>
        <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
      </div>

      <Row className="mb-4">
        {/* Left Half: Pie Chart */}
        <Col xs={12} sm={6} md={6} lg={4}>
          <Card className="shadow-sm card-style h-100">
            <Card.Body>
              <h5 className="text-center mb-4">Interview Status Distribution</h5>
              <Pie data={pieData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Right Half: Cards for each status */}
        <Col xs={12} sm={6} md={6} lg={8}>
          <Row className="mb-4">
            {/* Total Count Card */}
            <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="shadow-sm card-style  " style={{ cursor: "pointer", backgroundColor: "#F0F0F0", height:'150px' }} onClick={() => handleData("Total2")}>
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
                <Col key={status} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card
                    className="shadow-sm  card-style "
                    style={{ cursor: "pointer", backgroundColor: bgColor , height:'150px'}} onClick={() => handleData(status)}
                  >
                    <Card.Body className="d-flex  flex-column justify-content-center">
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
        </Col>
      </Row>

      <ToastContainer />
    </Container>
  );
}

export default InterviewerDashboard;

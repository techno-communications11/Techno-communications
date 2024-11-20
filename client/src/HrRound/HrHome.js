import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import decodeToken from '../decodedDetails';
import getStatusCounts from '../pages/getStatusCounts';
import { MyContext } from '../pages/MyContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function HrHome() {
  const userData = decodeToken();
  const [stats, setStats] = useState([]);
  const { setCaptureStatus } = useContext(MyContext);
  const navigate = useNavigate();

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

  const handleData = (status) => {
    try {
      console.log(status);
      setCaptureStatus(status);
      navigate('/detailview');
    } catch (error) {
      console.error('Error in handleData:', error);
    }
  };

  const filteredStatuses = [
    { status: "selected at Hr", bgColor: '#70B8E7' },  // Sky Blue
    { status: "rejected at Hr", bgColor: '#FF4F58' },  // Coral Red
    { status: "Sent for Evaluation", bgColor: '#FFBF47' },  // Golden Orange
    { status: "Applicant will think about It", bgColor: '#8E9A3D' },  // Olive Drab
    { status: "mark_assigned", bgColor: '#98C7E6' },  // Light Steel Blue
    { status: "Not Recommended For Hiring", bgColor: '#FF6347' },  // Tomato Red
    { status: "Store Evaluation", bgColor: '#6B8E23' },  // Olive Green
    { status: "Spanish Evaluation", bgColor: '#D4A5A5' },  // Salmon Pink
    { status: "backOut", bgColor: '#B0BEC5' }   // Silver Grey
  ];
  
  

  const TotalCount = stats
    .filter(stat => filteredStatuses.some(fStatus => fStatus.status === stat.status)) // Filter only matching statuses
    .reduce((total, stat) => total + stat.count, 0); // Sum the count for matching statuses

  // Prepare data for Pie chart
  const pieChartData = {
    labels: filteredStatuses.map(({ status }) => status),
    datasets: [
      {
        data: filteredStatuses.map(({ status }) => {
          const stat = stats.find(stat => stat.status === status);
          return stat ? stat.count : 0;
        }),
        backgroundColor: filteredStatuses.map(({ bgColor }) => bgColor),
        borderColor: filteredStatuses.map(() => '#fff'),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="container w-80 my-4">
        <div className="d-flex my-4">
          <h2 className="text-start fw-bolder">HR Dashboard</h2>
          <h2 className="ms-auto fw-bolder">{userData.name}</h2>
        </div>

        <Row>
          {/* Cards Column */}
          <Col xs={12} sm={6} md={8}>
            <Row>
              {/* Total Count Card */}
              <Col xs={12} sm={6} md={4} lg={2} className="mb-4">
                <Card className="shadow-sm card-style h-100" style={{ cursor: "pointer" }}>
                  <Card.Body className="d-flex flex-column justify-content-center" onClick={() => handleData("Total3")}>
                    <Card.Title className="fw-bold" style={{ textTransform: 'capitalize', fontFamily: 'Roboto, sans-serif' }}>
                      {TotalCount}
                    </Card.Title>
                    <Card.Text className="fs-6 fw-bold">Total</Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* Status Cards */}
              {filteredStatuses.map(({ status, bgColor }) => {
                const stat = stats.find(stat => stat.status === status);
                return (
                  <Col key={status} xs={12} sm={6} md={4} lg={2} className="mb-4">
                    <Card className="shadow-sm card-style h-100" style={{ cursor: "pointer", backgroundColor: bgColor }}>
                      <Card.Body className="d-flex flex-column justify-content-center" onClick={() => handleData(status)}>
                        <Card.Title className="fw-bold" style={{ textTransform: 'capitalize', fontFamily: 'Roboto, sans-serif' }}>
                          {stat ? stat.count : 0}
                        </Card.Title>
                        <Card.Text className="fs-6 fw-bold" style={{ textTransform: 'capitalize' }}>
                          {status}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>

          {/* Pie Chart Column */}
          <Col xs={12} sm={6} md={4}>
            <Card className="shadow-sm card-style h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title className="fw-bold text-center">Status Breakdown</Card.Title>
                <Pie data={pieChartData} options={{ responsive: true }} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default HrHome;

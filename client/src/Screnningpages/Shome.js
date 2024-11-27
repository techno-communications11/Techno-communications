import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import '../pages/loader.css';
import getStatusCounts from '../pages/getStatusCounts';
import { useContext } from 'react';
import { MyContext } from '../pages/MyContext';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { IoIosArrowForward } from "react-icons/io";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function ScreeningHome() {
  const { setCaptureStatus } = useContext(MyContext);
  const [stats, setStats] = useState([]);
  const userData = decodeToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const data = await getStatusCounts();
        setStats(data);
      } catch (error) {
        console.error('Error fetching status counts:', error);
      }
    };
    fetchStatusCounts();
  }, []);

  // Statuses and their colors
  const filteredStatuses = [
    { status: 'pending at Screening', color: '#f0ad4e' },
    { status: 'no show at Screening', color: '#d9534f' },
    { status: 'Not Interested at screening', color: '#5bc0de' },
    { status: 'rejected at Screening', color: '#d9534f' },
    { status: 'moved to Interview', color: '#5cb85c' },
  ];

  // Total count based on filtered statuses
  const TotalCount = stats
    .filter(stat => filteredStatuses.some(fStatus => fStatus.status === stat.status)) // Filter only matching statuses
    .reduce((total, stat) => total + stat.count, 0); // Sum the count for matching statuses

  // Pie chart data preparation
  const pieChartData = {
    labels: filteredStatuses.map(status => status.status),
    datasets: [
      {
        data: filteredStatuses.map(status => {
          const stat = stats.find(stat => stat.status === status.status);
          return stat ? stat.count : 0;
        }),
        backgroundColor: filteredStatuses.map(status => status.color),
        hoverOffset: 4,
      },
    ],
  };

  // Handle click on a card to show detailed information
  const handleShow = (status) => {
    try {
      // console.log(status);
      setCaptureStatus(status);
      navigate('/detailview');
    } catch (error) {
      console.error('Error in handleShow:', error);
    }
  };

  return (
    <Container style={{ minHeight: '80vh' }}>
      <div className='d-flex my-4'>
        <h2 className='text-start fw-bolder'>{`Screening Dashboard`}</h2>
        <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
      </div>

  
  <Link to='/marketjobopenings' className='d-flex justify-content-end mb-2' style={{ textDecoration: 'none' }}>
  <h5 className='mb-0'>Market Job Openings </h5>
     <IoIosArrowForward size={24} ms={2} />
  </Link>


      <Row className='mb-4'>
        {/* Cards Section (Right) */}
        <Col xs={12} md={6} className='mb-4'>
          <Row>
            {/* Total Count Card */}
            <Col xs={12} sm={6} md={4} lg={4} className='mb-4'>
              <Card className='shadow-sm h-100' style={{ backgroundColor: '#0275d8', cursor: 'pointer', color: 'white' }} onClick={() => handleShow('Total1')}>
                <Card.Body className='d-flex flex-column justify-content-center'>
                  <Card.Title className='fw-bold' style={{ fontSize: '2rem' }}>
                    {TotalCount}
                  </Card.Title>
                  <Card.Text className='fs-6 fw-bold'>Total</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Status Cards */}
            {filteredStatuses.map(({ status, color }) => {
              const stat = stats.find(stat => stat.status === status);
              return (
                <Col key={status} xs={12} sm={6} md={4} lg={4} className='mb-4'>
                  <Card className='shadow-sm h-100' style={{ backgroundColor: color, cursor: 'pointer', color: 'white' }} onClick={() => handleShow(status)}>
                    <Card.Body className='d-flex flex-column justify-content-center'>
                      <Card.Title className='fw-bold' style={{ fontSize: '2rem' }}>
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
        </Col>

        {/* Pie Chart Section (Left) */}
        <Col xs={12} md={4} className='mb-4 ms-auto'>
          <Card className='shadow-sm'>
            <Card.Body>
              <Card.Title className='fw-bold' style={{ fontSize: '1.5rem' }}>
                Status Distribution
              </Card.Title>
              <Pie data={pieChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ScreeningHome;

import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Row, Col, Table } from 'react-bootstrap';
import decodeToken from '../decodedDetails';
import getStatusCounts from '../pages/getStatusCounts';
function HrHome() {
  const userData = decodeToken();
  const [show, setShow] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [stats, setStats] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = (stat) => {
    setSelectedStat(stat);
    setShow(true);
  };
  useEffect(() => {
    // Function to fetch and set the status counts
    const fetchStatusCounts = async () => {
      try {
        const data = await getStatusCounts();
        setStats(data);
        console.log(data) // Set the data to state
      } catch (error) {
        console.error("Error fetching status counts:", error);
      }
    };
    fetchStatusCounts(); // Call the async function
  }, []);
  const filteredStatuses = [
    "selected at Hr",

    "Sent for Evaluation",
    "Applicant will think about It",
    "no show at Hr"
  ];
  let TotalCount = 0;
  stats.filter((stat) => filteredStatuses.includes(stat.status))
    .map((stat) => (TotalCount += stat.count))
  console.log(TotalCount)

  const sampleTableData = [
    { id: 1, name: 'John Doe', status: 'Approved', date: '2024-08-23' },
    { id: 2, name: 'Jane Smith', status: 'Pending', date: '2024-08-22' },
    { id: 3, name: 'Bob Johnson', status: 'Rejected', date: '2024-08-21' },
    { id: 4, name: 'Alice Williams', status: 'Approved', date: '2024-08-20' },
  ];
  return (
    <div>
      <div className="container w-80 my-4">
        <div className='d-flex my-4'>
          <h2 className="text-start fw-bolder">HR Dashboard</h2>
          <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
        </div>
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


      </div>
      <Modal show={show} onHide={handleClose} size="lg" className="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>{selectedStat?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sampleTableData.map((data, index) => (
                <tr key={data.id}>
                  <td>{index + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.status}</td>
                  <td>{data.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default HrHome;

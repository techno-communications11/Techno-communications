import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Table } from 'react-bootstrap';
import decodeToken from '../decodedDetails';

function ScreeningHome() {
  const userData = decodeToken();

  const [show, setShow] = useState(false);

  const [selectedStat, setSelectedStat] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (stat) => {
    setSelectedStat(stat);
    setShow(true);
  };

  // Sample statistics data
  const stats = [
    { id: 1, title: 'Total Profiles', value: 60 },
    { id: 2, title: 'Pending Interviews', value: 15 },
    { id: 3, title: 'Moved Profiles', value: 40 },
    { id: 4, title: 'Rejected Profiles', value: 5 },
  ];

  // Sample detailed data for the table (this would come from your backend)
  const sampleTableData = [
    { id: 1, name: 'John Doe', status: 'Approved', date: '2024-08-23' },
    { id: 2, name: 'Jane Smith', status: 'Pending', date: '2024-08-22' },
    { id: 3, name: 'Bob Johnson', status: 'Rejected', date: '2024-08-21' },
    { id: 4, name: 'Alice Williams', status: 'Approved', date: '2024-08-20' },
  ];

  return (
    <div>
      <div className="col-12 container w-80">
        <div className='d-flex my-4'>
          <h2 className="text-start fw-bolder">{`Screening Dashboard`}</h2>
          <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
        </div>

        <Row>
          {stats.map((stat) => (
            <Col key={stat.id} md={3} className="mb-4">
              <Card onClick={() => handleShow(stat)} className="shadow-sm cursor-pointer">
                <Card.Body>
                  <Card.Title className="fw-bold">{stat.title}</Card.Title>
                  <Card.Text className="display-4">{stat.value}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedStat?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display the data in a table format */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
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

export default ScreeningHome;

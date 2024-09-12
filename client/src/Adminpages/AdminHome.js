import React, { useState, useEffect } from 'react';
import decodeToken from '../decodedDetails';
import { Col, Container, Row, Modal, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function AdminHome() {
    const user = decodeToken();
    const apiurl = process.env.REACT_APP_API;
    const [profileStats, setProfileStats] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('');

    const fetchProfileStats = async () => {
        try {
            const response = await axios.get(`${apiurl}/status`);
            const data = response.data;
            console.log(data, "dddd")

            var total = 0
            const stats = {};

            Object.entries(data).map((statusData) => (
                total += statusData[1].count
            ))

            data.forEach(status => {

                stats[status.status] = status.count;
            });
            console.log('total ttstvt', stats)

            setProfileStats({
                total,
                ...stats

            });
        } catch (error) {
            console.error('Error fetching profile stats:', error);
        }
    };

    const fetchDetailsByStatus = async (status) => {
        try {
            // const response = await axios.get(`${apiurl}/details?status=${status}`);
            // setModalData(response.data);
            setCurrentStatus(status);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    useEffect(() => {
        fetchProfileStats();
    }, []);

    const pendingTotal =
        (profileStats["Applicant will think about It"] || 0) +
        (profileStats["Sent for Evaluation"] || 0) +
        (profileStats["moved to Interview"] || 0) +
        (profileStats["need second opinion at Interview"] || 0) +
        (profileStats["pending at Screening"] || 0) +
        (profileStats["put on hold at Interview"] || 0) +
        (profileStats["no show at Hr"] || 0) +
        (profileStats["no show at Interview"] || 0) +
        (profileStats["no show at Screening"] || 0) +
        (profileStats[""] || 0)

    const selectedTotal =
        (profileStats["selected at Hr"] || 0) +
        (profileStats["Recommended For Hiring"] || 0) +
        (profileStats["selected at Interview" || 0])

    const rejectedTotal =
        (profileStats["rejected at Hr"] || 0) +
        (profileStats["rejected at Interview"] || 0) +
        (profileStats["rejected at Screening"] || 0) +
        (profileStats["Not Interested at screening"] || 0);

    const status = {
        "Total": profileStats["total"] || 0,
        "Selected": selectedTotal || 0,
        "Pending": pendingTotal || 0,
        "Rejected": rejectedTotal || 0,
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
            innerRadius: "50%",
            dataPoints: [
                { y: status.Selected, label: "Selected" },
                { y: status.Pending, label: "Pending" },
                { y: status.Rejected, label: "Rejected" }
            ]
        }]
    };

    return (
        <Container>
            <Container>
                <Row md={12}>
                    <Col xs={12} sm={12} className='d-flex mt-3'>
                        <h2> Summary Admin Dashboard</h2>
                        <h2 className='ms-auto'>{user.name}</h2>
                    </Col>
                    <Col xs={12} sm={12} className='d-flex mt-3 gap-2'>
                        <Link className='btn btn-primary text-dark fw-bold bg-transparent  ' to="/admindetailedview">
                            Detailed view
                        </Link>
                        <Link className='btn btn-primary text-dark fw-bold bg-transparent  ' to="/work">
                            Detailed view
                        </Link>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row md={12}>
                    <Col>
                        <Row className='mt-4 g-3'>
                            <Row className='gap-2'>
                                <Col xs={12} sm={6} md={5} className='card-style p-4 border' style={{ cursor: 'pointer' }} onClick={() => fetchDetailsByStatus('Total')}>
                                    <p className='fw-bolder'>Total</p>
                                    <p>{status.Total}</p>
                                </Col>
                                <Col xs={12} sm={6} md={5} className='card-style p-4 border' style={{ cursor: 'pointer' }} onClick={() => fetchDetailsByStatus('Rejected')}>
                                    <p className='fw-bolder'>Rejected</p>
                                    <p>{status.Rejected}</p>
                                </Col>
                            </Row>
                            <Row className='gap-2 mt-2'>
                                <Col xs={12} sm={6} md={5} className='card-style border p-4 shadow-lg' style={{ cursor: 'pointer' }} onClick={() => fetchDetailsByStatus('Pending')}>
                                    <p className='fw-bolder'>Pending</p>
                                    <p>{status.Pending}</p>
                                </Col>
                                <Col xs={12} sm={6} md={5} className='card-style border p-4 shadow-lg' style={{ cursor: 'pointer' }} onClick={() => fetchDetailsByStatus('Selected')}>
                                    <p className='fw-bolder'>Selected</p>
                                    <p>{status.Selected}</p>
                                </Col>
                            </Row>
                        </Row>
                    </Col>
                    <Col md={6} sm={12} xs={12} className="d-flex align-items-center justify-content-center mt-4">
                        <div style={{ width: '100%', height: '400px' }}>
                            <CanvasJSChart options={chartOptions} />
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Modal for displaying detailed data */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" className="custom-modal-width mt-5">
                <Modal.Header closeButton>
                    <Modal.Title>{currentStatus} Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
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
                            {modalData.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.market}</td>
                                    <td>{item.referBy}</td>
                                    <td>{item.referredId}</td>
                                    <td>{item.comments}</td>
                                    <td>{item.status}</td>
                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminHome;

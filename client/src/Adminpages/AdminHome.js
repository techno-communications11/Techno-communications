import React, { useState, useEffect } from 'react';
import decodeToken from '../decodedDetails';
import { Spinner, Row } from 'react-bootstrap';

import { Container, Grid, Typography, Button, Modal, Table, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DetailCards from './DetailCards';
import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;


function AdminHome() {
    const user = decodeToken();
    const apiurl = process.env.REACT_APP_API;
    const [profileStats, setProfileStats] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('');
    const [loading, setLoading] = useState(false);
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
        } finally {
            setLoading(false); // Stop loading
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

    const statuses = [

        'moved to Interview',
        'no show at Interview',
        'rejected at Interview',
        'selected at Interview',
        'need second opinion at Interview',
        'no show at Hr',
        'selected at Hr',
        'rejected at Hr',

        'Moved to HR',
    ];
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
        (profileStats[""] || 0);

    const selectedTotal =
        (profileStats["selected at Hr"] || 0) +
        (profileStats["Recommended For Hiring"] || 0) +
        (profileStats["selected at Interview"] || 0);

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
        <Row>
            <Container>
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    {/* <Grid item xs={12} sm={12} container alignItems="center">
                    <Typography variant="h4">Summary Admin Dashboard</Typography>
                    <Typography variant="h6" sx={{ ml: 'auto' }}>{user.name}</Typography>
                </Grid> */}
                    <Grid item xs={12} sm={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* <Button variant="contained" color="primary" component={Link} to="/admindetailedview"> */}
                            <Button variant="contained" color="primary" component={Link} to="/detail">
                                {/* <Button variant="contained" color="primary" component={Link} to="/admindetailedview"> */}
                                Detailed View
                            </Button>
                            <Button variant="contained" color="primary" component={Link} to="/work">
                                Individual Progress
                            </Button>
                            <Button variant="contained" color="primary" component={Link} to="/selectedathr">
                                HIRED APPLICANTS
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Grid container  >
                {loading ? (
                    // Show the spinner when loading
                    <div className="d-flex justify-content-center align-centealign-items-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                        < Grid  > <DetailCards /></Grid>

                        {/* Pie Chart Section */}

                    </>
                )}
            </Grid>



            {/* Modal for displaying detailed data */}
            <Modal open={showModal} onClose={() => setShowModal(false)} maxWidth="lg" fullWidth>
                <Box sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom>{currentStatus} Details</Typography>
                    <Table>
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
                    <Button variant="contained" color="secondary" onClick={() => setShowModal(false)} sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </Row>
    );
}

export default AdminHome;

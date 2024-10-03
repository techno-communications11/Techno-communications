import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Card, Spinner, Modal } from 'react-bootstrap';
import { Button, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import axios from 'axios';
import dayjs from 'dayjs';
import PieChartIcon from '@mui/icons-material/PieChart';
import { CanvasJSChart } from 'canvasjs-react-charts';

const DetailCards = () => {
    const [statusCounts, setStatusCounts] = useState({});
    const [selectedMarket, setSelectedMarket] = useState([]); // Holds multiple markets
    const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
    const [loading, setLoading] = useState(false); // Loading state for both cards and pie chart
    const [isAllSelected, setIsAllSelected] = useState(false); // State to track Select All
    const [showPieModal, setShowPieModal] = useState(false);

    const locations = [
        { id: 4, name: 'ARIZONA' },
        { id: 5, name: 'Bay Area' },
        { id: 6, name: 'COLORADO' },
        { id: 7, name: 'DALLAS' },
        { id: 8, name: 'El Paso' },
        { id: 9, name: 'FLORIDA' },
        { id: 10, name: 'HOUSTON' },
        { id: 11, name: 'LOS ANGELES' },
        { id: 12, name: 'MEMPHIS' },
        { id: 13, name: 'NASHVILLE' },
        { id: 14, name: 'NORTH CAROLINA' },
        { id: 15, name: 'SACRAMENTO' },
        { id: 16, name: 'SAN DIEGO' },
        { id: 17, name: 'SAN FRANCISCO' },
        { id: 18, name: 'SAN JOSE' },
        { id: 19, name: 'SANTA ROSA' },
    ];

    useEffect(() => {
        fetchStatusCounts();
    }, [selectedMarket, dateRange]);

    const fetchStatusCounts = async () => {
        setLoading(true); // Show loading spinner while data is being fetched
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/statuslocation`, {
                params: {
                    market: selectedMarket, // Send multiple markets in the query
                    startDate: dateRange[0].format('YYYY-MM-DD'),
                    endDate: dateRange[1].format('YYYY-MM-DD')
                }
            });
            if (response.status === 200) {
                const { work_locations } = response.data;
                processProfileStats(work_locations);
            } else {
                console.error('Error fetching status counts:', response);
            }
        } catch (error) {
            console.error('API Error:', error.message);
        } finally {
            setLoading(false); // Hide loading spinner once data is fetched
        }
    };

    const processProfileStats = (locations) => {
        const [startDate, endDate] = dateRange;
        const selectedLocationData = locations.filter(loc => selectedMarket.includes(loc.location)); // Filter selected markets

        if (!selectedLocationData || selectedLocationData.length === 0) {
            setStatusCounts({});
            return;
        }

        const profileStats = {};
        selectedLocationData.forEach((location) => {
            location.statuses.forEach(statusEntry => {
                const filteredDates = statusEntry.created_at_dates.filter(date => {
                    const dateObj = dayjs(date);
                    return dateObj.isAfter(dayjs(startDate)) && dateObj.isBefore(dayjs(endDate));
                });

                if (filteredDates.length > 0) {
                    profileStats[statusEntry.status] = (profileStats[statusEntry.status] || 0) + statusEntry.count;
                }
            });
        });

        if (Object.keys(profileStats).length === 0) {
            setStatusCounts({});
            return;
        }

        const pendingTotal =
            (profileStats["pending at Screening"] || 0) +
            (profileStats["moved to Interview"] || 0) +
            (profileStats["put on hold at Interview"] || 0) +
            (profileStats["selected at Interview"] || 0) +
            (profileStats["Sent for Evaluation"] || 0) +
            (profileStats["need second opinion at Interview"] || 0) +
            (profileStats["Applicant will think about It"] || 0) +
            (profileStats["Moved to HR"] || 0) +
            (profileStats["selected at Hr"] || 0);

        const rejectedTotal =
            (profileStats["rejected at Screening"] || 0) +
            (profileStats["no show at Screening"] || 0) +
            (profileStats["Not Interested at screening"] || 0) +
            (profileStats["rejected at Interview"] || 0) +
            (profileStats["no show at Interview"] || 0) +
            (profileStats["no show at Hr"] || 0) +
            (profileStats["rejected at Hr"] || 0);

        const firstRoundPendingTotal =
            (profileStats["pending at Screening"] || 0) +
            (profileStats["moved to Interview"] || 0) +
            (profileStats["put on hold at Interview"] || 0);

        const hrRoundPendingTotal =
            (profileStats["selected at Interview"] || 0) +
            (profileStats["Sent for Evaluation"] || 0) +
            (profileStats["need second opinion at Interview"] || 0) +
            (profileStats["Applicant will think about It"] || 0) +
            (profileStats["Moved to HR"] || 0);

        const pendingAtNITDSTotal =
            (profileStats["selected at Hr"] || 0);

        const ntidCreatedTotal = profileStats["NTID Created"] || 0;

        const finalStatusCounts = {
            "Total": Object.values(profileStats).reduce((acc, val) => acc + val, 0),
            "Rejected": rejectedTotal,
            "Pending": pendingTotal,
            "1st Round - Pending": firstRoundPendingTotal,
            "HR Round - Pending": hrRoundPendingTotal,
            "Pending at NTID": pendingAtNITDSTotal,
            "NTID Created": ntidCreatedTotal,
        };

        setStatusCounts(finalStatusCounts);
    };

    // Handle "Select All" checkbox change
    const handleSelectAllChange = (event) => {
        const { checked } = event.target;
        setIsAllSelected(checked);
        if (checked) {
            // If checked, select all markets
            setSelectedMarket(locations.map(location => location.name));
        } else {
            // If unchecked, deselect all markets
            setSelectedMarket([]);
        }
    };

    const handleLocationChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedMarket(prevSelected => [...prevSelected, value]); // Add market
        } else {
            setSelectedMarket(prevSelected => prevSelected.filter(market => market !== value)); // Remove market
        }
        setIsAllSelected(false); // Uncheck "Select All" when individual changes happen
    };

    const chartOptions = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1",
        title: {
            text: "Status Distribution"
        },
        data: [statusCounts && Object.keys(statusCounts).length > 0 ? {
            type: "pie",
            indexLabel: "{label}: {y}",
            dataPoints: Object.keys(statusCounts).map(status => ({
                label: status,
                y: statusCounts[status] || 0
            }))
        } : null]
    };

    const handleClickPieButton = () => {
        setShowPieModal(true);
    };

    return (
        <>
            {/* Loading Spinner Modal */}
            <Modal show={loading} centered>
                <Modal.Body className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Modal.Body>
            </Modal>

            <Row className="mt-4" style={{ padding: '0 20px' }}>
                <Col md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                            startText="Start Date"
                            endText="End Date"
                            value={dateRange}
                            onChange={(newValue) => setDateRange(newValue)}
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField
                                        {...startProps}
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '10px',
                                            marginBottom: '16px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <TextField
                                        {...endProps}
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '10px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                </>
                            )}
                        />
                    </LocalizationProvider>
                </Col>
                <Col md={2} className="d-flex align-items-center">
                    {/* Pie Chart Button */}
                    <Button
                        variant="contained"
                        startIcon={<PieChartIcon />} // Optional pie chart icon
                        onClick={handleClickPieButton}
                        sx={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            borderRadius: '20px',
                            padding: '10px 20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            },
                        }}
                    >
                        Pie Chart
                    </Button>
                </Col>

                <Row className="mt-1">
                    <Col md={2}>
                        <Form.Group controlId="marketSelector">
                            <div style={{
                                borderRadius: '10px',
                                padding: '15px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                backgroundColor: '#f8f9fa',
                                maxHeight: '350px',
                                overflowY: 'auto',
                                border: '1px solid #ddd'
                            }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Select Markets</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Select All"
                                    checked={isAllSelected}
                                    onChange={handleSelectAllChange}
                                    style={{ marginBottom: '8px', fontWeight: 'bold' }}
                                />
                                {locations.map((location) => (
                                    <Form.Check
                                        key={location.id}
                                        type="checkbox"
                                        label={location.name}
                                        value={location.name}
                                        checked={selectedMarket.includes(location.name)}
                                        onChange={handleLocationChange}
                                        style={{ marginBottom: '8px' }}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={7}>
                        <Row>
                            {Object.keys(statusCounts).length > 0 ? (
                                Object.keys(statusCounts).map((status) => (
                                    <Col key={status} md={4} className="mb-4">
                                        <Card
                                            style={{
                                                height: "140px",
                                                padding: "10px",
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                backgroundColor: '#ffffff',
                                                borderRadius: '15px',
                                                textAlign: 'center',
                                                transition: 'transform 0.3s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <Card.Body>
                                                <Card.Title style={{ fontSize: '1.1rem', color: '#333', fontWeight: 'bold' }}>
                                                    {status}
                                                </Card.Title>
                                                <Card.Text style={{ fontSize: '1.6rem', color: '#007bff', fontWeight: 'bold' }}>
                                                    {statusCounts[status]}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', width: '100%', paddingTop: '50px' }}>
                                    <h4>Select one or more markets to view detailed information</h4>
                                </div>
                            )}
                        </Row>
                    </Col>
                    <Col md={3}>
                        {Object.keys(statusCounts).length > 0 ? (
                            <div style={{ height: '400px' }}>
                                <CanvasJSChart options={chartOptions} />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                                <h4>No Records Found </h4>
                            </div>
                        )}
                    </Col>
                </Row>
            </Row>
        </>
    );
};

export default DetailCards;

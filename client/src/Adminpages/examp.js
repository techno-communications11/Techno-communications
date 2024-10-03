import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Card } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import axios from 'axios';
import dayjs from 'dayjs';
import { CanvasJSChart } from 'canvasjs-react-charts';

const DetailCards = () => {
    const [statusCounts, setStatusCounts] = useState({});
    const [workLocations, setWorkLocations] = useState([]);
    const [createdDates, setCreatedDates] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState('');
    const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/statuslocation`);
            if (response.status === 200) {
                const { work_locations } = response.data;
                processProfileStats(work_locations);
            } else {
                console.error('Error fetching status counts:', response);
            }
        } catch (error) {
            console.error('API Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const processProfileStats = (locations) => {
        const [startDate, endDate] = dateRange;
        const selectedLocationData = locations.find(loc => loc.location === selectedMarket);

        if (!selectedLocationData) {
            setStatusCounts({});
            return;
        }

        const profileStats = {};
        selectedLocationData.statuses.forEach(statusEntry => {
            const filteredDates = statusEntry.created_at_dates.filter(date => {
                const dateObj = dayjs(date);
                return dateObj.isAfter(dayjs(startDate)) && dateObj.isBefore(dayjs(endDate));
            });

            if (filteredDates.length > 0) {
                profileStats[statusEntry.status] = statusEntry.count;
            }
        });

        if (Object.keys(profileStats).length === 0) {
            // No records found
            setStatusCounts({});
            return;
        }

        console.log("profileStats", profileStats);

        // Aggregate statuses based on your table structure
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
            "Selected At HR": pendingAtNITDSTotal,
            "Pending at NTID": pendingAtNITDSTotal,
            "NTID Created": ntidCreatedTotal,
        };

        setStatusCounts(finalStatusCounts);
    };


    const handleLocationChange = (event) => {
        const selectedId = event.target.value;
        setSelectedMarket(selectedId || null);
    };

    // Pie chart options
    const chartOptions = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1",
        title: {
            text: "Profile Status Distribution",
            fontFamily: 'Roboto, sans-serif'
        },
        backgroundColor: "white",
        data: [statusCounts && Object.keys(statusCounts).length > 0 ? {
            type: "pie",
            indexLabel: "{label}: {y}",
            startAngle: -90,
            endAngle: 90,
            innerRadius: "50%",
            dataPoints: Object.keys(statusCounts).map(status => ({
                label: status,
                y: statusCounts[status] || 0
            }))
        } : null]
    };

    return (
        <Row className="mt-4">
            <Col md={2}>
                <Form.Group controlId="marketSelector">
                    <Form.Select
                        value={selectedMarket}
                        onChange={handleLocationChange}
                        style={{
                            borderRadius: '20px',
                            padding: '10px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            borderColor: '#007bff',
                            color: '#007bff',
                            fontWeight: 'bold',
                        }}
                    >
                        <option value="">All Markets</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.name}>
                                {location.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>

            <Col md={5}>
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
                                        borderRadius: '20px',
                                        marginBottom: '16px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    }}
                                />
                                <TextField
                                    {...endProps}
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    }}
                                />
                            </>
                        )}
                    />
                </LocalizationProvider>
            </Col>

            <Row className="mt-4">
                <Col md={8}>
                    <Row>
                        {Object.keys(statusCounts).length > 0 ? (
                            Object.keys(statusCounts).map((status) => (
                                <Col key={status} md={4} className="mb-4">
                                    <Card
                                        style={{
                                            height: "130px",
                                            padding: "10px",
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                            backgroundColor: '#fff',
                                            borderRadius: '15px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Card.Body>
                                            <Card.Title style={{ fontSize: '1.2rem', color: 'black', textTransform: 'capitalize' }}>
                                                {status}
                                            </Card.Title>
                                            <Card.Text style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                                {statusCounts[status] || 0}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', width: '100%', paddingTop: '50px' }}>
                                <h4>No Records Found</h4>
                            </div>
                        )}
                    </Row>
                </Col>
                <Col md={4}>
                    {Object.keys(statusCounts).length > 0 ? (
                        <div style={{ height: '400px' }}>
                            <CanvasJSChart options={chartOptions} />
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                            <h4>No Records Found for Chart</h4>
                        </div>
                    )}
                </Col>
            </Row>
        </Row>
    );
};

export default DetailCards;

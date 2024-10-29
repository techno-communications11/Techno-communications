import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Form, Card, Spinner, Modal } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import axios from 'axios';
import dayjs from 'dayjs';
import { CanvasJSChart } from 'canvasjs-react-charts';
import { MyContext } from '../pages/MyContext';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const DetailCards = () => {
    const [statusCounts, setStatusCounts] = useState({});
    const [selectedMarket, setSelectedMarket] = useState([]); // Holds multiple markets
    const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]); // 7 days default
    const [loading, setLoading] = useState(false);
    const [isAllSelected, setIsAllSelected] = useState(false); // State to track Select All
    const { setCaptureStatus, setCaptureDate, setMarkets } = useContext(MyContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCards, setShowCards] = useState(false); // Tracks if markets are selected and cards should be shown
    const navigate = useNavigate();

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
        { id: 14, name: 'NORTH CAROL' },
        { id: 15, name: 'SACRAMENTO' },
        { id: 16, name: 'SAN DEIGIO' },
        { id: 17, name: 'SAN FRANCISCO' },
        { id: 18, name: 'SAN JOSE' },
        { id: 19, name: 'SANTA ROSA' },
        { id: 21, name: 'relocation' },
        { id: 23, name: 'DirectHiring' },
    ];

    // Debounced market search filtering
    const debouncedSearchQuery = debounce((query) => {
        setSearchQuery(query);
    }, 300);

    const filteredMarkets = locations.filter((market) =>
        market.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (selectedMarket.length > 0) {
            fetchStatusCounts();
        }
    }, [selectedMarket, dateRange]);

    // Fetch data based on selected markets and date range
    const fetchStatusCounts = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API}/getStatusCountsByLocation`;
            const params = {
                market: selectedMarket,
                startDate: dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : null,
                endDate: dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : null,
            };
            console.log("Fetching data with params:", params); // Log the parameters for debugging
            const response = await axios.get(url, { params });
            if (response.status === 200) {
                const details = response.data.status_counts;
                setStatusCounts(deriveProfileStats(details));
            } else {
                console.error('Error fetching profiles:', response);
            }
        } catch (error) {
            console.error('API Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle "Select All" and individual market selections
    const handleSelectAllChange = (event) => {
        const { checked } = event.target;
        setIsAllSelected(checked);
        if (checked) {
            setMarkets(locations.map(location => location.name));
            setSelectedMarket(locations.map((location) => location.name));
            setShowCards(true); // Show cards once a selection is made
        } else {
            setSelectedMarket([]);
            setMarkets([]);
            setShowCards(false); // Hide cards if no market is selected
        }
    };

    const handleLocationChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedMarket((prevSelected) => {
                const updatedMarkets = [...prevSelected, value];
                setMarkets(updatedMarkets); // Update setMarkets here
                setShowCards(true); // Show cards when market is selected
                return updatedMarkets;
            });
        } else {
            setSelectedMarket((prevSelected) => {
                const updatedMarkets = prevSelected.filter((market) => market !== value);
                setMarkets(updatedMarkets); // Update setMarkets here
                if (updatedMarkets.length === 0) setShowCards(false); // Hide cards if no markets selected
                return updatedMarkets;
            });
        }
        setIsAllSelected(false); // Uncheck "Select All" when individual changes happen
    };

    // Flatten and filter the profiles based on the selected markets and date range
    const flattenProfiles = (profiles) => {
        return profiles.flatMap(profile => {
            return profile.applicant_names.map((name, index) => ({
                applicant_name: name,
                applicant_phone: profile.phone[index],
                applicant_email: profile.applicant_emails[index],
                applicant_uuid: profile.applicant_uuids[index],
                work_location_name: profile.work_location_names[index],
                created_at_date: profile.created_at_dates[index],
                status: profile.status
            }));
        }).filter(profile => {
            // Filter by market
            const inMarket = selectedMarket.length > 0
                ? selectedMarket.includes(profile.work_location_name)
                : true;

            // Filter by date range
            const createdDate = dayjs(profile.created_at_date);
            const inDateRange = dateRange[0] && dateRange[1]
                ? createdDate.isAfter(dayjs(dateRange[0]).startOf('day')) && createdDate.isBefore(dayjs(dateRange[1]).endOf('day'))
                : true;

            return inMarket && inDateRange;
        });
    };

    // Derive profile statistics based on the flattened profiles
    const deriveProfileStats = (profiles) => {
        const flattenedProfiles = flattenProfiles(profiles);
        const uniqueProfiles = flattenedProfiles.filter((profile, index, self) =>
            index === self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
        );

        const profileStats = uniqueProfiles.reduce((acc, profile) => {
            acc[profile.status] = (acc[profile.status] || 0) + 1;
            return acc;
        }, {});

        return calculateFinalStatusCounts(profileStats);
    };

    // Calculate the final counts for each status based on the profile statistics
    const calculateFinalStatusCounts = (profileStats) => {
        const pendingTotal =
            (profileStats["pending at Screening"] || 0) +
            (profileStats["moved to Interview"] || 0) +
            (profileStats["put on hold at Interview"] || 0) +
            (profileStats["selected at Interview"] || 0) +
            (profileStats["Sent for Evaluation"] || 0) +
            (profileStats["need second opinion at Interview"] || 0) +
            (profileStats["Applicant will think about It"] || 0) +
            (profileStats["Moved to HR"] || 0) +
            (profileStats["Recommended For Hiring"] || 0) +
            (profileStats["selected at Hr"] || 0) +
            (profileStats["Spanish Evaluation"] || 0) +
            (profileStats["Store Evaluation"] || 0);

        const rejectedTotal =
            (profileStats["rejected at Screening"] || 0) +
            (profileStats["no show at Screening"] || 0) +
            (profileStats["Not Interested at screening"] || 0) +
            (profileStats["rejected at Interview"] || 0) +
            (profileStats["no show at Interview"] || 0) +
            (profileStats["no show at Hr"] || 0) +
            (profileStats["Not Recommended For Hiring"] || 0) +
            (profileStats["backOut"] || 0) +
            (profileStats["rejected at Hr"] || 0);
        const pendingAtScreening = (profileStats["pending at Screening"] || 0);

        const firstRoundPendingTotal =
            (profileStats["moved to Interview"] || 0) +
            (profileStats["put on hold at Interview"] || 0);

        const hrRoundPendingTotal =
            (profileStats["Recommended For Hiring"] || 0) +
            (profileStats["selected at Interview"] || 0) +
            (profileStats["Sent for Evaluation"] || 0) +
            (profileStats["need second opinion at Interview"] || 0) +
            (profileStats["Applicant will think about It"] || 0) +
            (profileStats["Moved to HR"] || 0) +
            (profileStats["Spanish Evaluation"] || 0) +
            (profileStats["Store Evaluation"] || 0);

        const pendingAtNITDSTotal = profileStats["selected at Hr"] || 0;

        const ntidCreatedTotal = profileStats["mark_assigned"] || 0;

        return {
            "Total": Object.values(profileStats).reduce((acc, val) => acc + val, 0),
            "Rejected": rejectedTotal,
            "Pending": pendingTotal,
            "Pending At Screening": pendingAtScreening,
            "1st Round - Pending": firstRoundPendingTotal,
            "HR Round - Pending": hrRoundPendingTotal,
            "Pending at NTID": pendingAtNITDSTotal,
            "NTID Created": ntidCreatedTotal,
        };
    };

    const handleDataView = (status) => {
        setCaptureStatus(status);
        setCaptureDate(dateRange);
        navigate('/statusticketview');
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
                                {filteredMarkets.map((location) => (
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

                    {showCards ? (
                        <Col md={7}>
                            <Row className='mt-3'>
                                {Object.keys(statusCounts).length > 0 ? (
                                    Object.keys(statusCounts).map((status) => (
                                        <Col key={status} md={4} className="mb-4">
                                            <Card onClick={() => handleDataView(status)}
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
                                                    <Card.Title style={{ fontSize: '1.1rem', color: '#E10174', fontWeight: 'bold' }}>
                                                        {status}
                                                    </Card.Title>
                                                    <Card.Text style={{ fontSize: '1.6rem', color: 'Black', fontWeight: 'bold' }}>
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
                    ) : (
                        <Col md={7} style={{ textAlign: 'center', paddingTop: '50px' }}>
                            <h4>Please select one or more markets to see results.</h4>
                        </Col>
                    )}

                    <Col md={3}>
                        {showCards && Object.keys(statusCounts).length > 0 ? (
                            <div style={{ height: '400px' ,}}>
                                <CanvasJSChart
                                    options={{
                                        animationEnabled: true,
                                        exportEnabled: true,
                                        theme: "light1",
                                        title: { text: "Status Distribution",color:"#E10174" },
                                        data: [{
                                            type: "pie",
                                            indexLabel: "{label}: {y}",
                                            dataPoints: Object.keys(statusCounts).map(status => ({
                                                label: status,
                                                y: statusCounts[status] || 0
                                            }))
                                        }]
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                                <h4>No Records Found</h4>
                            </div>
                        )}
                    </Col>
                </Row>
            </Row>
        </>
    );
};

export default DetailCards;

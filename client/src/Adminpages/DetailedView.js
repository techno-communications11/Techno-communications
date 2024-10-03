import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Form, Card, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const DetailedView = () => {
    const [selectedMarket, setSelectedMarket] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // To track current page for pagination
    const profilesPerPage = 6; // Number of profiles to show per page
    const [isFilterApplied, setIsFilterApplied] = useState(false); // To check if filters are applied

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

    let users = [
        "Amman Battala",
        "Alishba Ahmed",
        "Aslam Khan",
        "Arlette Lopez",
        "Abdul Rafay",
        "Yasir Khan",
        "Mahmed Amhed",
        "Roshan Interview",
        "Bilal Interview",
        "EL Paso Market",
        "Amad Khatri",
        "Ali Palsaniya",
        "Aslam Khan",
        "Olinda Rangel",
        "Shafaque Qureshi",
        "Sultan Admin",
        "Shah Noor Butt",
        "Kamaran Mohammed",
        "Rahim Nasir Khan",
        "Syed Danish",
        "Fayaz Chandrani",
        "Mohamad Elayan"
    ];

    useEffect(() => {
        fetchProfiles();
    }, [selectedMarket, selectedCategory, selectedStatus, selectedUser, dateRange]);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API}/Detailstatus`;
            const params = {
                market: selectedMarket,
                category: selectedCategory,
                status: selectedStatus,
                user: selectedUser,
                startDate: dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : null,
                endDate: dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : null,
            };
            const response = await axios.get(url, { params });

            if (response.status === 200) {
                const details = response.data.status_counts;
                console.log("details", details)
                setSelectedProfiles(details || []);
                setIsFilterApplied(
                    selectedMarket || selectedCategory || selectedStatus || selectedUser || (dateRange[0] && dateRange[1])
                );
            } else {
                console.error('Error fetching profiles:', response);
            }
        } catch (error) {
            console.error('API Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationChange = (e) => {
        setSelectedMarket(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleUserChange = (e) => {
        setSelectedUser(e.target.value);
    };

    const handleFilterApply = (status) => {
        setSelectedStatus(status);
    };

    const getStatusOptions = (category) => {
        switch (category) {
            case 'Screening':
                return ['pending at Screening', 'no show at Screening', 'rejected at Screening', 'Not Interested at screening'];
            case 'Interview':
                return ['moved to Interview', 'no show at Interview', 'rejected at Interview', 'selected at Interview'];
            case 'HR':
                return ['no show at Hr', 'Moved to HR', 'selected at Hr', 'rejected at Hr'];
            default:
                return [];
        }
    };

        // Filter selected profiles based on the selected filters and synchronize the attributes
        const filteredProfiles = selectedProfiles.map((status) => {
            const filteredData = {
                applicant_names: [],
                created_at_dates: [],
                work_location_names: [],
                screening_manager_names: [],
                interviewer_names: [],
                hr_names: [],
                joining_dates: [],
                status: status.status
            };

            status.applicant_names.forEach((_, index) => {
                const inMarket = selectedMarket ? status.work_location_names[index] === selectedMarket : true;
                const inUser = selectedUser
                    ? [status.screening_manager_names[index], status.interviewer_names[index], status.hr_names[index]].includes(selectedUser)
                    : true;

                const createdDate = dayjs(status.created_at_dates[index]);
                const inDateRange = dateRange[0] && dateRange[1]
                    ? createdDate.isAfter(dayjs(dateRange[0]).startOf('day')) && createdDate.isBefore(dayjs(dateRange[1]).endOf('day'))
                    : true;

                const filteredByStatus = selectedStatus ? status.status === selectedStatus : true;

                // If all filters pass, add the item to the filtered data
                if (inMarket && inUser && inDateRange && filteredByStatus) {
                    filteredData.applicant_names.push(status.applicant_names[index]);
                    filteredData.created_at_dates.push(status.created_at_dates[index]);
                    filteredData.work_location_names.push(status.work_location_names[index]);
                    filteredData.screening_manager_names.push(status.screening_manager_names[index]);
                    filteredData.interviewer_names.push(status.interviewer_names[index]);
                    filteredData.hr_names.push(status.hr_names[index]);
                    filteredData.joining_dates.push(status.joining_dates[index]);
                }
            });

            return filteredData;
        }).filter(data => data.applicant_names.length > 0);

        // Flatten the filtered profiles into a single array for pagination
        const flattenedProfiles = filteredProfiles.flatMap(status => {
            console.log("@>?", status)
            return status.applicant_names.map((name, index) => ({
                applicant_name: name,
                created_at_date: status.created_at_dates[index],
                work_location_name: status.work_location_names[index],
                screening_manager_name: status.screening_manager_names[index] || 'N/A',
                interviewer_name: status.interviewer_names[index] || 'N/A',
                hr_name: status.hr_names[index] || 'N/A',
                status: status.status,
                joining_date: status.joining_dates[index] && status.joining_dates[index] !== '0000-00-00'
                    ? dayjs(status.joining_dates[index]).format('YYYY-MM-DD')
                    : 'N/A'
            }));
        });

    // Pagination logic: Get current profiles based on currentPage
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = flattenedProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

    // Calculate the total number of pages based on the total number of applicants
    const pageCount = Math.ceil(flattenedProfiles.length / profilesPerPage);

    // Pagination Handler
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    let serialNumber = indexOfFirstProfile + 1; // Initialize serial number based on the page

    return (
        <Box p={3}>
            {/* Filter Controls */}
            <Box display="flex" gap={2} mb={3} sx={{ width: '100%', flexWrap: 'wrap' }}>
                <Form.Group controlId="marketSelector" style={{ flex: 1 }}>
                    <Form.Select value={selectedMarket} onChange={handleLocationChange} style={formStyles}>
                        <option value="">All Markets</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.name}>
                                {location.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Category Selector */}
                <Form.Group controlId="categorySelector" style={{ flex: 1 }}>
                    <Form.Select value={selectedCategory} onChange={handleCategoryChange} style={formStyles}>
                        <option value="">SELECT CATEGORIES</option>
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="HR">HR</option>
                    </Form.Select>
                </Form.Group>

                {/* Status Selector */}
                <Form.Group controlId="statusSelector" style={{ flex: 1 }}>
                    <Form.Select value={selectedStatus} onChange={(e) => handleFilterApply(e.target.value)} style={formStyles}>
                        <option value="">SELECT STATUS</option>
                        {getStatusOptions(selectedCategory).map((status, index) => (
                            <option key={index} value={status}>
                                {status.toUpperCase()}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* User Selector */}
                <Form.Group controlId="userSelector" style={{ flex: 1 }}>
                    <Form.Select value={selectedUser} onChange={handleUserChange} style={formStyles}>
                        <option value="">All Users</option>
                        {users.map((user, i) => (
                            <option key={i} value={user}>
                                {user}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Date Range Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                        startText="Start Date"
                        endText="End Date"
                        value={dateRange}
                        onChange={(newValue) => setDateRange(newValue)}
                        renderInput={(startProps, endProps) => (
                            <>
                                <Form.Group controlId="startDate" style={{ flex: 1 }}>
                                    <Form.Control {...startProps} type="text" style={formStyles} />
                                </Form.Group>
                                <Form.Group controlId="endDate" style={{ flex: 1 }}>
                                    <Form.Control {...endProps} type="text" style={formStyles} />
                                </Form.Group>
                            </>
                        )}
                    />
                </LocalizationProvider>
            </Box>

            {/* Total Count Card */}
            {isFilterApplied && (
                <Box mb={3}>
                    <Col xs={12} md={2} className="mb-3">
                        <Card
                            sx={{
                                backgroundColor: "#196c5d",
                                cursor: 'pointer',
                                height: '100%',
                                boxShadow: 3,
                                borderRadius: 2
                            }}
                        >
                            <Box
                                p={2}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                            >
                                <Typography variant="h4" fontWeight={700}>
                                    {flattenedProfiles.length}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                    Total Profiles
                                </Typography>
                            </Box>
                        </Card>
                    </Col>
                </Box>
            )}

            {/* Table to display filtered profiles */}
            {loading ? (
                <Typography variant="h6">Loading...</Typography>
            ) : (
                isFilterApplied ? (
                    flattenedProfiles.length > 0 ? (
                        <>
                            <TableContainer component={Paper} sx={{ width: '90%', boxShadow: 2, borderRadius: 2, marginLeft: '60px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={headerStyle}>S.No</TableCell>
                                            <TableCell style={headerStyle}>Created At</TableCell>
                                            <TableCell style={headerStyle}>Applicant Name</TableCell>
                                            <TableCell style={headerStyle}>Work Location</TableCell>
                                            <TableCell style={headerStyle}>Screening Manager</TableCell>
                                            <TableCell style={headerStyle}>Interviewer</TableCell>
                                            <TableCell style={headerStyle}>HR Name</TableCell>
                                            <TableCell style={headerStyle}>Status</TableCell>
                                            <TableCell style={headerStyle}>Joining Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentProfiles.map((profile, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{serialNumber++}</TableCell>
                                                <TableCell>{dayjs(profile.created_at_date).format('YYYY-MM-DD')}</TableCell>
                                                <TableCell>{profile.applicant_name}</TableCell>
                                                <TableCell>{profile.work_location_name}</TableCell>
                                                <TableCell>{profile.screening_manager_name}</TableCell>
                                                <TableCell>{profile.interviewer_name}</TableCell>
                                                <TableCell>{profile.hr_name}</TableCell>
                                                <TableCell>{profile.status}</TableCell>
                                                <TableCell>{profile.joining_date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination Component */}
                            <Stack spacing={2} sx={{ marginTop: 3 }}>
                                <Pagination
                                    count={pageCount}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Stack>
                        </>
                    ) : (
                        <Typography variant="h6" color="error">No profiles found For Above Filters</Typography>
                    )
                ) : (
                    <Typography variant="h6" color="textSecondary">Please apply filters to view profiles</Typography>
                )
            )}
        </Box>
    );
};

// Styling for the Form components
const formStyles = {
    borderRadius: '20px',
    padding: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    borderColor: '#007bff',
    color: '#007bff',
    fontWeight: 'bold',
};

// Styling for the Table header
const headerStyle = {
    backgroundColor: '#3f51b5',
    color: '#ffffff',
};

export default DetailedView;

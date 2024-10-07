import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Form, Card, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select from 'react-select'; // Import react-select

const DetailedView = () => {
    const [selectedMarkets, setSelectedMarkets] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 5;
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const locations = [
        { id: 4, name: 'ARIZONA' },
        { id: 5, name: 'Bay Area' },
        // Additional locations...
    ];

    let users = [
        "Amman Battala",
        "Alishba Ahmed",
        "Aslam Khan",
        // Additional users...
    ];

    useEffect(() => {
        setFilteredUsers(users);
        fetchProfiles();
    }, [selectedMarkets, selectedCategory, selectedStatus, selectedUser, dateRange]);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API}/Detailstatus`;
            const params = {
                market: selectedMarkets.map((m) => m.value),
                category: selectedCategory,
                status: selectedStatus,
                user: selectedUser,
                startDate: dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : null,
                endDate: dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : null,
            };
            const response = await axios.get(url, { params });

            if (response.status === 200) {
                const details = response.data.status_counts;
                setSelectedProfiles(details || []);
                setIsFilterApplied(
                    selectedMarkets.length > 0 || selectedCategory || selectedStatus || selectedUser || (dateRange[0] && dateRange[1])
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

    const handleLocationChange = (selectedOptions) => {
        setSelectedMarkets(selectedOptions);
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

    const handleUserSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredUsers = users.filter((user) => user.toLowerCase().includes(searchTerm));
        setFilteredUsers(filteredUsers);
    };

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
            const inMarket = selectedMarkets.length > 0
                ? selectedMarkets.some((market) => status.work_location_names[index] === market.value)
                : true;
            const inUser = selectedUser
                ? [status.screening_manager_names[index], status.interviewer_names[index], status.hr_names[index]].includes(selectedUser)
                : true;

            const createdDate = dayjs(status.created_at_dates[index]);
            const inDateRange = dateRange[0] && dateRange[1]
                ? createdDate.isAfter(dayjs(dateRange[0]).startOf('day')) && createdDate.isBefore(dayjs(dateRange[1]).endOf('day'))
                : true;

            const filteredByStatus = selectedStatus ? status.status === selectedStatus : true;

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

    const flattenedProfiles = filteredProfiles.flatMap(status => {
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

    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = flattenedProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

    const pageCount = Math.ceil(flattenedProfiles.length / profilesPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    let serialNumber = indexOfFirstProfile + 1;

    const profileStats = currentProfiles.reduce((acc, profile) => {
        acc[profile.status] = (acc[profile.status] || 0) + 1;
        return acc;
    }, {});

    const pendingTotal = (profileStats["pending at Screening"] || 0) + (profileStats["moved to Interview"] || 0) + (profileStats["put on hold at Interview"] || 0) + (profileStats["selected at Interview"] || 0) + (profileStats["Sent for Evaluation"] || 0) + (profileStats["need second opinion at Interview"] || 0) + (profileStats["Applicant will think about It"] || 0) + (profileStats["Moved to HR"] || 0) + (profileStats["selected at Hr"] || 0);

    const rejectedTotal = (profileStats["rejected at Screening"] || 0) + (profileStats["no show at Screening"] || 0) + (profileStats["Not Interested at screening"] || 0) + (profileStats["rejected at Interview"] || 0) + (profileStats["no show at Interview"] || 0) + (profileStats["no show at Hr"] || 0) + (profileStats["rejected at Hr"] || 0);

    const firstRoundPendingTotal = (profileStats["pending at Screening"] || 0) + (profileStats["moved to Interview"] || 0) + (profileStats["put on hold at Interview"] || 0);

    const hrRoundPendingTotal = (profileStats["selected at Interview"] || 0) + (profileStats["Sent for Evaluation"] || 0) + (profileStats["need second opinion at Interview"] || 0) + (profileStats["Applicant will think about It"] || 0) + (profileStats["Moved to HR"] || 0);

    const pendingAtNITDSTotal = profileStats["selected at Hr"] || 0;
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

    return (
        <Box p={3}>
            {/* Filter Controls */}
            <Box display="flex" gap={2} mb={3} sx={{ width: '100%', flexWrap: 'wrap' }}>
                {/* Market Selector */}
                <Form.Group controlId="marketSelector" style={{ flex: 2 }}>
                    <Select
                        isMulti
                        value={selectedMarkets}
                        options={locations.map(loc => ({ value: loc.name, label: loc.name }))}
                        onChange={handleLocationChange}
                        placeholder="Select One or More Markets"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                padding: '8px',
                                fontSize: '14px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                borderColor: '#007bff',
                            }),
                            multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: '#007bff',
                                color: 'white',
                                borderRadius: '4px',
                                padding: '2px',
                            }),
                            multiValueLabel: (provided) => ({
                                ...provided,
                                color: 'white',
                            }),
                        }}
                    />
                </Form.Group>

                {/* User Search Bar */}
                <Form.Group controlId="userSearch">
                    <Form.Control
                        type="text"
                        placeholder="Search Users"
                        onChange={handleUserSearch}
                        style={{ width: '200px', marginBottom: '10px' }}
                    />
                </Form.Group>

                {/* User Selector */}
                <Form.Group controlId="userSelector" style={{ flex: 1 }}>
                    <Form.Select value={selectedUser} onChange={handleUserChange}>
                        <option value="" disabled hidden>
                            Select a User
                        </option>
                        <option value="">All Users</option>
                        {filteredUsers.map((user, i) => (
                            <option key={i} value={user}>
                                {user}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>


                {/* Category Selector */}
                <Form.Group controlId="categorySelector" style={{ flex: 1 }}>
                    <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">SELECT CATEGORIES</option>
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="HR">HR</option>
                    </Form.Select>
                </Form.Group>

                {/* Status Selector */}
                <Form.Group controlId="statusSelector" style={{ flex: 1 }}>
                    <Form.Select value={selectedStatus} onChange={(e) => handleFilterApply(e.target.value)}>
                        <option value="">SELECT STATUS</option>
                        {getStatusOptions(selectedCategory).map((status, index) => (
                            <option key={index} value={status}>
                                {status.toUpperCase()}
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
                                    <Form.Control {...startProps} type="text" />
                                </Form.Group>
                                <Form.Group controlId="endDate" style={{ flex: 1 }}>
                                    <Form.Control {...endProps} type="text" />
                                </Form.Group>
                            </>
                        )}
                    />
                </LocalizationProvider>
            </Box>

            {/* Status Cards */}
            <Box display="flex" gap={2} mb={3}>
                {Object.keys(finalStatusCounts).map((status, index) => (
                    <Col xs={12} md={2} key={index} className="mb-3">
                        <Card
                            sx={{
                                backgroundColor: status === 'Total' ? "#196c5d" : "#ffc107",
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
                                    {finalStatusCounts[status]}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                    {status.replace(/-/g, ' ')}
                                </Typography>
                            </Box>
                        </Card>
                    </Col>
                ))}
            </Box>

            {/* Profiles Table */}
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
                                            <TableCell>S.No</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Applicant Name</TableCell>
                                            <TableCell>Work Location</TableCell>
                                            <TableCell>Screening Manager</TableCell>
                                            <TableCell>Interviewer</TableCell>
                                            <TableCell>HR Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Joining Date</TableCell>
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

                            {/* Pagination */}
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

export default DetailedView;

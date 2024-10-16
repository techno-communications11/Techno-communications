import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Form, Card, Col, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select from 'react-select';

const DetailedView = () => {
    const [selectedMarkets, setSelectedMarkets] = useState([]); // Change to handle multiple markets
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]); // Updated to store multiple users

    const [selectedStatus, setSelectedStatus] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cardShow, SetcardShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // To track current page for pagination
    const profilesPerPage = 25; // Number of profiles to show per page
    // const [selectedUser, setSelectedUser] = useState('');
    const [selectedGroupStatus, setSelectedGroupStatus] = useState("");
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
        { id: 21, name: 'RELOCATION' },
    ];

    let users = [
        
        "Alishba Ahmed",
        "ALISHA PADANIYA",
        "Roshan Interview",
        "Roshan Screening",
        "Roshan Shaikh",
        "Bilal Interview",
        "EL Paso Market",
        "Qamar Shahzad",
        "Shafaque Qureshi",
        "Sultan Interview",
        "Shah Noor Butt",
        "Shoaib",
        "Kamaran Mohammed",
    ];

    useEffect(() => {
        fetchProfiles();
    }, [selectedMarkets, selectedCategory, selectedStatus, selectedUsers, dateRange]);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API}/Detailstatus`;
            const params = {
                market: selectedMarkets.map((m) => m.value), // Handle multiple markets
                category: selectedCategory,
                status: selectedStatus,
                users: selectedUsers.map((u) => u.value), // Handle multiple users
                startDate: dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : null,
                endDate: dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : null,
            };
            const response = await axios.get(url, { params });

            if (response.status === 200) {
                const details = response.data.status_counts;
                console.log("details", details);
                setSelectedProfiles(details || []);
                setIsFilterApplied(
                    selectedMarkets.length > 0 || selectedCategory || selectedStatus || selectedUsers || (dateRange[0] && dateRange[1])
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
        setSelectedMarkets(selectedOptions); // Update state with multiple selections
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };


    const handleUserChange = (selectedOptions) => {
        console.log("selectedOptions.length", selectedOptions.length);

        if (selectedOptions.length < 1) {
            SetcardShow(false); // Hide the card if no user is selected
        } else {
            SetcardShow(true);  // Show the card when one or more users are selected
        }

        setSelectedUsers(selectedOptions); // Update state with multiple users
    };


    const handleFilterApply = (status) => {
        // Set the selected group status to show it in the dropdown
        setSelectedGroupStatus(status);

        // Get all individual statuses related to the selected group status
        const relatedStatuses = statusMap[status] || []; // Default to an empty array if no match

        // Set the selected status to the array of related statuses for filtering
        setSelectedStatus(relatedStatuses);
    }


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
    const filteredProfiles = selectedProfiles.map((currentStatus) => {
        // console.log("st...", currentStatus); // Log the current status object

        const filteredData = {
            applicant_names: [],
            created_at_dates: [],
            work_location_names: [],
            screening_manager_names: [],
            interviewer_names: [],
            hr_names: [],
            joining_dates: [],
            status: currentStatus.status, // Store the original status here
        };

        currentStatus.applicant_names.forEach((_, index) => {
            const inMarket = selectedMarkets.length > 0
                ? selectedMarkets.some((market) => currentStatus.work_location_names[index] === market.value)
                : true;

            const inUsers = selectedUsers.length > 0
                ? selectedUsers.some((user) =>
                    [currentStatus.screening_manager_names[index], currentStatus.interviewer_names[index], currentStatus.hr_names[index]].includes(user.value)
                )
                : true;

            const createdDate = dayjs(currentStatus.created_at_dates[index]);
            const inDateRange = dateRange[0] && dateRange[1]
                ? createdDate.isAfter(dayjs(dateRange[0]).startOf('day')) && createdDate.isBefore(dayjs(dateRange[1]).endOf('day'))
                : true;
            const filteredByStatus = selectedStatus.length > 0
                ? selectedStatus.includes(currentStatus.status)
                : true;

            if (inMarket && inUsers && inDateRange && filteredByStatus) {
                filteredData.applicant_names.push(currentStatus.applicant_names[index]);
                filteredData.created_at_dates.push(currentStatus.created_at_dates[index]);
                filteredData.work_location_names.push(currentStatus.work_location_names[index]);
                filteredData.screening_manager_names.push(currentStatus.screening_manager_names[index]);
                filteredData.interviewer_names.push(currentStatus.interviewer_names[index]);
                filteredData.hr_names.push(currentStatus.hr_names[index]);
                filteredData.joining_dates.push(currentStatus.joining_dates[index]);
            }
        });

        return filteredData; // Return the filtered data object
    }).filter(data => data.applicant_names.length > 0); // Filter out empty results


    // console.log("112", filteredProfiles)
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
    // console.log("flattenedProfiles", flattenedProfiles)
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = flattenedProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

    const pageCount = Math.ceil(flattenedProfiles.length / profilesPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    let serialNumber = indexOfFirstProfile + 1;
    const smallerFormStyles = {
        borderRadius: '8px',
        padding: '8px',
        fontSize: '14px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        borderColor: '#007bff',
    };
    console.log("currentProfiles", currentProfiles)
    const profileStats = flattenedProfiles.reduce((acc, profile) => {
        acc[profile.status] = (acc[profile.status] || 0) + 1;
        return acc;
    }, {});

    const pendingTotal = (profileStats["pending at Screening"] || 0) + (profileStats["moved to Interview"] || 0) + (profileStats["put on hold at Interview"] || 0) + (profileStats["selected at Interview"] || 0) + (profileStats["Sent for Evaluation"] || 0) + (profileStats["need second opinion at Interview"] || 0) + (profileStats["Applicant will think about It"] || 0) + (profileStats["Moved to HR"] || 0) + (profileStats["selected at Hr"] || 0);

    const rejectedTotal = (profileStats["rejected at Screening"] || 0) + (profileStats["no show at Screening"] || 0) + (profileStats["Not Interested at screening"] || 0) + (profileStats["rejected at Interview"] || 0) + (profileStats["no show at Interview"] || 0) + (profileStats["no show at Hr"] || 0) + (profileStats["rejected at Hr"] || 0);
    const atscreening = (profileStats["pending at Screening"] || 0);
    const firstRoundPendingTotal = (profileStats["moved to Interview"] || 0) + (profileStats["put on hold at Interview"] || 0);

    const hrRoundPendingTotal = (profileStats["selected at Interview"] || 0) + (profileStats["Sent for Evaluation"] || 0) + (profileStats["need second opinion at Interview"] || 0) + (profileStats["Applicant will think about It"] || 0) + (profileStats["Moved to HR"] || 0);

    const pendingAtNITDSTotal = profileStats["selected at Hr"] || 0;
    const ntidCreatedTotal = profileStats["mark_assigned"] || 0;

    const finalStatusCounts = {
        // "Total": Object.values(profileStats).reduce((acc, val) => acc + val, 0),
        "Rejected": rejectedTotal,
        "Pending": pendingTotal,
        "Pending At Screening": atscreening,
        "1st Round - Pending": firstRoundPendingTotal,
        "HR Round - Pending": hrRoundPendingTotal,
        "Pending at NTID": pendingAtNITDSTotal,
        "NTID Created": ntidCreatedTotal,
    };

    const groupstatus = ["Rejected",
        "Pending",
        "pending at Screening",
        "1st Round - Pending",
        "HR Round - Pending",
        "Pending at NTID",
        "NTID Created",]
    // const userOptions = users.map((user) => ({ value: user, label: user }));
    const statusMap = {
        "Pending": [
            "pending at Screening",
            "moved to Interview",
            "put on hold at Interview",
            "selected at Interview",
            "Sent for Evaluation",
            "need second opinion at Interview",
            "Applicant will think about It",
            "Moved to HR",
            "selected at Hr"
        ],

        "Rejected": [
            "rejected at Screening",
            "no show at Screening",
            "Not Interested at screening",
            "rejected at Interview",
            "no show at Interview",
            "no show at Hr",
            "Not Recommended For Hiring",
            "rejected at Hr"
        ],
        "pending at Screening": [ "pending at Screening",],
        "1st Round - Pending": [
          
            "moved to Interview",
            "put on hold at Interview"
        ],
        "HR Round - Pending": [
            "selected at Interview",
            "Sent for Evaluation",
            "need second opinion at Interview",
            "Applicant will think about It",
            "Moved to HR",
            "Recommended For Hiring"
        ],
        "Pending at NTID": ["selected at Hr"],
        "NTID Created": ["mark_assigned"]
    };

    return (
        <Box p={3}>
            {/* Filter Controls */}
            <Box display="flex" gap={2} mb={3} sx={{ width: '100%', flexWrap: 'wrap' }}>
                {/* Market Selector with extra space */}
                <Form.Group controlId="marketSelector" style={{ flex: 2 }}> {/* Increased flex */}
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

                {/* Category Selector with reduced size */}
                {/* <Form.Group controlId="categorySelector" style={{ flex: 1 }}>
                    <Form.Select value={selectedCategory} onChange={handleCategoryChange} style={smallerFormStyles}>
                        <option value=""> CATEGORIES</option>
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="HR">HR</option>
                    </Form.Select>
                </Form.Group> */}

                {/* Status Selector with reduced size */}

                <Form.Group controlId="statusSelector" style={{ flex: 1 }}>
                    <Form.Select
                        value={selectedGroupStatus}
                        onChange={(e) => handleFilterApply(e.target.value)}
                        style={{ ...smallerFormStyles, height: '52px' }} // Adjust the height here
                    >
                        <option value="">SELECT STATUS</option>
                        {groupstatus.map((status, index) => (
                            <option key={index} value={status}>
                                {status.toUpperCase()}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>


                <Form.Group controlId="userSelector" style={{ flex: 2 }}>
                    <Select
                        isMulti
                        value={selectedUsers}
                        options={users.map(user => ({ value: user, label: user }))} // Assuming 'users' is your user data
                        onChange={handleUserChange}
                        placeholder="Select One or More Users"
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



                {/* Date Range Picker with reduced size */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                        startText="Start Date"
                        endText="End Date"
                        value={dateRange}
                        onChange={(newValue) => setDateRange(newValue)}
                        renderInput={(startProps, endProps) => (
                            <>
                                <Form.Group controlId="startDate" style={{ flex: 1 }}>
                                    <Form.Control {...startProps} type="text" style={smallerFormStyles} />
                                </Form.Group>
                                <Form.Group controlId="endDate" style={{ flex: 1 }}>
                                    <Form.Control {...endProps} type="text" style={smallerFormStyles} />
                                </Form.Group>
                            </>
                        )}
                    />
                </LocalizationProvider>
            </Box>


            {/* Total Count Card */}
            {isFilterApplied && (
                <Row mb={3}>
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
                                height="130px"
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

                    <Col xs={12} md={10} className="mb-3" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px' }}>
                        {cardShow && Object.entries(finalStatusCounts).map(([status, count], index) => (
                            <Card
                                key={index}
                                sx={{
                                    backgroundColor: "#196c5d",
                                    cursor: 'pointer',
                                    width: '200px', // Adjust width as needed
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
                                    height="120px"
                                    width="150px"
                                >
                                    <Typography variant="h4" fontWeight={700}>
                                        {count}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        {status}
                                    </Typography>
                                </Box>
                            </Card>
                        ))}
                    </Col>

                </Row>
            )}

            {/* Table to display filtered profiles */}
            {loading ? (
                <Typography variant="h6">Loading...</Typography>
            ) : (
                isFilterApplied ? (
                    flattenedProfiles.length > 0 ? (
                        <>
                            <TableContainer component={Paper} sx={{ width: '100%', boxShadow: 2, borderRadius: 2 }}>
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
                    ): (
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
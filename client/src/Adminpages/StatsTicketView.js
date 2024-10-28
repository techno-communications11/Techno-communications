import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../pages/MyContext';
import dayjs from 'dayjs';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Pagination from '@mui/material/Pagination';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Stack, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function StatsTicketView() {
    const [selectedProfiles, setSelectedProfiles] = useState(JSON.parse(localStorage.getItem('selectedProfiles')) || []);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 25;

    const myContext = useContext(MyContext);
    const { markets, captureStatus, captureDate } = myContext;

    useEffect(() => {
        const storedMarkets = JSON.parse(localStorage.getItem('markets'));
        const storedCaptureStatus = localStorage.getItem('captureStatus');
        const storedCaptureDate = JSON.parse(localStorage.getItem('captureDate'));

        if (storedMarkets || storedCaptureStatus || storedCaptureDate) {
            fetchProfiles(storedMarkets, storedCaptureStatus, storedCaptureDate);
        } else if (captureStatus || markets || captureDate) {
            fetchProfiles(markets, captureStatus, captureDate);
        }
    }, []);

    useEffect(() => {
        if (markets) localStorage.setItem('markets', JSON.stringify(markets));
        if (captureStatus) localStorage.setItem('captureStatus', captureStatus);
        if (captureDate) localStorage.setItem('captureDate', JSON.stringify(captureDate));
    }, [markets, captureStatus, captureDate]);

    const statusMap = {
        "Total": ["pending at Screening",
            "moved to Interview",
            "put on hold at Interview",
            "selected at Interview",
            "Recommended For Hiring",
            "Sent for Evaluation",
            "need second opinion at Interview",
            "Applicant will think about It",
            "Moved to HR",
            "selected at Hr",
            'Store Evaluation',
            'Spanish Evaluation',
            "rejected at Screening",
            "no show at Screening",
            "Not Interested at screening",
            "rejected at Interview",
            "no show at Interview",
            "no show at Hr",
            "Not Recommended For Hiring",
            "rejected at Hr",
            "backOut",
            "mark_assigned"],
        "Pending": [
            "pending at Screening",
            "moved to Interview",
            "put on hold at Interview",
            "selected at Interview",
            "Recommended For Hiring",
            "Sent for Evaluation",
            "need second opinion at Interview",
            "Applicant will think about It",
            "Moved to HR",
            "selected at Hr",
            'Store Evaluation',
            'Spanish Evaluation',
        ],
        "Rejected": [
            "rejected at Screening",
            "no show at Screening",
            "Not Interested at screening",
            "rejected at Interview",
            "no show at Interview",
            "no show at Hr",
            "Not Recommended For Hiring",
            "backOut",
            "rejected at Hr"
        ],
        "1st Round - Pending": [
            "pending at Screening",
            "moved to Interview",
            "put on hold at Interview"
        ],
        "HR Round - Pending": [
            "selected at Interview",
            "Sent for Evaluation",
            "need second opinion at Interview",
            "Applicant will think about It",
            "Moved to HR",
            "Recommended For Hiring",
            'Store Evaluation',
            'Spanish Evaluation',
        ],
        "Pending at NTID": ["selected at Hr"],
        "NTID Created": ["mark_assigned"]
    };

    const fetchProfiles = async (markets = [], captureStatus = '', captureDate = []) => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API}/Detailstatus`;
            const params = {
                market: markets,
                status: statusMap[captureStatus],
                startDate: captureDate.length > 0 ? dayjs(captureDate[0]).format('YYYY-MM-DD') : null,
                endDate: captureDate.length > 0 ? dayjs(captureDate[1]).format('YYYY-MM-DD') : null,
            };

            const response = await axios.get(url, { params });
            if (response.status === 200) {
                setSelectedProfiles(response.data.status_counts || []);
                localStorage.setItem('selectedProfiles', JSON.stringify(response.data.status_counts || []));
            } else {
                console.error('Error fetching profiles:', response);
            }
        } catch (error) {
            console.error('API Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredProfiles = selectedProfiles.map((currentStatus) => {
        const filteredData = {
            applicant_names: [],
            phone: [],
            applicant_emails: [],
            applicant_referred_by: [],
            applicant_reference_ids: [],
            applicant_uuids: [],
            created_at_dates: [],
            work_location_names: [],
            screening_manager_names: [],
            interviewer_names: [],
            hr_names: [],
            joining_dates: [],
            status: currentStatus.status,
        };

        currentStatus.applicant_names.forEach((_, index) => {
            const inMarket = markets.length > 0
                ? markets.some((market) => currentStatus.work_location_names[index] === market)
                : true;

            const createdDate = dayjs(currentStatus.created_at_dates[index]);
            const inDateRange = captureDate[0] && captureDate[1]
                ? createdDate.isAfter(dayjs(captureDate[0]).startOf('day')) && createdDate.isBefore(dayjs(captureDate[1]).endOf('day'))
                : true;

            const filteredByStatus = statusMap[captureStatus]?.includes(currentStatus.status);

            if (inMarket && inDateRange && filteredByStatus) {
                filteredData.applicant_names.push(currentStatus.applicant_names[index]);
                filteredData.phone.push(currentStatus.phone[index]);
                filteredData.applicant_emails.push(currentStatus.applicant_emails[index]);
                filteredData.applicant_referred_by.push(currentStatus.applicant_referred_by[index]);
                filteredData.applicant_reference_ids.push(currentStatus.applicant_reference_ids[index]);
                filteredData.applicant_uuids.push(currentStatus.applicant_uuids[index]);
                filteredData.created_at_dates.push(currentStatus.created_at_dates[index]);
                filteredData.work_location_names.push(currentStatus.work_location_names[index]);
                filteredData.screening_manager_names.push(currentStatus.screening_manager_names[index]);
                filteredData.interviewer_names.push(currentStatus.interviewer_names[index]);
                filteredData.hr_names.push(currentStatus.hr_names[index]);
                filteredData.joining_dates.push(currentStatus.joining_dates[index]);
            }
        });

        return filteredData;
    }).filter(data => data.applicant_names.length > 0);

    const flattenedProfiles = filteredProfiles.flatMap(status => {
        return status.applicant_names.map((name, index) => ({
            applicant_name: name,
            applicant_phone: status.phone[index],
            applicant_email: status.applicant_emails[index],
            applicant_referred_by: status.applicant_referred_by[index],
            applicant_reference_id: status.applicant_reference_ids[index],
            applicant_uuid: status.applicant_uuids[index],
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

    const uniqueFlattenedProfiles = flattenedProfiles.filter((profile, index, self) =>
        index === self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
    );

    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = uniqueFlattenedProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
    const pageCount = Math.ceil(uniqueFlattenedProfiles.length / profilesPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleDownloadExcel = (profiles) => {
        const worksheetData = profiles.map(profile => ({
            "Created At": dayjs(profile.created_at_date).format('YYYY-MM-DD HH:mm:ss'),
            "Applicant UUID": profile.applicant_uuid,
            "Applicant Name": profile.applicant_name,
            "Phone Number": profile.applicant_phone,
            "Email": profile.applicant_email,
            "Referred_by": profile.applicant_referred_by,
            "Reference ID": profile.applicant_reference_id,
            "Work Location": profile.work_location_name,
            "Screening Manager": profile.screening_manager_name,
            "Interviewer": profile.interviewer_name,
            "HR Name": profile.hr_name,
            "Status": profile.status,
            "Joining Date": profile.joining_date
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
        XLSX.writeFile(workbook, 'Applicants_List.xlsx');
    };

    const headerStyle = {
        backgroundColor: '#3f51b5',
        color: '#ffffff',
    };

    return (
        <div>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                uniqueFlattenedProfiles.length > 0 ? (
                    <>
                        <div className='justify-content-between d-flex m-1'>
                            <h3 style={{ color: "green" }}>Total: {uniqueFlattenedProfiles.length}</h3>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileDownloadIcon />}
                                sx={{
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    borderRadius: '20px',
                                    padding: '10px 20px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    '&:hover': { backgroundColor: '#218838' },
                                }}
                                onClick={() => handleDownloadExcel(uniqueFlattenedProfiles)}
                            >
                                Download Data Excel
                            </Button>
                        </div>

                        <TableContainer component={Paper} sx={{ width: '100%', boxShadow: 2, borderRadius: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={headerStyle}>S.No</TableCell>
                                        <TableCell style={headerStyle}>Created At</TableCell>
                                        <TableCell style={headerStyle}>Applicant Name</TableCell>
                                        <TableCell style={headerStyle}>Referred_by</TableCell>
                                        <TableCell style={headerStyle}>Reference ID</TableCell>
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
                                            <TableCell>{indexOfFirstProfile + index + 1}</TableCell>
                                            <TableCell>{profile.created_at_date || 'N/A'}</TableCell>
                                            <TableCell>{profile.applicant_name || 'N/A'}</TableCell>
                                            <TableCell>{profile.applicant_referred_by || 'N/A'}</TableCell>
                                            <TableCell>{profile.applicant_reference_id || 'N/A'}</TableCell>
                                            <TableCell>{profile.work_location_name || 'N/A'}</TableCell>
                                            <TableCell>{profile.screening_manager_name || 'N/A'}</TableCell>
                                            <TableCell>{profile.interviewer_name || 'N/A'}</TableCell>
                                            <TableCell>{profile.hr_name || 'N/A'}</TableCell>
                                            <TableCell>{profile.status || 'N/A'}</TableCell>
                                            <TableCell>{profile.joining_date || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

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
                    <Typography variant="h6" color="error">No profiles found for the selected filters</Typography>
                )
            )}
        </div>
    );
}

export default StatsTicketView;

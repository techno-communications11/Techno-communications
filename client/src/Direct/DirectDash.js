import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, Typography, Grid ,Container} from '@mui/material'; // Use Grid instead of Col
import dayjs from 'dayjs';
import { useContext } from 'react';
import { MyContext } from '../pages/MyContext';
import Loader from '../utils/Loader';

export const DirectDash = () => {
    const {userData}=useContext(MyContext);
    const selectedUser = userData.name ; // Get the user name from token or fallback
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API}/Detailstatus`;
            const response = await axios.get(url,{withCredentials:true});
            if (response.status === 200) {
                const details = response.data.status_counts;
                setSelectedProfiles(details || []);
            } else {
                console.error('Error fetching profiles:', response);
            }
        } catch (error) {
            console.error('API Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredProfiles = selectedProfiles.map(profile => {
        const filteredData = {
            applicant_names: [],
            phone: [],
            applicant_emails: [],
            applicant_uuids: [],
            created_at_dates: [],
            work_location_names: [],
            screening_manager_names: [],
            interviewer_names: [],
            hr_names: [],
            joining_dates: [],
            status: profile.status,
        };

        profile.applicant_names.forEach((_, index) => {
            const userInScreening = profile.screening_manager_names[index] === selectedUser;
            const userInInterview = profile.interviewer_names[index] === selectedUser;
            const userInHR = profile.hr_names[index] === selectedUser;

            if (userInScreening || userInInterview || userInHR) {
                filteredData.applicant_names.push(profile.applicant_names[index]);
                filteredData.phone.push(profile.phone[index]);
                filteredData.applicant_emails.push(profile.applicant_emails[index]);
                filteredData.applicant_uuids.push(profile.applicant_uuids[index]);
                filteredData.created_at_dates.push(profile.created_at_dates[index]);
                filteredData.work_location_names.push(profile.work_location_names[index]);
                filteredData.screening_manager_names.push(profile.screening_manager_names[index] || 'N/A');
                filteredData.interviewer_names.push(profile.interviewer_names[index] || 'N/A');
                filteredData.hr_names.push(profile.hr_names[index] || 'N/A');
                filteredData.joining_dates.push(
                    profile.joining_dates[index] && profile.joining_dates[index] !== '0000-00-00'
                        ? dayjs(profile.joining_dates[index]).format('YYYY-MM-DD')
                        : 'N/A'
                );
            }
        });

        return filteredData;
    }).filter(data => data.applicant_names.length > 0);

    const flattenedProfiles = filteredProfiles.flatMap(status => {
        return status.applicant_names.map((name, index) => ({
            applicant_name: name,
            applicant_phone: status.phone[index],
            applicant_email: status.applicant_emails[index],
            applicant_uuid: status.applicant_uuids[index],
            created_at_date: status.created_at_dates[index],
            work_location_name: status.work_location_names[index],
            screening_manager_name: status.screening_manager_names[index] || 'N/A',
            interviewer_name: status.interviewer_names[index] || 'N/A',
            hr_name: status.hr_names[index] || 'N/A',
            status: status.status,
            joining_date: status.joining_dates[index]
        }));
    });

    const uniqueFlattenedProfiles = flattenedProfiles.filter((profile, index, self) =>
        index === self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
    );

    const profileStats = uniqueFlattenedProfiles.reduce((acc, profile) => {
        acc[profile.status] = (acc[profile.status] || 0) + 1;
        return acc;
    }, {});

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
        (profileStats["rejected at Hr"] || 0);

    const atscreening = (profileStats["pending at Screening"] || 0);

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

    const pendingAtNITDSTotal = (profileStats["selected at Hr"] || 0);
    const ntidCreatedTotal = profileStats["mark_assigned"] || 0;

    const finalStatusCounts = {
        "Total": Object.values(profileStats).reduce((acc, val) => acc + val, 0),
        "Rejected": rejectedTotal,
        "Pending": pendingTotal,
        "Pending At Screening": atscreening,
        "1st Round - Pending": firstRoundPendingTotal,
        "HR Round - Pending": hrRoundPendingTotal,
        "Pending at NTID": pendingAtNITDSTotal,
        "NTID Created": ntidCreatedTotal,
    };

    const statusColors = {
        "Rejected": "#ff4c4c",  // Red
        "Pending": "#f39c12",  // Orange
        "Pending At Screening": "#3498db",  // Blue
        "1st Round - Pending": "#9b59b6",  // Purple
        "HR Round - Pending": "#2ecc71",  // Green
        "Pending at NTID": "#1abc9c",  // Teal
        "NTID Created": "#e74c3c",  // Another red for created status
        "Total": "#34495e",  // Dark Blue for Total
    };
 if(loading){
    return(
        <Loader/>
    )
 }
    return (
        <Container>
        <Grid container spacing={2} className='mt-4'>
            {Object.entries(finalStatusCounts).map(([status, count], index) => (
                <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
                    <Card
                        className="shadow-sm h-100"
                        style={{
                            backgroundColor: statusColors[status] || '#95a5a6',  // Fallback color if status is not mapped
                            cursor: 'pointer',
                            color: 'white',
                            borderRadius: '12px', // Rounded corners for a sleek look
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Subtle shadow for depth
                            transition: 'transform 0.2s',  // Smooth scaling on hover
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Hover scale effect
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.00)'} // Reset on leave
                    >
                        <Box p={2} display="flex" flexDirection="column" justifyContent="center" height="100px">
                            <Typography variant="h5" fontWeight={700} textAlign="center">
                                {count}
                            </Typography>
                            <Typography variant="subtitle2" textAlign="center" sx={{ textTransform: 'capitalize' }}>
                                {status}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
        </Container>
    );
};

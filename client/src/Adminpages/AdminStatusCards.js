// import React, { useState, useEffect } from 'react';
// import { Row, Col, Modal } from 'react-bootstrap'; // Add Spinner here
// import { Card, Typography, Box, Table, Paper, Avatar } from '@mui/material';
// import { TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
// import statuses from '../Constants/Status'
// import axios from 'axios';

// import './ModalStyles.css';
// import dayjs from 'dayjs';
// import Loader from '../utils/Loader';


// const statusColors = {
//   screening: "#2e8bc0",
//   interview: "#f6a21e",
//   hired: "#90ee90",
//   hr: "#65a765",
//   evaluation: "#FFA500",
//   default: "#32CD32"
// };


// const AdminStatusCards = ({ selectedLocationId, dateRange }) => {
//   const [selectedProfiles, setSelectedProfiles] = useState([]);
//   const [statusCounts, setStatusCounts] = useState([]);
//   const [loading, setLoading] = useState(false); // Used for showing the loading spinner

 

 

//   const getStatusColor = (status) => {
//     const lowerStatus = status.toLowerCase();
//     if (lowerStatus.includes('hr') && lowerStatus.includes('selected')) return statusColors.hired;
//     if (lowerStatus.includes('hr')) return statusColors.hr;
//     if (lowerStatus.includes('screening')) return statusColors.screening;
//     if (lowerStatus.includes('interview')) return statusColors.interview;
//     if (lowerStatus.includes('evaluation') || lowerStatus.includes('second opinion')) return statusColors.evaluation;
//     return statusColors.default;
//   };

//   // Fetch status counts based on location
//   const fetchStatusCountsByLocation = async (locationId) => {
//     setLoading(true); // Start loading
//     try {
//       const url = locationId
//         ? `${process.env.REACT_APP_API}/getStatusCountsByLocation/${locationId}`
//         : `${process.env.REACT_APP_API}/statuss`;

//       const response = await axios.get(url,{withCredentials:true});
//       if (response.status === 200) {
//         const finalData = response.data.status_counts;
//         setStatusCounts(finalData || []);
//       } else {
//         console.error('Error fetching status counts:', response);
//       }
//     } catch (error) {
//       console.error('API Error:', error.message);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   useEffect(() => {
//     fetchStatusCountsByLocation(selectedLocationId);
//   }, [selectedLocationId]);

//   const isWithinDateRange = (date) => {
//     if (!dateRange[0] || !dateRange[1]) return true;
//     const profileDate = dayjs(date);
//     return profileDate.isAfter(dayjs(dateRange[0])) && profileDate.isBefore(dayjs(dateRange[1]));
//   };

//   const filterProfilesByStatusLocationAndDate = (status) => {
//     const filteredProfiles = statusCounts.filter(profile => profile.status === status);
//     return filteredProfiles.map(profile => ({
//       ...profile,
//       work_location_ids: profile.work_location_ids.filter(loc => loc === selectedLocationId),
//       applicant_names: profile.applicant_names.filter((_, i) => isWithinDateRange(profile.created_at_dates[i])),
//       applicant_emails: profile.applicant_emails.filter((_, i) => isWithinDateRange(profile.created_at_dates[i])),
//       applicant_phones: profile.applicant_phones.filter((_, i) => isWithinDateRange(profile.created_at_dates[i])),
//       applicant_referred_by: profile.applicant_referred_by.filter((_, i) => isWithinDateRange(profile.created_at_dates[i])),
//       applicant_sourced_by: profile.applicant_sourced_by.filter((_, i) => isWithinDateRange(profile.created_at_dates[i])),
//       count: profile.applicant_names.filter((_, i) => isWithinDateRange(profile.created_at_dates[i])).length,
//     }));
//   };

//   const getStatusCount = (status) => {
//     const filteredProfiles = filterProfilesByStatusLocationAndDate(status);
//     return filteredProfiles.reduce((acc, profile) => acc + profile.count, 0);
//   };

//   const getTotalCount = () => {
//     return statuses.reduce((acc, status) => acc + getStatusCount(status), 0);
//   };

//   const handleCardSelect = (status) => {
//     const profilesForStatus = filterProfilesByStatusLocationAndDate(status);

//     const applicants = profilesForStatus.flatMap(profile => {
//       return profile.applicant_names.map((_, index) => ({
//         name: profile.applicant_names[index],
//         email: profile.applicant_emails[index],
//         phone: profile.applicant_phones[index],
//         referredBy: profile.applicant_referred_by[index],
//         sourcedBy: profile.applicant_sourced_by[index],
//       }));
//     });

//     setSelectedProfiles(applicants);
//   };

//   return (
//     <>
//       {/* Total Applicants Count Card */}
//       <Row className="mb-4 mt-2">
//         <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
//           Total Applicants for Selected Location and Date Range
//         </Typography>
//         <Row>
//           <Col xs={12} md={2} className="mb-3">
//             <Card
//               sx={{
//                 backgroundColor: '#D3D3D3',
//                 cursor: 'pointer',
//                 height: '100%',
//                 boxShadow: 3,
//                 borderRadius: 2
//               }}
//               onClick={() => handleCardSelect('total')}
//             >
//               <Box
//                 p={2}
//                 display="flex"
//                 flexDirection="column"
//                 alignItems="center"
//                 justifyContent="center"
//                 height="100%"
//               >
//                 <Typography variant="h4" fontWeight={700}>
//                   {getTotalCount()}
//                 </Typography>
//                 <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
//                   Total for Selected Location
//                 </Typography>
//               </Box>
//             </Card>
//           </Col>
//         </Row>
//       </Row>

//       {/* Status Overview Cards */}
//       <Row className="mb-4 mt-2">
//         {statuses.map((status, index) => {
//           const count = getStatusCount(status);
//           return (
//             <Col key={index} xs={12} md={2} className="mb-3">
//               <Card
//                 sx={{
//                   backgroundColor: getStatusColor(status),
//                   cursor: 'pointer',
//                   height: '100%',
//                   boxShadow: 3,
//                   borderRadius: 2
//                 }}
//                 onClick={() => handleCardSelect(status)}
//               >
//                 <Box
//                   p={2}
//                   display="flex"
//                   flexDirection="column"
//                   alignItems="center"
//                   justifyContent="center"
//                   height="100%"
//                 >
//                   <Typography variant="h4" fontWeight={700}>
//                     {count}
//                   </Typography>
//                   <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
//                     {status}
//                   </Typography>
//                 </Box>
//               </Card>
//             </Col>
//           );
//         })}
//       </Row>

//       {/* Modal for Profile Details */}
//       <Modal show={selectedProfiles.length > 0 || loading} onHide={() => setSelectedProfiles([])} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Profile Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {loading ? (
//            <Loader/>
//           ) : (
//             selectedProfiles.length > 0 && (
//               <TableContainer component={Paper} style={{ width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: 8 }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>

//                       {["UserName & Details", "Referred By", "Sourced By"].map((header, index) => (
//                         <TableCell key={index} style={{ backgroundColor: '#3f51b5', color: '#ffffff', fontWeight: 'bold' }}>
//                           {header}
//                         </TableCell>
//                       ))}

                    
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {selectedProfiles.map((applicant, idx) => (
//                       <TableRow key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
//                         <TableCell>
//                           <Box display="flex" alignItems="center">
//                             <Avatar alt={applicant.name} sx={{ backgroundColor: '#3f51b5' }} />
//                             <Box ml={2}>
//                               <Typography variant="body1" style={{ fontWeight: 'bold' }}>{applicant.name}</Typography>
//                               <Typography variant="body2" color="textSecondary">{applicant.email}</Typography>
//                               <Typography variant="body1" color="textSecondary">{applicant.phone || "N/A"}</Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>
//                         <TableCell>{applicant.referredBy || "N/A"}</TableCell>
//                         <TableCell>{applicant.sourcedBy || "N/A"}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )
//           )}
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default AdminStatusCards;

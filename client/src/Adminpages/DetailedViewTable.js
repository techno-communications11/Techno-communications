// import React from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
// import dayjs from 'dayjs';
// import TableHead from '../utils/TableHead';

// function DetailedViewTable({ currentProfiles, serialNumber }) {
//   const tableHeaders=[
//     "SI.No", "Created At", "Applicant Name", "Work Location", "Screening Manager", "Interviewer", "HR Name", "Status", "Joining Date"
//   ];
//   return (
//     <TableContainer 
//       component={Paper} 
//       sx={{ 
//         maxHeight: '550px',  // Adjust height as per your requirement
//         width: '100%', 
//         boxShadow: 2, 
//         borderRadius: 1,
//         overflowY: 'auto', // Enable vertical scroll
//         marginTop: '80px', // Push below navbar height if needed (adjust the value as per navbar height)
//         position: 'relative',
//       }}
//     >
//       <Table stickyHeader> {/* Sticky header to keep the table head fixed */}
//         <TableHead headData={tableHeaders}/>
//         <TableBody>
//           {currentProfiles.slice(0, 100).map((profile, index) => (  // Displaying up to 100 rows initially
//             <TableRow key={index}>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }}>{serialNumber++}</TableCell>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }}>{dayjs(profile.created_at_date).format('YYYY-MM-DD')}</TableCell>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }}>{profile.applicant_name}</TableCell>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }} className='text-capitalize'>{profile.work_location_name?.toLowerCase()}</TableCell>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }}>{profile.screening_manager_name}</TableCell>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }}>{profile.interviewer_name}</TableCell>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }}>{profile.hr_name}</TableCell>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }}>{profile.status}</TableCell>
//               <TableCell sx={{ paddingTop: 0.3, paddingBottom: 0 }}>{profile.joining_date}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }



// export default DetailedViewTable;

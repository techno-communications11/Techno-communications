import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
   Checkbox, Avatar, Typography, Box, TextField, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Fake data
const fakeData = [
  // Your fake data here
  {
    fullName: "Rajesh Sharma",
    email: "rajesh.sharma@example.com",
    phoneNumber: "+91-9876543210",
    marketHiring: "Arizona",
    marketTraining: "Completed",
    joiningDate: "2024-10-15",
    ntidCreated: false,
    ntidCreatedDate: "",
    ntid: "",
    username: "rajesh_s",
    avatarColor: "#3f51b5", // Custom color for Avatar
  },
  {
    fullName: "Priya Patel",
    email: "priya.patel@example.com",
    phoneNumber: "+91-8765432109",
    marketHiring: "Bay Area",
    marketTraining: "",
    joiningDate: "2024-11-01",
    ntidCreated: false,
    ntidCreatedDate: "",
    ntid: "",
    username: "priya_p",
    avatarColor: "#e91e63", // Custom color for Avatar
  },
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1-415-555-1234",
    marketHiring: "Los Angeles",
    marketTraining: "In Progress",
    joiningDate: "2024-11-01",
    ntidCreated: false,

    ntid: "",
    username: "john_d",
    avatarColor: "#4caf50", // Custom color for Avatar
  },
  {
    fullName: "Emily Johnson",
    email: "emily.johnson@example.com",
    phoneNumber: "+1-310-555-9876",
    marketHiring: "San Francisco",
    marketTraining: "Completed",
    joiningDate: "2024-10-25",
    ntidCreated: false,
    ntidCreatedDate: "",
    ntid: "",
    username: "emily_j",
    avatarColor: "#ff9800", // Custom color for Avatar
  },
  {
    fullName: "Rajesh Sharma",
    email: "rajesh.sharma@example.com",
    phoneNumber: "+91-9876543210",
    marketHiring: "Arizona",
    marketTraining: "Completed",
    joiningDate: "2024-10-15",
    ntidCreated: false,
    ntidCreatedDate: "",
    ntid: "",
    username: "rajesh_s",
    avatarColor: "#3f51b5", // Custom color for Avatar
  },
  {
    fullName: "Priya Patel",
    email: "priya.patel@example.com",
    phoneNumber: "+91-8765432109",
    marketHiring: "Bay Area",
    marketTraining: "",
    joiningDate: "2024-11-01",
    ntidCreated: false,
    ntidCreatedDate: "",
    ntid: "",
    username: "priya_p",
    avatarColor: "#e91e63", // Custom color for Avatar
  },
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1-415-555-1234",
    marketHiring: "Los Angeles",
    marketTraining: "In Progress",
    joiningDate: "2024-09-20",
    ntidCreated: false,

    ntid: "",
    username: "john_d",
    avatarColor: "#4caf50", // Custom color for Avatar
  },
  {
    fullName: "Emily Johnson",
    email: "emily.johnson@example.com",
    phoneNumber: "+1-310-555-9876",
    marketHiring: "San Francisco",
    marketTraining: "Completed",
    joiningDate: "2024-10-25",
    ntidCreated: false,
    ntidCreatedDate: "",
    ntid: "",
    username: "emily_j",
    avatarColor: "#ff9800", // Custom color for Avatar
  },
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1-415-555-1234",
    marketHiring: "Los Angeles",
    marketTraining: "In Progress",
    joiningDate: "2024-09-20",
    ntidCreated: false,

    ntid: "",
    username: "john_d",
    avatarColor: "#4caf50", // Custom color for Avatar
  }, {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1-415-555-1234",
    marketHiring: "Los Angeles",
    marketTraining: "In Progress",
    joiningDate: "2024-09-20",
    ntidCreated: false,

    ntid: "",
    username: "john_d",
    avatarColor: "#4caf50", // Custom color for Avatar
  },
];

function SelectedAtHr() {


  const [data, setData] = useState(fakeData);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };



  const [clickedIndexes, setClickedIndexes] = useState(new Set());

  const handleIconClick = (index) => {
    const newClickedIndexes = new Set(clickedIndexes);
    if (newClickedIndexes.has(index)) {
      newClickedIndexes.delete(index);
    } else {
      newClickedIndexes.add(index);
    }
    setClickedIndexes(newClickedIndexes);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TableContainer component={Paper} style={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>UserName & Details</TableCell>
              {/* <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Phone Number</TableCell> */}
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Market Hiring For</TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}> Tratining At</TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Date of Joining</TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID Created</TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID Created Date</TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID</TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Added to Schedule</TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Mark As Assigned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar alt={row.fullName} sx={{ backgroundColor: row.avatarColor }} />
                    <Box ml={2}>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>{row.username}</Typography>
                      <Typography variant="body2" color="textSecondary">{row.email}</Typography>
                      <Typography variant="body2" color="textSecondary">A1B2C3D4</Typography>
                      <Typography variant="body2"></Typography>
                      <Typography variant="body2" color="textSecondary">+123-569-999-000</Typography>
                    </Box>  
                  </Box>
                </TableCell>
                {/* <TableCell>{row.phoneNumber}</TableCell> */}
                <TableCell>{row.marketHiring}</TableCell>
                <TableCell>{row.marketTraining || "N/A"}</TableCell>
                <TableCell>{row.joiningDate}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.ntidCreated}
                    onChange={(e) => handleInputChange(index, 'ntidCreated', e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  {row.ntidCreated ? (
                    <DesktopDatePicker
                      value={row.ntidCreatedDate}
                      onChange={(date) => handleInputChange(index, 'ntidCreatedDate', date)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  ) : (
                    <TextField
                      value={row.ntidCreatedDate}
                      onChange={(e) => handleInputChange(index, 'ntidCreatedDate', e.target.value)}
                      placeholder="NTID Created Date"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.ntid}
                    onChange={(e) => handleInputChange(index, 'ntid', e.target.value)}
                    placeholder="NTID"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.addedToSchedule}
                    onChange={(e) => handleInputChange(index, 'addedToSchedule', e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleIconClick(index)}
                    style={{ color: clickedIndexes.has(index) ? 'green' : 'gray' }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </LocalizationProvider>
  );
}

export default SelectedAtHr;

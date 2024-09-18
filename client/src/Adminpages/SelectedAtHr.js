import React, { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  Typography,
  Box,
  TextField
} from '@mui/material';

// Fake data
const fakeData = [
  {
    fullName: "Rajesh Sharma",
    email: "rajesh.sharma@example.com",
    phoneNumber: "+91-9876543210",
    marketHiring: "Arizona",
    marketTraining: "Completed",
    joiningDate: "2024-10-15",
    ntidCreated: true,
    ntidCreatedDate: "2024-09-12",
    ntid: "NTID1234",
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
    ntid: "NTID5678",
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
    ntidCreated: true,
    ntidCreatedDate: "2024-09-05",
    ntid: "NTID91011",
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
    ntid: "NTID121314",
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
    ntidCreated: true,
    ntidCreatedDate: "2024-09-12",
    ntid: "NTID1234",
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
    ntid: "NTID5678",
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
    ntidCreated: true,
    ntidCreatedDate: "2024-09-05",
    ntid: "NTID91011",
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
    ntid: "NTID121314",
    username: "emily_j",
    avatarColor: "#ff9800", // Custom color for Avatar
  }
  // Add more data if needed
];


function SelectedAtHr() {
  const [data, setData] = useState(fakeData);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };
  return (
    <TableContainer component={Paper} style={{ width: '100%' }}>
      <Table style={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Username & Avatar</TableCell>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Phone Number</TableCell>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Market Hiring For</TableCell>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Market Training</TableCell>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Date of Joining</TableCell>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID Created</TableCell>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID Created Date</TableCell>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID</TableCell>
            <TableCell sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Added to Schedule</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {fakeData.map((row, index) => (
            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar alt={row.fullName} src={row.avatar} sx={{ backgroundColor: row.avatarColor }} />
                  <Box ml={2}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      {row.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {row.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{row.phoneNumber}</TableCell>
              <TableCell>{row.marketHiring}</TableCell>
              <TableCell>{row.marketTraining || "N/A"}</TableCell>
              <TableCell>{row.joiningDate}</TableCell>
            {/* Editable input fields */}
            <TableCell>
                <Checkbox
                  checked={row.ntidCreated}
                  onChange={(e) => handleInputChange(index, 'ntidCreated', e.target.checked)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={row.ntidCreatedDate}
                  onChange={(e) => handleInputChange(index, 'ntidCreatedDate', e.target.value)}
                  placeholder="NTID Created Date"
                  variant="outlined"
                  size="small"
                />
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
                  checked={row.ntidCreated}
                  onChange={(e) => handleInputChange(index, 'ntidCreated', e.target.checked)}
                />
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SelectedAtHr;

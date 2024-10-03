import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
function IndividualPerformance() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [count, setCount] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]); // Start date and end date
  const apiurl = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiurl}/getAllUsers`);
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [apiurl]);

  const handleFilter = async () => {
    try {
      const startDate = dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : '';
      const endDate = dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : '';
      console.log(`Selected User ID: ${selectedUserId}, Start Date: ${startDate}, End Date: ${endDate}`);

      const response = await axios.get(`${apiurl}/tracking/${startDate}/${endDate}/${selectedUserId}`);
      setPerformanceData(response.data.data);
      setCount(response.data.count);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Container>
      <Typography variant="h4" gutterBottom className='m-4' style={{ color: "GrayText" }}>
        Individual Performance
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={3} alignItems="center" mb={3}>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Select User"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="">Select a user</MenuItem>
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startText="Start Date"
              endText="End Date"
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} fullWidth />
                  <TextField {...endProps} fullWidth sx={{ mt: 2 }} />
                </>
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            fullWidth
            onClick={handleFilter}
            disabled={!selectedUserId || !dateRange[0] || !dateRange[1]} // Disable if user or dates are not selected
          >
            Filter
          </Button>
        </Grid>
      </Grid>

      {/* Display Count */}
      <Typography variant="h6" gutterBottom>
        Total Results: {count}
      </Typography>

      {/* Display Data in Table */}
      {performanceData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold',color:"green" }}>Applicant UUID</TableCell>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold',color:"#f1720d" }}>Referral Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performanceData.map((item, index) => (
                <TableRow key={index} style={{ backgroundColor: index % 2 ? '#f9f9f9' : '#ffffff' }}>
                  <TableCell>{item.applicant_uuid}</TableCell>
                  <TableCell>{item.referral_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No data available for the selected filters.</Typography>
      )}
    </Container>
    </LocalizationProvider>
  );
}

export default IndividualPerformance;


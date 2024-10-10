import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
  Avatar, Typography, Box, TextField, IconButton, Card
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays } from 'date-fns';

function SelectedAtHr() {
  const apiurl = process.env.REACT_APP_API;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState(new Set());

  // Filters
  const [marketFilter, setMarketFilter] = useState('');
  const [joiningDateFilter, setJoiningDateFilter] = useState([null, null]);

  useEffect(() => {
    const fetchApplicantsData = async () => {
      try {
        const response = await axios.get(`${apiurl}/applicants/selected-at-hr`);
        if (response.status === 200) {
          setData(response.data.data);
          setFilteredData(response.data.data);
        } else {
          toast.error('Error fetching applicants data');
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        toast.error('Error fetching applicants');
      }
    };

    fetchApplicantsData();
  }, []);

  useEffect(() => {
    let updatedData = [...data];
  
    if (marketFilter) {
      updatedData = updatedData.filter(row => row.MarketHiringFor?.toLowerCase() === marketFilter.toLowerCase());
    }
  
    const [startDate, endDate] = joiningDateFilter;
    if (startDate && endDate) {
      updatedData = updatedData.filter(row => {
        const joiningDate = new Date(row.DateOfJoining);
        return joiningDate >= startDate && joiningDate <= endDate;
      });
    }
  
    setFilteredData(updatedData);
  }, [marketFilter, joiningDateFilter, data]);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const isValidRow = (row) => {
    return row.ntidCreated && row.ntidCreatedDate && row.ntid && row.addedToSchedule;
  };

  const handleIconClick = async (index) => {
    const newClickedIndexes = new Set(clickedIndexes);

    if (newClickedIndexes.has(index)) {
      newClickedIndexes.delete(index);
    } else {
      const rowData = filteredData[index];

      if (isValidRow(rowData)) {
        newClickedIndexes.add(index);
        const { ntidCreated, ntidCreatedDate, ntid, addedToSchedule, applicant_uuid } = rowData;

        const dataToSend = {
          ntidCreated,
          ntidCreatedDate,
          ntid,
          addedToSchedule,
          markAsAssigned: true,
          applicant_uuid
        };

        try {
          const response = await axios.post(`${apiurl}/ntids`, dataToSend);
          if (response.status === 201) {
            toast.success('NTID entry created successfully!');
            setClickedIndexes(newClickedIndexes);
            setTimeout(() => {
              window.location.reload();
            }, 1800);
          }
        } catch (error) {
          console.error('API error:', error);
          toast.error('Error creating NTID entry: ' + error.message);
        }
      } else {
        toast.error('Please fill all required fields before submitting!');
      }
    }

    setClickedIndexes(newClickedIndexes);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Filters */}
      <Box display="flex" justifyContent="space-around" mb={3} className="mt-4">
        <Form.Group variant="outlined" size="small" style={{ minWidth: 220 }}>
          <Form.Select 
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
            style={{
              borderRadius: '20px',
              padding: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              borderColor: '#007bff',
              color: '#007bff',
              fontWeight: 'bold',
              minWidth: 220
            }}
          >
            <option value="">All Markets</option>
            {data
              .map(row => row.MarketHiringFor?.toLowerCase())
              .filter(value => value !== "")
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((market, idx) => (
                <option key={idx} value={market}>
                  {market.charAt(0).toUpperCase() + market.slice(1)}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <DateRangePicker
          startText="Start Date"
          endText="End Date"
          value={joiningDateFilter}
          onChange={(newValue) => setJoiningDateFilter(newValue)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} fullWidth variant="outlined" sx={{ marginRight: 2 }} />
              <TextField {...endProps} fullWidth variant="outlined" />
            </>
          )}
        />
      </Box>

      {/* Table */}
      {filteredData.length === 0 ? (
        <Card
          style={{
            padding: '50px',
            marginTop: '20px',
            justifyContent: 'center',
            textAlign: 'center',
            width: '60%',
            margin: '0 auto',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          <Typography variant="h6" style={{ color: '#3f51b5', fontWeight: 'bold' }}>
            No applications to Create NTID Right Now
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Index</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>UserName & Details</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Market Hiring For</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Training At</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Date of Joining</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID Created</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID Created Date</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>NTID</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Added to Schedule</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Mark As Assigned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
                  <TableCell>{index + 1}</TableCell> {/* Display index */}
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar alt={row.name} sx={{ backgroundColor: row.avatarColor || '#3f51b5' }} />
                      <Box ml={2}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>{row.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{row.email}</Typography>
                        <Typography variant="body1" color="textSecondary">{row.phone}</Typography>
                        <Typography variant="body2" color="textSecondary">{row.applicant_uuid}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.MarketHiringFor}</TableCell>
                  <TableCell>{row.TrainingAt || 'N/A'}</TableCell>
                  <TableCell>
                    {
                      (() => {
                        const currentDate = new Date();
                        const joiningDate = new Date(row.DateOfJoining);
                        const daysLeft = differenceInDays(joiningDate, currentDate);
                        return (
                          <Box>
                            <Typography >
                              {new Date(row.DateOfJoining).toLocaleDateString()}
                            </Typography>
                            <Typography style={{ color: 'red', fontWeight: 'bold' }}>
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Joining date passed'}
                            </Typography>
                          </Box>
                        );
                      })()
                    }
                  </TableCell>
                  <TableCell>
                    {row.status === 'mark_assigned' ? (
                      <Checkbox
                        checked={row.ntidCreated}
                        disabled
                      />
                    ) : (
                      <Checkbox
                        checked={row.ntidCreated}
                        onChange={(e) => handleInputChange(index, 'ntidCreated', e.target.checked)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.status === 'mark_assigned' ? (
                      <TextField
                        type="date"
                        value={row.ntidCreatedDate || ''}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <TextField
                        type="date"
                        value={row.ntidCreatedDate || ''}
                        onChange={(e) => handleInputChange(index, 'ntidCreatedDate', e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.status === 'mark_assigned' ? (
                      <TextField
                        value={row.ntid || ''}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <TextField
                        value={row.ntid || ''}
                        onChange={(e) => handleInputChange(index, 'ntid', e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.status === 'mark_assigned' ? (
                      <Checkbox
                        checked={row.addedToSchedule}
                        disabled
                      />
                    ) : (
                      <Checkbox
                        checked={row.addedToSchedule}
                        onChange={(e) => handleInputChange(index, 'addedToSchedule', e.target.checked)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleIconClick(index)} disabled={clickedIndexes.has(index)}>
                      <CheckCircleIcon 
                        style={{ 
                          color: row.status === 'mark_assigned' ? '#76c7c0' : '#3f51b5' 
                        }} 
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ToastContainer />
    </LocalizationProvider>
  );
}

export default SelectedAtHr;

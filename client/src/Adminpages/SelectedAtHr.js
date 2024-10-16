import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
  Avatar, Typography, Box, TextField, IconButton, Card, Tabs, Tab
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays } from 'date-fns';
import Select from 'react-select';


function SelectedAtHr() {
  const apiurl = process.env.REACT_APP_API;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState(new Set());
  const [selectedTab, setSelectedTab] = useState(0); // Tab management
  const [marketFilter, setMarketFilter] = useState([]); 
  // Filters
 
  const [joiningDateFilter, setJoiningDateFilter] = useState([null, null]);

  useEffect(() => {
    const fetchApplicantsData = async () => {
      try {
        const response = await axios.get(`${apiurl}/applicants/selected-at-hr`);
        if (response.status === 200) {
          setData(response.data.data);
          setFilteredData(response.data.data);
          console.log("response.data.data",response.data.data)
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
    let updatedData = [...data];  // Copy the entire data array
  
    // Apply market filter only if one or more markets are selected
    if (marketFilter.length > 0) {
      updatedData = updatedData.filter(row => 
        marketFilter.includes(row.MarketHiringFor?.toLowerCase())
      );
    }
  
    // Apply joining date filter if both start and end dates are selected
    const [startDate, endDate] = joiningDateFilter;
    if (startDate && endDate) {
      updatedData = updatedData.filter(row => {
        const joiningDate = new Date(row.DateOfJoining);
        return joiningDate >= startDate && joiningDate <= endDate;
      });
    }
  
    // Filter based on selected tab (either 'selected at HR' or 'mark assigned')
    if (selectedTab === 0) {
      updatedData = updatedData.filter(row => row.status === 'selected at Hr');
    } else {
      updatedData = updatedData.filter(row => row.status === 'mark_assigned');
    }
  
    setFilteredData(updatedData);
  }, [marketFilter, joiningDateFilter, data, selectedTab]);
  

  const handleInputChange = (index, field, value) => {
    // Create a copy of filteredData to avoid direct mutation
    const updatedFilteredData = [...filteredData];

    // Update the specific field of the row in filteredData
    updatedFilteredData[index] = {
      ...updatedFilteredData[index], // Copy the existing row data
      [field]: value // Update the specific field
    };

    setFilteredData(updatedFilteredData); // Update filteredData state

    // Find the corresponding index in the main data array
    const mainDataIndex = data.findIndex(item => item.applicant_uuid === updatedFilteredData[index].applicant_uuid);

    if (mainDataIndex > -1) {
      const updatedMainData = [...data];
      updatedMainData[mainDataIndex] = {
        ...updatedMainData[mainDataIndex],
        [field]: value
      };
      setData(updatedMainData); // Update the main data array
    }
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Tabs */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Selected at HR" />
        <Tab label="Mark Assigned" />

      </Tabs>

      {/* Filters */}
      <Box display="flex" justifyContent="space-around" mb={3} className="mt-4">
      <Form.Group variant="outlined" size="small" style={{ minWidth: 220 }}>
        <Select
          isMulti // Enables multi-select
          value={marketFilter.map(market => ({ value: market, label: market.charAt(0).toUpperCase() + market.slice(1) }))}
          onChange={(selectedOptions) => {
            // Update state with the array of selected market values
            setMarketFilter(selectedOptions ? selectedOptions.map(option => option.value) : []);
          }}
          options={data
            .map(row => row.MarketHiringFor?.toLowerCase())
            .filter(value => value !== "")
            .filter((value, index, self) => self.indexOf(value) === index) // Avoid duplicate values
            .map((market) => ({
              value: market,
              label: market.charAt(0).toUpperCase() + market.slice(1) // Capitalize first letter
            }))}
          placeholder="Select Markets"
          styles={{
            control: (provided) => ({
              ...provided,
              borderRadius: '20px',
              padding: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              borderColor: '#007bff',
              color: '#007bff',
              fontWeight: 'bold',
              minWidth: 220,
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
            Select Markets to Create NTID Right Now
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Index</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>UserName & Details</TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Market Hiring </TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>Training </TableCell>
                <TableCell style={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>DOJ</TableCell>
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
                            {row.status === 'mark_assigned' ? " " :
                              <Typography style={{ color: 'red', fontWeight: '' }}>
                                {daysLeft > 0 ? `${daysLeft} days left` : 'Joining date passed'}
                              </Typography>}
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
                        style={{color:'#46aba2'}}
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
                        style={{color:'#46aba2'}}
                      />
                    ) : (
                      <Checkbox
                        checked={row.addedToSchedule}
                        onChange={(e) => handleInputChange(index, 'addedToSchedule', e.target.checked)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.status === 'mark_assigned' ? (
                      <IconButton disabled>
                        <CheckCircleIcon
                          style={{
                            color: '#46aba2'
                          }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleIconClick(index)} disabled={clickedIndexes.has(index)}>
                        <CheckCircleIcon
                          style={{
                            color: '#3f51b5'
                          }}
                        />
                      </IconButton>
                    )}

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

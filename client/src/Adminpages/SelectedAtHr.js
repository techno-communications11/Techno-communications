import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Avatar, Typography, Box, TextField, IconButton, Card } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays } from 'date-fns';

function SelectedAtHr() {
  const apiurl = process.env.REACT_APP_API;

  const [data, setData] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState(new Set());

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchApplicantsData = async () => {
      try {
        const response = await axios.get(`${apiurl}/applicants/selected-at-hr`); // API call
        if (response.status === 200) {
          setData(response.data.data); // Set the fetched data
          console.log(">><<<<<<<<<<<<", response.data.data)
        } else {
          toast.error('Error fetching applicants data');
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        // toast.error('Error fetching applicants data: ' + error.message);
      }
    };

    fetchApplicantsData();
  }, []);

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
      const rowData = data[index];

      if (isValidRow(rowData)) {
        newClickedIndexes.add(index);
        const { ntidCreated, ntidCreatedDate, ntid, addedToSchedule, applicant_uuid } = rowData;

        const dataToSend = {
          ntidCreated,
          ntidCreatedDate,
          ntid,
          addedToSchedule,
          markAsAssigned: true,
          applicant_uuid // Include the applicant_uuid in the payload
        };

        try {
          const response = await axios.post(`${apiurl}/ntids`, dataToSend);
          console.log("dataToSend<<>>>", dataToSend)
          if (response.status === 201) {
            toast.success("NTID entry created successfully!");
            setClickedIndexes(newClickedIndexes);
            setTimeout(() => {
              window.location.reload();
            }, 1800); // You can adjust the delay (1000 ms = 1 second)
            return response.data;

          }

        } catch (error) {
          console.error("API error:", error);
          toast.error("Error creating NTID entry: " + error.message);
          throw error; // Optional, depending on error handling preference
        }
      } else {
        toast.error("Please fill all required fields before submitting!");
      }
    }

    setClickedIndexes(newClickedIndexes);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {data.length === 0 ? (
        <Card
          style={{
            padding: '50px',
            marginTop: "20px",
            justifyContent: "center",
            textAlign: 'center',
            width: "60%",
            margin: '0 auto', // centers the card horizontally
            backgroundColor: '#f5f5f5', // light background color
            border: '1px solid #e0e0e0', // subtle border
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // shadow for depth
            borderRadius: '8px' // rounded corners
          }}
        >
          <Typography
            variant="h6"
            style={{
              color: '#3f51b5', // primary color for the text
              fontWeight: 'bold'
            }}
          >
            No applications to Create NTID Right Now
          </Typography>
        </Card>

      ) : (
        <TableContainer component={Paper} style={{ width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
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
              {data.map((row, index) => (
                <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar alt={row.fullName} sx={{ backgroundColor: row.avatarColor || '#3f51b5' }} />
                      <Box ml={2}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>{row.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{row.email}</Typography>
                        <Typography variant="body1" color="textSecondary">{row.phone}</Typography>
                        <Typography variant="body2" color="textSecondary">{row.applicant_uuid}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.MarketHiringFor}</TableCell>
                  <TableCell>{row.TrainingAt || "N/A"}</TableCell>
                  <TableCell>
                    {
                      (() => {
                        const currentDate = new Date();
                        const joiningDate = new Date(row.DateOfJoining);
                        const daysLeft = differenceInDays(joiningDate, currentDate);

                        // Display the difference in red text
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
      )}
      <ToastContainer />
    </LocalizationProvider>
  );

}

export default SelectedAtHr;

import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import 'react-toastify/dist/ReactToastify.css';
import CustomDateRangePicker from './DateFilter';
import MarketSelector from './MarketSelector';
import { Tabs, Tab, Card, Typography } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import {
  Table, TableBody, TableCell, Popover, TableContainer, TableHead, TableRow, Paper, Checkbox,
  Box, TextField, IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MdOutlineArrowDropDown } from "react-icons/md";
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip
import Swal from 'sweetalert2';
import {Button} from 'react-bootstrap';
import * as XLSX from 'xlsx';

function SelectedAtHr() {
  const apiurl = process.env.REACT_APP_API;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState(new Set());
  const [selectedTab, setSelectedTab] = useState(0);
  const [marketFilter, setMarketFilter] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [joiningDateFilter, setJoiningDateFilter] = useState([null, null]);
  const [candidateFilter, setCandidateFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMarket1, setSelectedMarket1] = useState([])
  // const [isAllSelected1, setIsAllSelected1] = useState(false);
  const [marketFilter1, setMarketFilter1] = useState([]);
  const [selectedMarket2, setSelectedMarket2] = useState([])
  // const [isAllSelected2, setIsAllSelected2] = useState(false);
  const [marketFilter2, setMarketFilter2] = useState([]);


  console.log(selectedMarket, selectedMarket1, selectedMarket2)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleClose = () => {
    setAnchorEl(null);

  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    const fetchApplicantsData = async () => {
      try {
        const response = await axios.get(`${apiurl}/applicants/selected-at-hr`);
        console.log(response.data.data, "redd")
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
  }, [apiurl]);

  useEffect(() => {
    let candidateDetails = [...data];
    if (candidateFilter) {
      const lowerCaseCandidateFilter = candidateFilter.toLowerCase().trim();
      candidateDetails = candidateDetails.filter(row => {
        const candidateDetails = `${row.name?.toLowerCase()} ${row.email?.toLowerCase()} ${row.phone?.toLowerCase()}`;
        return candidateDetails.includes(lowerCaseCandidateFilter);
      });
    }
    setFilteredData(candidateDetails)
  }, [candidateFilter])

  useEffect(() => {
    let updatedData = [...data];
  
    // First filter: `marketFilter` on `MarketHiringFor`
    if (marketFilter.length > 0) {
      const lowerCaseMarketFilter = marketFilter.map(market => market.toLowerCase().trim());
      updatedData = updatedData.filter(row => {
        const marketValue = row.MarketHiringFor?.toLowerCase().trim() || '';
        return lowerCaseMarketFilter.includes(marketValue);
      });
      console.log('After First Market Filter (MarketHiringFor):', updatedData);
    }
  
    // Second filter: `marketFilter1` on `MarketHiringFor`
    if (marketFilter1.length > 0) {
      const lowerCaseMarketFilter1 = marketFilter1.map(market => market.toLowerCase().trim());
      updatedData = updatedData.filter(row => {
        const marketValue = row.MarketHiringFor?.toLowerCase().trim() || '';
        return lowerCaseMarketFilter1.includes(marketValue);
      });
      console.log('After Second Market Filter (MarketHiringFor):', updatedData);
    }
  
    // Third filter: `marketFilter2` on `TrainingAt`
    if (marketFilter2.length > 0) {
      const lowerCaseMarketFilter2 = marketFilter2.map(market => market.toLowerCase().trim());
      updatedData = updatedData.filter(row => {
        const trainingValue = row.TrainingAt?.toLowerCase().trim() || '';
        return lowerCaseMarketFilter2.includes(trainingValue);
      });
      console.log('After Third Market Filter (TrainingAt):', updatedData);
    }
  
    // Date filter on `DateOfJoining`
    const [startDate, endDate] = joiningDateFilter;
    if (startDate && endDate) {
      updatedData = updatedData.filter(row => {
        const joiningDate = new Date(row.DateOfJoining);
        return joiningDate >= startDate && joiningDate <= endDate;
      });
      console.log('After Date Filter:', updatedData);
    }
  
    // Status filter based on `selectedTab`
    updatedData = updatedData.filter(row => {
      switch (selectedTab) {
        case 0: return row.status === 'selected at Hr';
        case 1: return row.status === 'mark_assigned';
        case 2: return row.status === 'backOut';
        default: return true;  // If `selectedTab` doesn't match, don't filter by status
      }
    });

    console.log(updatedData,"vbackourt")
  
    setFilteredData(updatedData);
  }, [marketFilter, marketFilter1, marketFilter2, joiningDateFilter, data, selectedTab]);
  
  

  const handleInputChange = (index, field, value) => {
    const updatedFilteredData = [...filteredData];
    updatedFilteredData[index] = {
      ...updatedFilteredData[index],
      [field]: value
    };


    setFilteredData(updatedFilteredData);
    const mainDataIndex = data.findIndex(item => item.applicant_uuid === updatedFilteredData[index].applicant_uuid);

    if (mainDataIndex > -1) {
      const updatedMainData = [...data];
      updatedMainData[mainDataIndex] = {
        ...updatedMainData[mainDataIndex],
        [field]: value
      };
      setData(updatedMainData);
    }
  }; const [showDateInput, setShowDateInput] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  }
  const handleIconClick = (index) => {
    console.log(`Icon clicked at index: ${index}`);
    const newClickedIndexes = new Set(clickedIndexes);
    if (newClickedIndexes.has(index)) {
      newClickedIndexes.delete(index);
    } else {
      newClickedIndexes.add(index);
    }
    setClickedIndexes(newClickedIndexes);
  };

  const confirmAction = async (applicant_uuid, action,name) => {
    // Ask for confirmation using SweetAlert2
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${action} for this applicant ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        const payload = {
            applicant_uuid: applicant_uuid,
            action
        };
        console.log(payload, 'payload');

        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/updatestatus`, payload);

            if (res.status === 200) {
                toast.success(res.data.message);

                setTimeout(() => {
                    window.location.reload();
                }, 1800);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.");
        }
    } else {
        toast.info("Action canceled");
    }
};


const downloadAsExcel = () => {
  if (!filteredData || filteredData.length === 0) {
    console.error("No data available to export");
    return;
  }
  console.log("filteredData",filteredData)
  // Create a new worksheet from the filtered data
  const worksheet = XLSX.utils.json_to_sheet(filteredData.map((row) => ({
  
    Name: row.name,
    Email: row.email,
    Phone: row.phone,
    ReferedBy: row.referred_by,
    Reference_id: row.reference_id,
    DateOfJoining: new Date(row.DateOfJoining).toLocaleDateString()||'N/A', // Formatting the date
    MarketHiringFor: row.MarketHiringFor||'N/A',
    TrainingAt: row.TrainingAt||'N/A',
    CompensationType: row.compensation_type||'N/A',
    Payment: row.payment||'N/A',
    Payroll: row.payroll||'N/A',
    NoOfDays: row.noOFDays||'N/A',
    OffDays: row.offDays || 'N/A', // Handle null
    Status: row.status,
    NTIDCreated: row.ntidCreated || 'N/A', // Handle null
    NTIDCreatedDate: row.ntidCreatedDate ? new Date(row.ntidCreatedDate).toLocaleDateString() : 'N/A',
    AddedToSchedule: row.addedToSchedule || 'N/A', // Handle null
    ContractDisclosed: row.contractDisclosed || 'N/A',
     // Handle null
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants Data");
  XLSX.writeFile(workbook, `FilteredData.xlsx`);
};



  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Selected at HR" />
        <Tab label="Mark Assigned" />
        <Tab label="Backed Out" />
      </Tabs>

      <Row className="d-flex justify-content-between mt-4">
        <Col className='col-md-2'>
          <MarketSelector
            selectedMarket={selectedMarket}
            setSelectedMarket={setSelectedMarket}
            isAllSelected={isAllSelected}
            setIsAllSelected={setIsAllSelected}
            setMarketFilter={setMarketFilter}
            text={"Select Market"}
          />
          <Button className='btn btn-success mb-2' onClick={()=>downloadAsExcel()}>Download In Excel</Button>
        </Col>
        <Col className='col-md-6'></Col>
        <Col className='col-md-4'>
          <CustomDateRangePicker
            joiningDateFilter={joiningDateFilter}
            setJoiningDateFilter={setJoiningDateFilter}
          />
        </Col>
      </Row>

      {filteredData.length === 0 ? (
        <Card
          style={{
            padding: '30px', // Adjusted padding
            marginTop: '20px',
            justifyContent: 'center',
            textAlign: 'center',
            width: '60%',
            margin: '0 auto',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          <Typography variant="h6" style={{ color: '#3f51b5', fontWeight: 'bold' }}>
            Select Markets to Create NTID Right Now
          </Typography>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          style={{ maxHeight: '600px', overflowY: 'auto', margin: '0 16px' }}
        >
          <Table stickyHeader style={{ tableLayout: 'auto', fontSize: '0.6rem', }}> {/* Reduced font size */}
            <TableHead>
              <TableRow style={{ headerStyle }}>
                {['SINo', 'CandidateDetails', 'Market Hiring For', 'Training Hiring For', 'DOJ',
                  'Payroll/Compensation Type', 'Payment', 'work Hours/No.Of Days&&OffDays', 'Back Out', 'Contract Disclosed',
                  'Added to Schedule', 'NTID Created', 'NTID Created Date', 'NTID',
                  'Mark As Assigned'].map(header => (
                    // Conditionally render the 'Back Out' column based on filteredData
                    header === 'Back Out' ? (
                      filteredData.some(row => row.status !== 'mark_assigned') && (
                        <TableCell key={header} style={headerStyle} className='text-center text-capitalize'>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body4" style={{ marginRight: '1px' }}>{header}</Typography>
                          </div>
                        </TableCell>
                      )
                    ) : (
                      <TableCell key={header} style={headerStyle} className='text-center text-capitalize'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body4" style={{ marginRight: '1px' }}>{header}</Typography>

                          {/* CandidateDetails Filter */}
                          {header === 'CandidateDetails' && (
                            <>
                              <IconButton onClick={handleClick}>
                                <MdOutlineArrowDropDown className='text-secondary' />
                              </IconButton>
                              <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'center',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'center',
                                }}
                              >
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  placeholder="Search Candidate..."
                                  value={candidateFilter}
                                  onChange={(e) => setCandidateFilter(e.target.value)}
                                  style={{ width: '200px' }}
                                />
                              </Popover>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )
                  ))}
              </TableRow>
            </TableHead>



            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                    height: '32px', // Set a fixed height for rows
                  }}
                >
                  <TableCell style={{ padding: '2px 4px' }} className='text-center'>{index + 1}</TableCell>

                  <TableCell style={{ padding: '2px 4px' }}>
                    <Box display="flex" alignItems="center">
                      <Box ml={2}>
                        <Tooltip
                          title={
                            <>
                              <Typography variant="body2">{row.email}</Typography>
                              <Typography variant="body2">{row.phone}</Typography>
                              <Typography variant="body2">{row.applicant_uuid}</Typography>
                            </>
                          }
                          arrow
                        >
                          <Typography variant="body2" style={{ fontWeight: 'bold', cursor: 'pointer', padding: '2px 4px', fontSize: '0.8rem' }} >
                            {row.name}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>


                  <TableCell className='text-capitalize text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>{row.MarketHiringFor?.toLowerCase()}</TableCell>
                  <TableCell className='text-capitalize text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>{row.TrainingAt?.toLowerCase() || 'N/A'}</TableCell>

                  <TableCell className='text-center' style={{ padding: '1px 2px', fontSize: '0.6rem' }}>
                    <Typography style={{ fontSize: '0.7rem' }}>
                      {new Date(row.DateOfJoining).toLocaleDateString()}
                    </Typography>
                  </TableCell>


                  <TableCell style={{ padding: '2px 4px', fontSize: '0.7rem' }}>
                    <Box display="flex" alignItems="center">
                      <Box ml={2}>
                        <Typography variant="body3">{row.payroll || 'NA'}</Typography>
                        <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.6rem' }}>{row.compensation_type}</Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>

                    {row.payment > 0 ? (<span style={{ marginRight: '2px' }}>$</span> && row.payment) : "N/A"}
                  </TableCell>

                  <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>
                    {row.noOFDays || 'N/A'}
                    {row.offDays?.length>0&&<span>
                      <br />
                      OffDays:
                      {
                        row.offDays

                      }
                    </span>}

                  </TableCell>
                  {
                    (row.status !== 'mark_assigned'&&row.status!=='backOut') &&
                     <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>
                      <button className='btn' style={{ padding: '2px 4px', fontSize: '0.7rem', color:'white',backgroundColor:'#ff0000' }}
                      onClick={()=>confirmAction(row.applicant_uuid,'backOut',row.name)}>Back Out</button>
                    </TableCell>

                  }
                  {
                    row.status==='backOut'&&
                    <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>
                      <button className='btn' style={{ padding: '2px 4px', fontSize: '0.7rem', color:'white',backgroundColor:'green' }}
                      onClick={()=>confirmAction(row.applicant_uuid,'selected at Hr')}>call back</button>
                    </TableCell>

                  }



                  <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.6rem' }}>
                    {row.contractDisclosed === 1 ? <CheckCircleSharpIcon className='text-success' /> :
                      <CancelRoundedIcon className='text-danger' />}
                  </TableCell>


                 

                  <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>
                    <Checkbox
                      checked={row.addedToSchedule}
                      onChange={e => handleInputChange(index, 'addedToSchedule', e.target.checked)}
                      disabled={row.status === 'mark_assigned'||row.status==='backOut'}
                      sx={{
                        color: row.status === 'mark_assigned' ? '#46aba2' : undefined,
                        '&.Mui-checked': {
                          color: row.status === 'mark_assigned' ? '#46aba2' : undefined,
                        },
                        '&.Mui-disabled': {
                          color: row.status === 'mark_assigned' ? '#46aba2' : undefined,
                        },
                      }}
                      size="small"
                      style={row.status === 'mark_assigned' ? { color: '#46aba2' } : {}}
                    />
                  </TableCell>

                  <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>
                    <Checkbox
                      checked={row.ntidCreated}
                      onChange={e => handleInputChange(index, 'ntidCreated', e.target.checked)}
                      disabled={row.status === 'mark_assigned' || row.status==='backOut'}
                      sx={{
                        color: row.status === 'mark_assigned' ? '#46aba2' : undefined,
                        '&.Mui-checked': {
                          color: row.status === 'mark_assigned' ? '#46aba2' : undefined,
                        },
                        '&.Mui-disabled': {
                          color: row.status === 'mark_assigned' ? '#46aba2' : undefined,
                        },
                      }}
                      size="small"
                      style={row.status === 'mark_assigned' ? { color: '#46aba2' } : {}}
                    />
                  </TableCell>

                  <TableCell sx={{ padding: '2px' }} className='text-center'>
                    {row.status === 'mark_assigned' ? (
                      formatDate(row.ntidCreatedDate)
                    ) : (
                      showDateInput ? (
                        <TextField
                          type="date"
                          value={row.ntidCreatedDate || ''}
                          onChange={e => handleInputChange(index, 'ntidCreatedDate', e.target.value)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          InputProps={{ readOnly: row.status === 'mark_assigned'}}
                          sx={{ width: '120px' }} 
                          disabled={row.status==='backOut'}// Adjusted width
                        />
                      ) : (
                        <IconButton onClick={() => setShowDateInput(true)} size="small">
                          <CalendarTodayIcon className='fs-6' />
                        </IconButton>
                      )
                    )}
                  </TableCell>

                  <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>
                    <TextField
                      value={row.ntid || ''}
                      onChange={e => handleInputChange(index, 'ntid', e.target.value)}
                      variant="outlined"
                      size="small"  // Adjusted size to small
                      sx={{
                        width: '80px',
                        '& .MuiInputBase-input': { fontSize: '14px', padding: '4px 6px' } // Set font size and padding inside the input
                      }}
                      InputProps={{
                        readOnly: row.status === 'mark_assigned',
                      }}
                      disabled={row.status==='backOut'}
                    />
                  </TableCell>



                  <TableCell className='text-center' style={{ padding: '2px 4px', fontSize: '0.7rem' }}>
                    <IconButton onClick={() => handleIconClick(index)} disabled={clickedIndexes.has(index)}>
                      <CheckCircleIcon style={{ color: clickedIndexes.has(index) ? '#46aba2' : '#3f51b5' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ToastContainer/>
        </TableContainer>
         
      )}
    </LocalizationProvider>
  


  );
}
const headerStyle = {
  backgroundColor: '#3f51b5',
  color: '#ffffff',
  padding: '2px',
  position: 'sticky',
  top: 0,
  fontSize: '0.7vw',
  textAlign: 'center',
  width: '5%', // Adjust the width to decrease it (you can change the value as needed)
  lineHeight: '1.2', // Decrease the line height for tighter text
};


export default SelectedAtHr;

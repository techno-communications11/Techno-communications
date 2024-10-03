import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { Button, TextField } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PieChartIcon from '@mui/icons-material/PieChart'; // Optional pie chart icon
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import axios from 'axios';  // Import axios for making API requests

const AdminFilters = ({
  selectedMarket,
  handleMarketChange,
  dateRange,
  setDateRange,
  DownloadApplicantData,
  handleClickPieButton,
  setStatusCounts, 
  setSelectedLocationId,
}) => {
  const locations = [
    { id: 4, name: 'ARIZONA' },
    { id: 5, name: 'Bay Area' },
    { id: 6, name: 'COLORADO' },
    { id: 7, name: 'DALLAS' },
    { id: 8, name: 'El Paso' },
    { id: 9, name: 'FLORIDA' },
    { id: 10, name: 'HOUSTON' },
    { id: 11, name: 'LOS ANGELES' },
    { id: 12, name: 'MEMPHIS' },
    { id: 13, name: 'NASHVILLE' },
    { id: 14, name: 'NORTH CAROLINA' },
    { id: 15, name: 'SACRAMENTO' },
    { id: 16, name: 'SAN DIEGO' },
    { id: 17, name: 'SAN FRANCISCO' },
    { id: 18, name: 'SAN JOSE' },
    { id: 19, name: 'SANTA ROSA' },
  ];

  const [loading, setLoading] = useState(false);

  const fetchStatusCountsByLocation = async (locationId) => {
    setLoading(true);
    try {
      const url = locationId
        ? `${process.env.REACT_APP_API}/getStatusCountsByLocation/${locationId}`
        : `${process.env.REACT_APP_API}/statuss`;
      const response = await axios.get(url);

      if (response.status === 200) {
        setStatusCounts(response.data.status_counts || []);
      } else {
        console.error('Error fetching status counts:', response);
      }
    } catch (error) {
      console.error('API Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (event) => {
    const selectedId = event.target.value;
    handleMarketChange(selectedId || null);
    fetchStatusCountsByLocation(selectedId);
    setSelectedLocationId(selectedId);
  };

  return (
    <Row className="m-4">
      <Col md={3}>
        {/* Market Selector */}
        <Form.Group controlId="marketSelector">
          <Form.Select
            value={selectedMarket}
            onChange={handleLocationChange}
            style={{
              borderRadius: '20px',
              padding: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              borderColor: '#007bff',
              color: '#007bff',
              fontWeight: 'bold',
            }}
          >
            <option value="">All Markets</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={4}>
        {/* Date Range Picker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField
                  {...startProps}
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                />
                <TextField
                  {...endProps}
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: '20px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                />
              </>
            )}
          />
        </LocalizationProvider>
      </Col>

      <Col md={3} className="d-flex align-items-center">
        {/* Download Button */}
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={DownloadApplicantData}
          sx={{
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '20px',
            padding: '10px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: '#218838',
            },
          }}
        >
          Download Data
        </Button>
      </Col>

      <Col md={2} className="d-flex align-items-center">
        {/* Pie Chart Button */}
        <Button
          variant="contained"
          startIcon={<PieChartIcon />} // Optional pie chart icon
          onClick={handleClickPieButton}
          sx={{
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '20px',
            padding: '10px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Pie Chart
        </Button>
      </Col>
    </Row>
  );
};

export default AdminFilters;

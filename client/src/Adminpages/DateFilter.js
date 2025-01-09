import React from 'react';
import { Form } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

// Styled component for the input
const CustomInput = styled(Form.Control)(({ theme }) => ({
  height: '20px !important', // Set your desired height
  padding: '5px', // Adjust padding for a better fit
  fontSize: '14px', // Adjust font size if needed
  lineHeight: 'normal !important', // Ensure line-height is normal
  border: '1px solid #ced4da', // Optional: customize border
  borderRadius: '0.25rem', // Match Bootstrap's border radius
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)', // Focus effect
    borderColor: '#80bdff' // Border color on focus
  }
}));

const CompactDateRangePicker = ({ joiningDateFilter, setJoiningDateFilter }) => {
  const formatDateRange = (dates) => {
    if (!dates || !dates[0] || !dates[1]) return '';
    return `${dayjs(dates[0]).format('MM/DD/YYYY')} - ${dayjs(dates[1]).format('MM/DD/YYYY')}`;
  };

  // Handle the change of the date range
  const handleDateChange = (newValue) => {
    setJoiningDateFilter(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Form.Group className="mb-3">
        <DateRangePicker
          value={joiningDateFilter}
          onChange={handleDateChange}
          renderInput={(startProps) => (
            <CustomInput 
              {...startProps} 
              value={formatDateRange(joiningDateFilter)} 
              readOnly 
            />
          )}
        />
      </Form.Group>
    </LocalizationProvider>
  );
};

export default CompactDateRangePicker;

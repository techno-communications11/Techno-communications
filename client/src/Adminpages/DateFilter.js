import React from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';



const DateFilter = ({ dateFilter, setDateFilter }) => {
  const formatDateRange = (dates) => {
    if (!dates || !dates[0] || !dates[1]) return '';
    return `${dayjs(dates[0]).format('MM/DD/YYYY')} - ${dayjs(dates[1]).format('MM/DD/YYYY')}`;
  };

  const handleDateChange = (newValue) => {
    setDateFilter(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Form.Group className="mb-3">
        <DateRangePicker
          value={dateFilter}
          onChange={handleDateChange}
          renderInput={(startProps) => (
            <FormControl 
              {...startProps} 
              value={formatDateRange(dateFilter)} 
              readOnly 
            />
          )}
        />
      </Form.Group>
    </LocalizationProvider>
  );
};

export default DateFilter;

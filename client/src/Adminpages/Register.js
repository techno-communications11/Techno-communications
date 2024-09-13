import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Box, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Register() {
  const [error, setError] = useState('');
  const [markets, setMarkets] = useState([]);
  const [roles, setRoles] = useState(['admin', 'screening_manager', 'interviewer', 'hr', 'trainer']);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [calendlyUsername, setCalendlyUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const apiUrl = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/markets`);
        setMarkets(response.data);
      } catch (error) {
        setError('Failed to fetch markets. Please try again later.');
      }
    };
    fetchMarkets();
  }, [apiUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailValid = regexEmail.test(email);

    if (!name || !email || !selectedRole || (selectedRole === 'Screening Manager' && !selectedMarket)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    try {
      const response = await axios.post(`${apiUrl}/createuser`, {
        name,
        email,
        role: selectedRole,
        market: selectedMarket,
        calendlyUsername,
      });

      if (response.status === 201) {
        toast.success(`${response.data.message} and his id is ${response.data.userId}`);

        setEmail('');
        setName('');
        setSelectedMarket('');
        setSelectedRole('');
        setCalendlyUsername('');
      }
    } catch (error) {
      setError('Failed to register user. Please try again later.');
    }
  };

  return (
    <Box sx={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="register.png"
            alt="register"
            style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, borderRadius: 3, boxShadow: 3, width: '100%', maxWidth: '400px' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Register
            </Typography>

            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Select Role</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
                label="Select Role"
              >
                {roles.map((role, index) => (
                  <MenuItem key={index} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedRole === 'screening_manager' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Market</InputLabel>
                <Select
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  required
                  label="Select Market"
                >
                  {markets
                    .sort((a, b) => (a.location_name || '').localeCompare(b.location_name || ''))
                    .map((market) => (
                      <MenuItem key={market.id} value={market.location_name}>
                        {market.location_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              label="Calendly Username (optional)"
              variant="outlined"
              margin="normal"
              value={calendlyUsername}
              onChange={(e) => setCalendlyUsername(e.target.value)}
            />

            {error && <Typography color="error" align="center">{error}</Typography>}

            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 3 }}>
              Register
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
}

export default Register;

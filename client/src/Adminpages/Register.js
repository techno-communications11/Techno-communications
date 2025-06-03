import  { useState} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Alert, Button } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import Roles from '../Constants/Roles';
import EMAIL_REGEX from '../Constants/EmailValidation';
import API_URL from '../Constants/ApiUrl';
import useFetchMarkets from '../Hooks/useFetchMarkets'
import Loader from '../utils/Loader';

// Register component
const Register = () => {
  // State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    market: '',
    calendlyUsername: '',
  });
   const [registerload,setRegisterLoad]=useState(false);
 
   const {markets,loading,error}=useFetchMarkets();
    if(loading ||registerload){
      return(
        <Loader/>
      );
    }
 
 

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    const { name, email, role, market } = formData;
    if (!name || !email || !role || (role === 'Screening Manager' && !market)) {
      return 'All required fields must be filled';
    }
    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address.';
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setRegisterLoad(true);
    try {
      const { data } = await axios.post(`${API_URL}/createuser`,  {
        ...formData,
        role: formData.role,
        market: formData.role === 'Screening Manager' ? formData.market : '',
        
        
      },{withCredentials:true});

      toast.success(`${data.message} (ID: ${data.userId})`);
      setFormData({ name: '', email: '', role: '', market: '', calendlyUsername: '' });
    } catch {
      toast.error('Registration failed.');
    }finally{
      setRegisterLoad(false);
    }
  };

  return (
    <Container sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={3} alignItems="center">
        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="/register.png"
              alt="Register"
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
            />
          </Box>
        </Grid>

        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 3, borderRadius: 3, boxShadow: 3, maxWidth: 400, mx: 'auto' }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Register
            </Typography>

            {/* Name Input */}
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />

            {/* Email Input */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />

            {/* Role Selector */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} onChange={handleChange} label="Role">
                <MenuItem value="">
                  <em>Select a role</em>
                </MenuItem>
                {Roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Market Selector (Conditional) */}
            {formData.role === 'screening_manager' && (
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Market</InputLabel>
                <Select name="market" value={formData.market} onChange={handleChange} label="Market">
                  <MenuItem value="">
                    <em>Select a market</em>
                  </MenuItem>
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

            {/* Calendly Username Input */}
            <TextField
              fullWidth
              label="Calendly Username (Optional)"
              name="calendlyUsername"
              value={formData.calendlyUsername}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Register
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default Register;
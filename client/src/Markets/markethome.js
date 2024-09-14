import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Grid, Card, CardContent, Grid2 } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Ensure you have react-toastify installed
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Markethome = () => {
    const apiurl = process.env.REACT_APP_API;
    const navigate = useNavigate();

    const [markets, setMarkets] = useState([]);

    useEffect(() => {
        // Fetch data from the API
        const fetchMarketJobs = async () => {
            try {
                const response = await axios.get(`${apiurl}/getmarketjobs`);
                const data = response.data;
                const filteredData = data.filter(val => val.name === "New York");
                setMarkets(filteredData);
                console.log(filteredData, "filteredData");
            } catch (error) {
                console.error('Error fetching market job openings:', error);
            }
        };

        fetchMarketJobs();
    }, []);

    const [jobDetails, setJobDetails] = useState({
        location: 'New York', // Default location
        openings: '',
        deadline: '',
    });

    const handleChange = (e) => {
        setJobDetails({
            ...jobDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiurl}/post-job`, jobDetails);
            console.log(jobDetails, "jobDetails");
            if (response.status === 200) {
                toast.success(response.data.message);
                console.log("Job posted successfully");

                setJobDetails({
                    location: 'New York', // Reset to default location
                    openings: '',
                    deadline: '',
                });
            }
        } catch (err) {
            console.error('Error posting job:', err);
            toast.error('Failed to post job');
        }
    };

    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={2}>
                <Grid md={1}>

                </Grid>
                <Grid item md={6}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            padding: 3,
                            boxShadow: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                        }}
                    >
                        <Typography variant="h4" align="center" gutterBottom>
                            Post a New Job
                        </Typography>
                        <TextField
                            select
                            label="Select Market"
                            name="location"
                            value={jobDetails.location}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            variant="outlined"
                        >
                            <MenuItem value="New York">New York</MenuItem>
                            <MenuItem value="San Francisco">San Francisco</MenuItem>
                            <MenuItem value="Chicago Office">Chicago Office</MenuItem>
                            <MenuItem value="ARIZONA">ARIZONA</MenuItem>
                            <MenuItem value="Bay Area">Bay Area</MenuItem>
                        </TextField>
                        <TextField
                            label="Number of Openings"
                            name="openings"
                            type="number"
                            value={jobDetails.openings}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Application Deadline"
                            name="deadline"
                            type="date"
                            value={jobDetails.deadline}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                        >
                            Post Job
                        </Button>
                    </Box>
                </Grid>
                <Grid item md={5}>
                    <Grid container spacing={2}>
                        {markets.map((market) => (
                            <Grid item xs={12} sm={6} md={4} key={market.id}>
                                <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {market.name}
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {market.openings} Openings
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={2}>
                                            <AccessTimeIcon color="action" />
                                            <Typography variant="body2" color="textSecondary" ml={1}>
                                                Deadline: {new Date(market.deadline).toLocaleDateString('en-US')}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            <ToastContainer />
        </Box>
    );
};

export default Markethome;

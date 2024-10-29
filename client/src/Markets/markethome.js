import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import decodeToken from '../decodedDetails';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Ensure you have react-toastify installed

const Markethome = () => {
    const apiurl = process.env.REACT_APP_API;
    const navigate = useNavigate();
    const userData = decodeToken();
    const [markets, setMarkets] = useState([]);
    console.log("userData", userData);

    const userMarket = {
        "Ali Khan": "ARIZONA",
        "Rahim Nasir Khan": "BAY AREA",
        "Shah Noor Butt": "COLORADO",
        "Nazim Sundrani": "DALLAS",
        "Afzal Muhammad": "El Paso",
        "Adnan Barri": "HOUSTON",
        "Maaz Khan": "LOS ANGELES",
        "Mohamad Elayan": "MEMPHIS/NASHVILLE / FLORIDA",
        "Uzair Uddin": "NORTH CAROL",
        "Faizan Jiwani": "SACRAMENTO",
        "Hassan Saleem": "SAN DEIGIO",
        "Kamaran Mohammed": "SAN FRANCISCO"
    };

    // Fetch the user's market based on their name
    const userMarketLocation = userMarket[userData.name];
    console.log("userMarketLocation", userMarketLocation);

    useEffect(() => {
        // Fetch data from the API
        const fetchMarketJobs = async () => {
            try {
                const response = await axios.get(`${apiurl}/getmarketjobs`);
                const data = response.data;
                const filteredData = data.filter(val => val.name === userMarketLocation);
                setMarkets(filteredData);
                console.log(filteredData, "filteredData");
            } catch (error) {
                console.error('Error fetching market job openings:', error);
            }
        };

        fetchMarketJobs();
    }, [userMarketLocation]);

    const [jobDetails, setJobDetails] = useState({
        location: userMarketLocation,
        openings: '',
        deadline: '',
        posted_by: userData.name
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

                setJobDetails({
                    location: userMarketLocation,
                    openings: '',
                    deadline: '',
                    posted_by: userData.name
                });

                // Delay the page reload by 1300 ms
                setTimeout(() => {
                    window.location.reload(); // Reload the page
                }, 1300);
            }
        } catch (err) {
            console.error('Error posting job:', err);
            toast.error('Failed to post job');
        }
    };


    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={2}>
                <Grid md={1}></Grid>
                <Grid item md={10}>
                    {/* Form */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            padding: 3,
                            boxShadow: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                            mb: 4,
                        }}
                    >
                        <Typography variant="h4" align="center" gutterBottom>
                            Post a New Job
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Market"
                                    name="location"
                                    value={jobDetails.location}
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
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
                            </Grid>
                            <Grid item xs={12} sm={3}>
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
                            </Grid>
                        </Grid>
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

                    {/* Table for displaying jobs */}
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#E10174' }}>
                                    <TableCell><strong style={{ color: '#fff' }}>Market</strong></TableCell>
                                    <TableCell><strong style={{ color: '#fff' }}>Openings</strong></TableCell>
                                    <TableCell><strong style={{ color: '#fff' }}>Posted By</strong></TableCell>
                                    <TableCell><strong style={{ color: '#fff' }}>Created At</strong></TableCell>
                                    <TableCell><strong style={{ color: '#fff' }}>Deadline</strong></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {markets.map((market) => (
                                    <TableRow key={market.id}>
                                        <TableCell>{market.name}</TableCell>
                                        <TableCell>{market.openings}</TableCell>
                                        <TableCell>{market.posted_by}</TableCell>
                                        <TableCell>{new Date(market.created_at).toLocaleDateString('en-US')}</TableCell>
                                        <TableCell>{new Date(market.deadline).toLocaleDateString('en-US')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <ToastContainer />
        </Box>
    );
};

export default Markethome;

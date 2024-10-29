import React, { useState, useEffect } from 'react';
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Grid, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, Typography } from '@mui/material';
import axios from 'axios';

const JobInfo = () => {
    const apiurl = process.env.REACT_APP_API;
    const [markets, setMarkets] = useState([]);
    const [filteredMarkets, setFilteredMarkets] = useState([]);

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

    const [filters, setFilters] = useState({
        market: [],
        posted_by: [],
        deadline: ''
    });

    useEffect(() => {
        const fetchMarketJobs = async () => {
            try {
                const response = await axios.get(`${apiurl}/getmarketjobs`);
                const data = response.data;
                setMarkets(data);
                setFilteredMarkets(data); 
            } catch (error) {
                console.error('Error fetching market job openings:', error);
            }
        };

        fetchMarketJobs();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        // Check if the 'selectAll' option was chosen for market selection
        if (name === "market") {
            if (value.includes("selectAll")) {
                // If 'selectAll' is clicked, check if all markets are already selected, toggle selection accordingly
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    market: prevFilters.market.length === marketNames.length ? [] : marketNames,
                }));
            } else {
                setFilters({
                    ...filters,
                    [name]: value,
                });
            }
        } else {
            setFilters({
                ...filters,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        const filtered = markets.filter(market => {
            return (
                (filters.market.length === 0 || filters.market.includes(market.name)) &&
                (filters.posted_by.length === 0 || filters.posted_by.includes(market.posted_by)) &&
                (filters.deadline === '' || new Date(market.deadline).toLocaleDateString('en-US') === new Date(filters.deadline).toLocaleDateString('en-US'))
            );
        });
        setFilteredMarkets(filtered);
    }, [filters, markets]);

    const marketNames = Object.values(userMarket);
    const postedByNames = Object.keys(userMarket);

    return (
        <Box sx={{ flexGrow: 1, mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '90%', maxWidth: 1200 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                    Job Posting Information
                </Typography>

                {/* Filters */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Market</InputLabel>
                            <Select
                                label="Market"
                                name="market"
                                multiple
                                value={filters.market}
                                onChange={handleFilterChange}
                                input={<OutlinedInput label="Market" />}
                                renderValue={(selected) => selected.join(', ')}
                                sx={{ height: 40 }}
                                size="small"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 350,
                                            padding: '15px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '10px',
                                            border: '1px solid #ddd',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="selectAll" sx={{ fontSize: '0.8rem' }}>
                                    <Checkbox checked={filters.market.length === marketNames.length} size="small" />
                                    <ListItemText primary="Select All" />
                                </MenuItem>
                                {marketNames.map((name) => (
                                    <MenuItem key={name} value={name} sx={{ fontSize: '0.8rem' }}>
                                        <Checkbox checked={filters.market.indexOf(name) > -1} size="small" />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Posted By</InputLabel>
                            <Select
                                label="Posted By"
                                name="posted_by"
                                multiple
                                value={filters.posted_by}
                                onChange={handleFilterChange}
                                input={<OutlinedInput label="Posted By" />}
                                renderValue={(selected) => selected.join(', ')}
                                sx={{ height: 40 }}
                                size="small"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 350,
                                            padding: '15px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '10px',
                                            border: '1px solid #ddd',
                                        },
                                    },
                                }}
                            >
                                {postedByNames.map((name) => (
                                    <MenuItem key={name} value={name} sx={{ fontSize: '0.8rem' }}>
                                        <Checkbox checked={filters.posted_by.indexOf(name) > -1} size="small" />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} sm={4}>
                        <TextField
                            label="Deadline"
                            name="deadline"
                            type="date"
                            value={filters.deadline}
                            onChange={handleFilterChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ height: 40 }}
                            size="small"
                        />
                    </Grid> */}
                </Grid>

                {/* Table */}
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
                            {filteredMarkets.map((market) => (
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
            </Box>
        </Box>
    );
};

export default JobInfo;

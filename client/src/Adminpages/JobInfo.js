import React, { useState, useEffect } from 'react';
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,  Grid, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import { Col, Container, Form ,Row} from 'react-bootstrap';

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
                // console.log(data,'id of jobs for market');
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
        <Container fluid sx={{ flexGrow: 1, mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Row sx={{ width: '90%', maxWidth: 1200 }}>
                <h1 variant="h4" align="center" className='mt-3 fw-bolder' gutterBottom sx={{ mb: 4, fontWeight: 'bold' }} style={{ color: '#E10174' }}>
                    Job Posting Information
                </h1>

                {/* Filters */}
                <Row  className='d-flex mb-3' container spacing={2} md={12}>
                    <Col item xs={12} sm={4} md={4}>
                    <Form item xs={12} sm={4} md={4}>
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
                    </Form>
                    </Col>
                    <Col item xs={12} sm={4} md={4}>

                    <Form item xs={12} sm={4} md={4}>
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
                    </Form>
                    </Col>

                
                </Row>

                {/* Table */}
                <div  className="container-fluid" component={Paper}>
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr  >
                            <th className='text-center' style={{ backgroundColor: '#E10174' }}><strong  >SI No</strong></th>
                                <th className='text-center' style={{ backgroundColor: '#E10174' }}><strong >Market</strong></th>
                                <th className='text-center' style={{ backgroundColor: '#E10174' }}><strong >Openings</strong></th>
                                <th className='text-center' style={{ backgroundColor: '#E10174' }}><strong >Posted By</strong></th>
                                <th className='text-center' style={{ backgroundColor: '#E10174' }}><strong >Created At</strong></th>
                                <th className='text-center' style={{ backgroundColor: '#E10174' }}><strong >Deadline</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMarkets.map((market,index) => (
                                <TableRow key={market.id}>
                                     <td className='text-center'>{index+1}</td>
                                    <td className='text-center'>{market.name}</td>
                                    <td className='text-center'>{market.openings}</td>
                                    <td className='text-center'>{market.posted_by}</td>
                                    <td className='text-center'>{new Date(market.created_at).toLocaleDateString('en-US')}</td>
                                    <td className='text-center'>{new Date(market.deadline).toLocaleDateString('en-US')}</td>
                                </TableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Row>
        </Container>
    );
};

export default JobInfo;

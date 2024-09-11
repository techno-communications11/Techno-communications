import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, styled } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MarketJobOpenings = () => {
    const apiurl = process.env.REACT_APP_API;
    const [markets, setMarkets] = useState([]);

    useEffect(() => {
        // Fetch data from the API
        const fetchMarketJobs = async () => {
            try {
                const response = await fetch(`${apiurl}/getmarketjobs`);
                const data = await response.json();
                setMarkets(data);
            } catch (error) {
                console.error('Error fetching market job openings:', error);
            }
        };

        fetchMarketJobs();
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom className='p-2'>
                JOB OPENINGS BY MARKET
            </Typography>
            <Grid container spacing={4}>
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
                                    <Typography variant="body2" color="textSecondary" ml={1} style={{ color: "red", fontSize: "20px" }}>
                                        Deadline: {new Date(market.deadline).toLocaleDateString('en-US')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MarketJobOpenings;

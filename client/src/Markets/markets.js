import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';

const MarketJobOpenings = () => {
  const apiurl = process.env.REACT_APP_API;
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const fetchMarketJobs = async () => {
      try {
        const response = await axios.get(`${apiurl}/getmarketjobs`, { withCredentials: true });
        const data = response.data;
        setMarkets(data);
      } catch (error) {
        console.error('Error fetching market job openings:', error);
      }
    };

    fetchMarketJobs();
  }, []);

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 }, // Responsive padding
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e7ff 100%)', // Subtle gradient background
        minHeight: '100vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#1a237e', // Deep indigo color
          fontSize: { xs: '1.8rem', sm: '2.5rem' }, // Responsive font size
          textTransform: 'uppercase',
          letterSpacing: '2px',
          mb: 4,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        }}
      >
        Job Openings by Market
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {markets.map((market) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={market.id}>
            <Card
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '15px', // Rounded corners
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Soft shadow
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover animation
                '&:hover': {
                  transform: 'translateY(-5px)', // Lift effect on hover
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)', // Deeper shadow on hover
                },
                border: '1px solid #e0e0e0', // Subtle border
                overflow: 'hidden', // Ensure content stays within rounded corners
              }}
            >
              <CardContent
                sx={{
                  padding: '20px',
                  textAlign: 'center', // Center-align content
                  background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)', // Subtle card gradient
                }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: '600',
                    color: '#2c3e50', // Dark slate color
                    fontSize: '1.5rem',
                    mb: 1,
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis', // Handle long market names
                  }}
                >
                  {market.name}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: '#1976d2', // MUI primary blue
                    fontWeight: '500',
                    fontSize: '1.2rem',
                    mb: 2,
                    background: 'rgba(25, 118, 210, 0.1)', // Light blue background
                    borderRadius: '5px',
                    padding: '5px 10px',
                    display: 'inline-block',
                  }}
                >
                  {market.openings} Openings
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={2}
                  sx={{
                    background: 'rgba(255, 82, 82, 0.1)', // Light red background for deadline
                    borderRadius: '5px',
                    padding: '5px 10px',
                  }}
                >
                  <AccessTimeIcon
                    sx={{
                      color: '#ff5252', // Red icon to match deadline
                      mr: 1,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#ff5252', // Red text for urgency
                      fontWeight: '500',
                      fontSize: '1rem',
                    }}
                  >
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
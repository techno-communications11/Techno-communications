import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Row } from 'react-bootstrap';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import DetailedView from './DetailedView'
import Hired from './Hired'
import Pending from './Pending';
function TabPanel(props) {

    
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function HrTabs() {
    const [value, setValue] = useState(0);
    const [trainerCount, setTrainerCount] = useState(0); // State to hold the trainer count
    const apiurl = process.env.REACT_APP_API;
    const userData = decodeToken();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Fetch trainer feedback applicants count when component mounts
    useEffect(() => {
        const assignedToInterviewer = async () => {
            try {
                const response = await axios.get(`${apiurl}/users/${userData.id}/trainerfeedbackapplicants`, {
                    headers: getAuthHeaders()
                });
                if (response.status === 200) {
                    // Assuming the response contains a field `count` for trainer feedback applicants
                    setTrainerCount(response.data.count || 0); 
                }
            } catch (err) {
                console.error('Error fetching trainer feedback applicants:', err);
            }
        };
        assignedToInterviewer();
    }, [apiurl, userData.id]);

    

    return (
        <Container className="mt-4">
            <Row>
                <Tabs
                    value={value}
                    onChange={handleChange} 
                    aria-label="centered tabs"
                >
                    <Tab label="Interviewed Applicants    " {...a11yProps(0)} />
                    <Tab label="Pending Applicants" {...a11yProps(1)} />
                    <Tab label="Hired Applicants" {...a11yProps(2)} />
                    
                </Tabs>
            </Row>

            <TabPanel value={value} index={0}>
                <DetailedView />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Pending />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Hired />
            </TabPanel>

           
        </Container>
    );
}

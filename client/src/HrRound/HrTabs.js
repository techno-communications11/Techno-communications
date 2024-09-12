import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Row } from 'react-bootstrap';
import HrNew from './HrNew';
import TrainerRes from './TrainerRes';
import io from 'socket.io-client';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import Badge from '@mui/material/Badge';

// const socket = io('http://localhost:5000'); // Replace with your backend URL if necessary

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
    useEffect(() => {
        const assignedToInterviewer = async () => {
            try {
                const response = await axios.get(`${apiurl}/users/${userData.id}/trainerfeedbackapplicants`, {
                    headers: getAuthHeaders()
                });


            } catch (err) {
                console.log(err);
            }
        };
        assignedToInterviewer();
    }, [apiurl, userData.id, setTrainerCount]);
    // useEffect(() => {
    //     // Listen for 'trainerfeedbackcount' event from the server
    //     socket.on('trainerfeedbackcount', (data) => {

    //         setTrainerCount(data); // Update state with new counts
    //         console.log(data, "couningguornggggggg")
    //     });

    //     // Cleanup the event listener on component unmount
    //     return () => {
    //         socket.off('trainerfeedbackcount');
    //     };
    // }, []);


    return (
        <Container className='mt-4'>
            <Row>
                <Tabs value={value} onChange={handleChange} aria-label="centered tabs">
                    <Tab label="Interview Profiles" {...a11yProps(0)} />
                    {/* Display trainer count with Badge */}
                    <Tab className='gap-2'
                        label={
                            <Badge badgeContent={trainerCount} color="error" overlap="rectangular" className='p-1' >
                                Trainers Updates
                            </Badge>
                        }
                        {...a11yProps(1)}
                    />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <HrNew />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <TrainerRes />
                </TabPanel>
            </Row>
        </Container>
    );
}

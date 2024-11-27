import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Row, Form, Col } from 'react-bootstrap'; // Imported Form, Button, and Col for Bootstrap styling
import New from './New';
import Interviewedprofiles from './InterviewedProfiles';
import Button from '@mui/material/Button';

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

export default function CenteredTabs() {
    const apiurl = process.env.REACT_APP_API;
    const [value, setValue] = useState(0);
    const [mobileNumber, setMobileNumber] = useState(''); // State to hold mobile number
    const [applicantDetails, setApplicantDetails] = useState(null); // State to hold fetched applicant details

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSearch = async () => {
        // Replace with the actual API call to fetch applicant details by mobile number
        try {
            // console.log("mobileNumber", mobileNumber)
            const response = await fetch(`${apiurl}/getstatusnyphone/${mobileNumber}`);
            const data = await response.json();
            setApplicantDetails(data);
            // console.log("data", data)
        } catch (error) {
            console.error('Error fetching applicant details:', error);
        }
    };

    return (
        <Container className='mt-4'>
            {/* Search Bar */}
            <Form className='mb-3'>

                <Row className='align-items-center'>
                    <Row className='text-start'>    <p>Want To Check Applicant Status ?   </p></Row>
                    <Col xs="auto">
                        <Form.Label htmlFor="mobileNumber" visuallyHidden>
                            Mobile Number to check Applicant status
                        </Form.Label>
                        <Form.Control
                            type="text"
                            id="mobileNumber"
                            placeholder="Enter mobile number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button onClick={handleSearch} variant="outlined">
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* Display applicant details if available */}
            {applicantDetails && (
                <Box mb={3}>
                    <Typography variant="h6">Applicant Details</Typography>
                    <Typography ><span style={{ color: "blue" }}>Name:</span> {applicantDetails.name}</Typography>
                   
                    <Typography><span style={{ color: "blue" }}>Status:</span>  {applicantDetails.status}</Typography>
                    <Typography><span style={{ color: "blue" }}>Screening Manager</span> {applicantDetails.screening_manager_name
                    }</Typography>

                    {/* Close and Refresh Button */}
                    <Button
                        variant="text" // Inline text button
                        color="primary" // You can choose the color
                        onClick={() => {
                            // Clear the applicantDetails state
                            setApplicantDetails(null);
                            setMobileNumber("")


                            // Reload the page or perform other necessary actions

                        }}
                        sx={{ marginTop: 2 }} // Adds spacing from the content above
                    >
                        Close
                    </Button>
                </Box>
            )}
            {/* Tabs and Tab Panels */}
            <Row>
                <Tabs value={value} onChange={handleChange} aria-label="centered tabs">
                    <Tab label="Screening Profiles" {...a11yProps(0)} />
                    <Tab label="Interviewed profiles" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <New />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Interviewedprofiles />
                </TabPanel>
            </Row>
        </Container>
    );
}

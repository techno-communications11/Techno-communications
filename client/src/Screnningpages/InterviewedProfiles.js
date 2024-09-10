import React, { useEffect, useState } from 'react';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { Modal, Form, Dropdown } from 'react-bootstrap';
// import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from 'react-toastify';
import { IconButton, Tooltip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DataGrid } from '@mui/x-data-grid';
import Accordion from 'react-bootstrap/Accordion';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Button } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ConfirmationModal from "../pages/Confirm"
import TextField from '@mui/material/TextField';  // Import TextField here
const statuses = [
    'pending at Screening',
    'no show at Screening',
    'rejected at Screening',
    'moved to Interview',
    'no show at Interview',
    'rejected at Interview',
    'selected at Interview',
    'no show at Hr',
    'selected at Hr',
    'rejected at Hr',
    'Sent for Evaluation',
    'need second opinion at Interview',
    'put on hold at Interview',
    'Applicant will think about It',
    'Not Interested at screening',
];
export default function InterviewedProfiles() {
    const apiurl = process.env.REACT_APP_API;
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [comment, setComment] = useState('');
    const [hrs, setHrs] = useState([]);
    const [calendlyUrl, setCalendlyUrl] = useState('');
    const [selectedHost, setSelectedHost] = useState(null);
    const [showMoreModel, setShowMoreModel] = useState(false);
    const [showDateModel, setShowDateModel] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [interviewers, setInterviewers] = useState([]);
    const [firstRound, setFirstRound] = useState([])
    const [row, setRow] = useState(null);
    const [confirmassiging, setConfirmassiging] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiurl}/users/${userData.id}/applicantsatalllevel`, {
                    headers: getAuthHeaders(),
                });


                setProfiles(response.data);
                console.log(response.data)
                setFilteredProfiles(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [apiurl, userData.id]);
    profiles.forEach((profile) => {
        profile.button = "more";
    });


    useEffect(() => {
        const fetchHrs = async () => {
            try {
                const response = await axios.get(`${apiurl}/hrs`, {
                    headers: getAuthHeaders(),
                });
                if (response.status === 200) {
                    setHrs(response.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        const fetchInterviewers = async () => {
            try {
                const response = await axios.get(`${apiurl}/interviewer`, {
                    headers: getAuthHeaders()
                })
                if (response.status === 200) {
                    setInterviewers(response.data);
                }

            } catch (err) {
                console.log(err);
            }
        }
        fetchHrs();
        fetchInterviewers();
    }, [apiurl, userData.id]);

    const handleFilterClick = () => {
        setShowFilterModal(true);
    };


    const fetchingresponse = async (applicantId) => {


        try {
            const response = await axios.get(`${apiurl}/first_round_res/${applicantId}`);

            // Check if the response status is 200 and data is an array with at least one element
            if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
                setFirstRound(response.data[0]);
                setRow(response.data[0]);
                setShowMoreModel(true);

            } else {
                // If no data found, set a message or handle it accordingly
                setFirstRound({ message: "No data found" });
                console.log("No data found");
                setRow({ message: "null" });
            }
        } catch (err) {
            // Handle and log specific error details
            if (err.response) {
                toast.error("no previous records found")
                // Server responded with a status other than 200
                console.log("Error response:", err.response.status, err.response.data);
            } else if (err.request) {
                // Request was made but no response received
                console.log("No response received", err.request);
            } else {
                // Something else caused the error
                console.log("Error", err.message);
            }

            // Set a message in case of an error
            setFirstRound({ message: "No previous records found" });
        }
    };




    const handleFilterApply = (status) => {
        setSelectedStatus(status);
        if (status === '') {
            setFilteredProfiles(profiles);
        } else {
            setFilteredProfiles(profiles.filter(profile => profile.status === status));
        }
        setShowFilterModal(false);
    };
    const handleShowModal = (profile) => {
        setSelectedProfile(profile);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setSelectedProfile(null);
        setComment('');
        setShowMoreModel(false);
        setSelectedDateTime("");
        setCalendlyUrl('');
        setShowCalendlyModal(false);
        setShowDateModel(false);
        setSelectedHost("");
    };

    const handleSelectHost = async (eventKey) => {
        const selectedhr = hrs.find(hr => hr.name === eventKey);
        const selectedInterviewer = interviewers.find(interviewer => interviewer.name === eventKey);

        // Check if either HR or Interviewer is selected and has an email before proceeding
        if (selectedhr || selectedInterviewer) {
            const selectedHost = selectedhr || selectedInterviewer;
            const calendlyUsername = selectedHost.email?.trim().split(/[@.]/).join('-').slice(0, -4);

            if (selectedHost) {
                setSelectedHost(selectedHost);
            }

            // Only proceed with Calendly URL if the host has an email
            if (calendlyUsername) {
                const calendlyUrl = `https://calendly.com/${calendlyUsername}`;
                setShowCalendlyModal(true);
                setCalendlyUrl(calendlyUrl);
            } else {
                console.error('Selected host does not have a valid email for Calendly URL.');
            }
        } else {
            console.error('No HR or interviewer selected.');
        }
    };




    const handleShowNext = () => {
        setShowDateModel(true);
        setShowModal(false);

    };
    const handleDateTimeSave = async () => {
        console.log(selectedHost, 'hosts');
        console.log(selectedDateTime, selectedProfile.applicant_uuid);

        if (!selectedDateTime) {
            toast.error('Please select a date and time.');
            return;
        }
        const now = new Date();
        if (selectedDateTime <= now) {
            toast.error("Please select a date and time in the future.");
            return;
        }


        try {
            const hrNames = hrs.map(hr => hr.name);

            console.log("selectedHost.name..................", selectedHost.name)
            const url = hrNames.includes(selectedHost.name)
                ? `${apiurl}/assigntohr`
                : `${apiurl}/assign-interviewer`;

            const payload = {
                applicant_uuid: selectedProfile ? selectedProfile.applicant_uuid : null,

            };
            console.log(hrs, "hrsssssssssssssss....")
            // Dynamically add hr_id or interviewer_id based on the condition
            if (hrNames.includes(selectedHost.name)) {
                console.log(hrs, "hrsssssssssssssss....", selectedHost.name);
                payload.hr_id = selectedHost ? selectedHost.id : null;
                payload.time_of_hrinterview = selectedDateTime ? selectedDateTime.toISOString() : null;
                console.log("hrs table payload", payload, url);
                console.log("payload category", payload, url);

            } else {
                payload.interviewer_id = selectedHost ? selectedHost.id : null;
                payload.time_of_interview = selectedDateTime ? selectedDateTime.toISOString() : null
                console.log("interviewer table paload")
                console.log("palyed catogory", payload, url)
            }

            const response = await axios.post(url, payload, {
                headers: getAuthHeaders(),
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setSelectedDateTime("")
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Error scheduling interview');
        } finally {
            handleCloseModal();
        }
    };

    const columns = [
        { field: 'applicant_name', headerName: 'Name', width: 130 },
        { field: 'applicant_phone', headerName: 'Phone', width: 150 },
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'applicant_uuid', headerName: 'UUID', width: 100 },
        { field: 'applicant_email', headerName: 'email', width: 200 },
        {
            field: 'status',
            headerName: 'Action',
            width: 300,
            renderCell: (params) => (
                <Button
                    style={getButtonStyle(params.value)}
                    onClick={() => handleShowModal(params.row)}
                >
                    {params.value}
                </Button>
            ),
        },
        {
            field: 'button',
            headerName: 'View',
            width: 150,
            renderCell: (params) => (
                <Button variant="contained" onClick={() => fetchingresponse(params.row.applicant_uuid)}>
                    View
                </Button>
            ),
        },
    ];


    const renderModalContent = () => {
        if (!selectedProfile) return null;

        if (['selected at Interview', 'no show at Hr'].includes(selectedProfile.status)) {
            return (
                <div>
                    {!showCalendlyModal ? (
                        <Form>
                            <Form.Group controlId="formHRSelection">
                                <Form.Label>Select HR</Form.Label>
                                <Dropdown onSelect={handleSelectHost}>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {selectedHost ? selectedHost.name : 'Select HR'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {hrs.map(hr => (
                                            <Dropdown.Item key={hr.id} eventKey={hr.name}>
                                                {hr.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        </Form>
                    ) : (
                        <div className="d-flex justify-content-between">
                            <div className="flex-grow-1 me-2">
                                <iframe
                                    src={calendlyUrl}
                                    width="500"
                                    height="500"
                                    frameBorder="0"
                                    title="Calendly Scheduling"
                                    className="h-300"
                                ></iframe>
                            </div>
                            <div className="flex-grow-1 ms-2">
                                <Form.Group controlId="dateTime" className=" h-50 p-4 ">
                                    <Modal.Title className='fs-5 mb-2'>Select Date & Time</Modal.Title>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            value={selectedDateTime}
                                            onChange={(date) => setSelectedDateTime(date)}
                                            renderInput={(params) => <TextField {...params} />}
                                            className="form-control w-100"
                                        />
                                    </LocalizationProvider>
                                    <Button className='w-100 mt-2 bg-primary  text-white' onClick={() => setConfirmassiging(true)}>
                                        Assign to Hr
                                    </Button>
                                </Form.Group>
                                <ConfirmationModal
                                    show={confirmassiging}
                                    handleClose={() => setConfirmassiging(false)}
                                    handleConfirm={handleDateTimeSave}
                                    message={'Have you scheduled the HR interview in the calendar? Please confirm before submitting.'}
                                />
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (['no Response at Screening', 'no show at Interview', 'need second opinion at Interview', 'put on hold at Interview'].includes(selectedProfile.status)) {
            return (
                <div>
                    {!showCalendlyModal ? (
                        <Form>
                            <Form.Group controlId="formHRSelection">
                                <Form.Label>Select Interviewer</Form.Label>
                                <Dropdown onSelect={handleSelectHost}>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {selectedHost ? selectedHost.name : 'Select Interviewer'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {interviewers.map(Interviewer => (
                                            <Dropdown.Item key={Interviewer.id} eventKey={Interviewer.name}>
                                                {Interviewer.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        </Form>
                    ) : (
                        <div className="d-flex justify-content-between">
                            <div className="flex-grow-1 me-2">
                                <iframe
                                    src={calendlyUrl}
                                    width="500"
                                    height="500"
                                    frameBorder="0"
                                    title="Calendly Scheduling"
                                    className="h-300"
                                ></iframe>
                            </div>
                            <div className="flex-grow-1 ms-2">
                                <Form.Group controlId="dateTime" className=" h-50 p-4 ">
                                    <Modal.Title className='fs-5 mb-2'>Select Date & Time</Modal.Title>
                                    <DateTimePicker
                                        value={selectedDateTime}
                                        onChange={(date) => setSelectedDateTime(date)}
                                        renderInput={(params) => <TextField {...params} />}
                                        className="form-control w-100"
                                    />
                                    <Button className='w-100 mt-2  bg-primary  text-white' onClick={() => setConfirmassiging(true)}>
                                        Assign to Interviewer
                                    </Button>
                                </Form.Group>
                                <ConfirmationModal
                                    show={confirmassiging}
                                    handleClose={() => setConfirmassiging(false)}
                                    handleConfirm={handleDateTimeSave}
                                    message={'Have you scheduled the interview in the calendar? Please confirm before submitting.'}
                                />
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };


    const getButtonStyle = (status) => {
        switch (status) {
            case 'pending at Screening':
                return { backgroundColor: '#FFA500', color: 'white' };
            case 'no show at Screening':
            case 'no show at Interview':
            case 'no show at Hr':
                return { backgroundColor: '#ff0000', color: 'white' };
            case 'rejected at Screening':
            case 'rejected at Interview':
            case 'rejected at Hr':
                return { backgroundColor: '#FF6347', color: 'white' };
            case 'moved to Interview':
            case 'selected at Interview':
            case 'selected at Hr':
                return { backgroundColor: '#32CD32', color: 'white' };
            case 'Sent for Evaluation':
                return { backgroundColor: '#4682B4', color: 'white' };
            case 'need second opinion at Interview':
                return { backgroundColor: '#FFD700', color: 'black' };
            case 'put on hold at Interview':
                return { backgroundColor: '#6A5ACD', color: 'white' };
            case 'Applicant will think about It':
                return { backgroundColor: '#DAA520', color: 'white' };
            case 'Not Interested at screening':
                return { backgroundColor: '#A9A9A9', color: 'white' };
            default:
                return { backgroundColor: '#808080', color: 'white' };
        }
    };

    const getRowId = (row) => row.applicant_id;
    const getStatusOptions = (category) => {
        switch (category) {
            case 'Screening':
                return ['pending at Screening',
                    'no Response at Screening',
                    'rejected at Screening',
                    'Not Interested at screening',];
            case 'Interview':
                return ['moved to Interview',
                    'no show at Interview',
                    'rejected at Interview',
                    'selected at Interview',
                    'need second opinion at Interview',
                    'put on hold at Interview',];
            case 'HR':
                return ['no show at Hr',
                    "Moved to HR",
                    'selected at Hr',
                    'rejected at Hr',
                    'Sent for Evaluation',
                    'Applicant will think about It',];
            default:
                return [];
        }
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSelectedStatus(''); // Reset the status dropdown when category changes
    };

    const applyFilters = () => {
        const filtered = profiles.filter(profile => {
            return (selectedCategory ? profile.category === selectedCategory : true) &&
                (selectedStatus ? profile.status === selectedStatus : true);
        });
        setFilteredProfiles(filtered);
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Applicant Profiles</h5>

                    <div className="d-flex align-items-center m-2">

                        <div style={{ position: 'relative', marginRight: '15px' }}>
                            <Form.Control
                                as="select"
                                value={selectedCategory}
                                onChange={handleCategoryChange}  // Category change handler
                                style={{
                                    width: '250px',
                                    padding: '8px 12px',
                                    border: 'solid 1px #ced4da',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="">SELECT CATEGORIES</option>
                                <option value="Screening">Screening</option>
                                <option value="Interview">Interview</option>
                                <option value="HR">HR</option>
                            </Form.Control>
                            <ArrowDropDownIcon style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>

                        <div style={{ position: 'relative', marginRight: '15px' }}>
                            <Form.Control
                                as="select"
                                value={selectedStatus}
                                onChange={(e) => handleFilterApply(e.target.value)}  // Status change handler
                                style={{
                                    width: '250px',
                                    padding: '8px 12px',
                                    border: 'solid 1px #ced4da',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="">SELECT STATUS</option>
                                {getStatusOptions(selectedCategory).map((status, index) => (
                                    <option key={index} value={status}>
                                        {status.toUpperCase()}
                                    </option>
                                ))}
                            </Form.Control>
                            <ArrowDropDownIcon style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>

                        <Tooltip title="Filter Profiles"></Tooltip>
                    </div>


                </div>


                {/* Filter Modal */}
                <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Filter Profiles</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="filterStatus">
                                <Form.Label>Select Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedStatus}
                                    onChange={(e) => handleFilterApply(e.target.value)}
                                >
                                    <option value="">All</option>
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status.toUpperCase()} </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="m-1" variant="contained" color="secondary" onClick={() => setShowFilterModal(false)}>
                            Close
                        </Button>
                        <Button variant="contained" color="success" onClick={() => handleFilterApply(selectedStatus)}>
                            Apply Filter
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div style={{ height: 420, width: '100%' }}>
                    <DataGrid
                        rows={filteredProfiles}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        getRowId={getRowId}
                    />
                </div>

                <Modal backdrop='static' show={showModal && selectedProfile && [
                    'no show at Hr',
                    'no Response at Screening',
                    'no show at Interview',
                    'need second opinion at Interview',
                    'put on hold at Interview',
                    'need second opinion at Interview',
                    'selected at Interview'
                ].includes(selectedProfile.status)} onHide={handleCloseModal} size='lg'>
                    <Modal.Header closeButton >
                        <Modal.Title>{`Action for ${selectedProfile?.status}`}</Modal.Title>

                    </Modal.Header>
                    <Modal.Body>{renderModalContent()}</Modal.Body>
                    {/* {selectedHost && (
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleShowNext}>Next</Button>
                        </Modal.Footer>
                    )} */}
                </Modal>
                <Modal show={showMoreModel} onHide={handleCloseModal} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Interview results of applicant_uuid:  {row?.applicant_uuid || 'Unknown Applicant'}
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex">
                            <div className=" pe-2" style={{ width: '25rem' }}>
                                <Accordion defaultActiveKey="0" className="mt-4">
                                    {Object.entries(firstRound).slice(0, Math.ceil(Object.entries(firstRound).length / 3)).map(([key, value], index) => (
                                        <Accordion.Item eventKey={index.toString()} key={index}>
                                            <Accordion.Header>{key}</Accordion.Header>
                                            <Accordion.Body>
                                                {value ? value.toString() : 'No data available'}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </div>
                            <div className=" px-2" style={{ width: '25rem' }}>
                                <Accordion defaultActiveKey="0" className="mt-4">
                                    {Object.entries(firstRound).slice(Math.ceil(Object.entries(firstRound).length / 3), 2 * Math.ceil(Object.entries(firstRound).length / 3)).map(([key, value], index) => (
                                        <Accordion.Item eventKey={(index + Math.ceil(Object.entries(firstRound).length / 3)).toString()} key={index + Math.ceil(Object.entries(firstRound).length / 3)}>
                                            <Accordion.Header>{key}</Accordion.Header>
                                            <Accordion.Body>
                                                {value ? value.toString() : 'No data available'}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </div>
                            <div className=" ps-2" style={{ width: '25rem' }}  >
                                <Accordion defaultActiveKey="0" className="mt-4">
                                    {Object.entries(firstRound).slice(2 * Math.ceil(Object.entries(firstRound).length / 3)).map(([key, value], index) => (
                                        <Accordion.Item eventKey={(index + 2 * Math.ceil(Object.entries(firstRound).length / 3)).toString()} key={index + 2 * Math.ceil(Object.entries(firstRound).length / 3)}>
                                            <Accordion.Header>{key}</Accordion.Header>
                                            <Accordion.Body>
                                                {value ? value.toString() : 'No data available'}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>





                <ToastContainer />
            </div>
        </LocalizationProvider>
    );
}

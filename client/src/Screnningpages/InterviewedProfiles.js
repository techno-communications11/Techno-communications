import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { Container, Row, Col, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from 'react-toastify';
function Interviewedprofiles({ setApplicant_uuid }) {
    const apiurl = process.env.REACT_APP_API;
    const navigate = useNavigate();
    const userData = decodeToken();
    // const [profiles, setProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [comment, setComment] = useState('');
    const [moveForwardMenu, setMoveForwardMenu] = useState(false);
    // const [ChangeScrenningMenu, setChangeScrenningMenu] = useState(false);
    // const [hosts, setHosts] = useState([]);
    const [hrs, setHrs] = useState([]);
    // const [screeners, setScreeners] = useState([]);
    const [calendlyUrl, setCalendlyUrl] = useState('');
    const [selectedHost, setSelectedHost] = useState(null);
    const [showdateModel, setShowDateModel] = useState(false);
    // const HrData = {}; // Add your logic to fetch HrData
    const [selectedDateTime, setSelectedDateTime] = useState(null);

    useEffect(() => {
        const assignedToInterviewer = async () => {
            try {
                const response = await axios.get(`${apiurl}/hrs`, {
                    headers: getAuthHeaders()
                });
                if (response.status === 200) {
                    setHrs(response.data);
                    // console.log("hrs", hrs)
                }
            } catch (err) {
                console.log(err);
            }
        };
        assignedToInterviewer();
    }, [apiurl, userData.id]);

    // const handleInterviewClick = (profile) => {
    //     setApplicant_uuid(profile.applicant_uuid);
    //     navigate("/hrinterview");
    // };
    const formData = {
        applicant_uuid: selectedProfile ? selectedProfile.applicant_uuid : null,
        interviewer_id: selectedHost ? selectedHost.id : null,
        time_of_interview: selectedDateTime ? selectedDateTime.toISOString() : null,
    };
    //   console.log(formData,"date")

    const handleShowModal = (profile) => {
        console.log(profile, "hrs pre")
        setSelectedProfile(profile);
        setShowModal(true);
    };

    // const handleCloseModal = () => {
    //     setShowModal(false);
    //     setSelectedProfile(null);
    //     setComment('');
    // };

    // const handleShowCalendlyModal = () => {
    //     setShowCalendlyModal(true);
    //      // Replace with your actual Calendly URL
    // };

    // const handleActionClick = (profileId, actionType) => {
    //     // Add your action handling logic here
    //     console.log(`Profile ID: ${profileId}, Action: ${actionType}, Comment: ${comment}`);
    //     handleCloseModal();
    // };

    const handleSelectHost = async (eventKey) => {
        const selected = hrs.find(hrs => hrs.name === eventKey);
        setSelectedHost(selected);
        console.log(selected)
        if (selected) {
            const calendlyUrl = "https://calendly.com/ptharun-techno-communications";
            setCalendlyUrl(calendlyUrl);
            setShowCalendlyModal(true);
        }
    };
    const handleShowNext = () => {
        setShowDateModel(true);
    }

    const handleCloseModal = () => {
        setSelectedProfile(null);
        setComment('');
        setShowModal(false);
        setComment('');
        setCalendlyUrl('');
        setShowCalendlyModal(false);
        setShowDateModel(false)
    };

    // const handleSelect = (eventKey) => {
    //     console.log('Selected screener:', eventKey);
    //     // Add logic to handle the selected screener
    // };

    const handleMoveForwardMenuToggle = (show) => {
        setMoveForwardMenu(show);
    };

    const handleDateTimeSave = async () => {
        toast.success(`interview Shceduled succusfully! `);
        try {
            const response = await axios.post(`${apiurl}/assign-interviewer`, formData, {
                headers: getAuthHeaders(),
            })
            if (response.status === 200) {
                console.log(formData)
                toast.success(`interview Shceduled succusfully! `);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error();
        } finally {
            handleCloseModal();
        }
    };

    // const handleChangeScrenningToggle = (show) => {
    //     setChangeScrenningMenu(show);
    // };
    const actionButtonStyles = {
        pending: { backgroundColor: '#FFA500', color: 'white' }, // Orange
        noShow: { backgroundColor: '#FF0000', color: 'white' }, // Red
        rejected: { backgroundColor: '#FF6347', color: 'white' }, // Tomato
        selected: { backgroundColor: '#32CD32', color: 'white' } // LimeGreen
    };
    const getButtonStyle = (status) => {
        switch (status) {
            case 'Pending at Screening':
                return actionButtonStyles.pending;
            case 'No Show at Interview':
                return actionButtonStyles.noShow;
            case 'Rejected at Interview':
                return actionButtonStyles.rejected;
            case 'Selected at Interview':
                return actionButtonStyles.selected;
            default:
                return {};
        }
    };

    const profiles = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', referBy: 'Jane Smith', referedId: 'JS123', createdAt: '2024-08-01', status: 'Pending at Interview' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', phone: '098-765-4321', referBy: 'John Smith', referedId: 'JS456', createdAt: '2024-08-02', status: 'No Show at Interview' },
        { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-123-4567', referBy: 'Emily Davis', referedId: 'ED789', createdAt: '2024-08-03', status: 'Rejected at Interview' },
        { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', phone: '555-987-6543', referBy: 'Michael Green', referedId: 'MG321', createdAt: '2024-08-04', status: 'Selected at Interview' },
        { id: 5, name: 'Charlie White', email: 'charlie.white@example.com', phone: '555-567-8901', referBy: 'Sarah Wilson', referedId: 'SW654', createdAt: '2024-08-05', status: 'Pending at Interview' },
        { id: 6, name: 'Diana Black', email: 'diana.black@example.com', phone: '555-678-9012', referBy: 'David Lee', referedId: 'DL987', createdAt: '2024-08-06', status: 'Selected at Interview' }
    ];

    return (
        <div>
            <Row>
                <Col>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                {['SC.NO', 'Name', 'Email', 'Phone', 'Referred By', 'Reference NTID', 'Created At', 'Action'].map((header, index) => (
                                    <th key={index} style={{ backgroundColor: '#E10174', color: 'white' }}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{profile.name}</td>
                                    <td>{profile.email}</td>
                                    <td>{profile.phone}</td>
                                    <td>{profile.referBy}</td>
                                    <td>{profile.referedId}</td>
                                    <td>{profile.createdAt}</td>
                                    <td>
                                        <Button
                                            className="btn btn-primary shadow-none fw-bold"
                                            style={getButtonStyle(profile.status)}
                                            onClick={() => handleShowModal(profile)}
                                        >
                                            {profile.status}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Col>
            </Row>

            {/* Modal for Actions */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Action for {selectedProfile?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="comment" className="mx-5">
                            <Form.Label className="fw-bolder">Comment<sup className="fs-6 text-danger">*</sup></Form.Label>
                            <Form.Control
                                className="border-dark"
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>
                        <div className="d-flex mx-5 flex-column flex-md-row justify-content-around mt-3">

                            <Dropdown onSelect={handleSelectHost} show={moveForwardMenu} onToggle={handleMoveForwardMenuToggle}>
                                <Dropdown.Toggle className="w-100 bg-transparent text-dark border-secondary" id="dropdown-basic">
                                    Move Forward
                                </Dropdown.Toggle>
                                {hrs &&
                                    <Dropdown.Menu className="w-100 overflow-auto" style={{ maxHeight: '200px' }}>
                                        {hrs.sort((a, b) => a.name.localeCompare(b.name)).map((hrs, index) => (
                                            <Dropdown.Item key={index} eventKey={hrs.name}>
                                                {hrs.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                }

                            </Dropdown>


                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>

            {/* Modal for Scheduling */}
            <Modal show={showCalendlyModal} onHide={() => setShowCalendlyModal(false)} size="lg">
                <Modal.Header></Modal.Header>
                <Modal.Body>
                    <Modal.Title>Schedule Meeting</Modal.Title>
                    <div className="text-center">
                        <iframe
                            src={calendlyUrl}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            title="Calendly Scheduling"
                            style={{ maxWidth: '100%' }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={handleShowNext}>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showdateModel} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Date and Time</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="dateTime">
                            <Form.Label>Date and Time</Form.Label>
                            <DatePicker
                                selected={selectedDateTime}
                                onChange={(date) => setSelectedDateTime(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="form-control"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleDateTimeSave(selectedProfile.id, 'Moved')}>Save</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default Interviewedprofiles;

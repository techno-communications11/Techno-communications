import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Dropdown, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../pages/loader.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Container, Row, Col } from 'react-bootstrap'
import { Button } from '@mui/material';
import ConfirmationModal from "../pages/Confirm"
// import { setTime } from 'react-datepicker/dist/date_utils';

function New() {
  let userData = decodeToken();
  const [profiles, setProfiles] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [screens, setScreens] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState('');
  const [moveForwardMenu, setMoveForwardMenu] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [hrs, setHrs] = useState([]);
  // const [screeners, setScreeners] = useState([]);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ChangeScrenningMenu, setChangeScrenningMenu] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [showdateModel, setShowDateModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmassiging, setConfirmassiging] = useState(false);
  const [actionToPerform, setActionToPerform] = useState('');
  // const [selectedProfile, setSelectedProfile] = useState(null);

  const newcount = profiles.length
  console.log("newcount", newcount)

  localStorage.setItem("newcount", newcount)

  const apiurl = process.env.REACT_APP_API;
  const HrData = decodeToken();

  const fetchData = async (url, setData, errorMessage) => {
    try {
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });
      setData(response.data);

    } catch (error) {
      setError(errorMessage);
    }
  };

  useEffect(() => {
    setLoading(true);

    fetchData(
      `${apiurl}/screening`,
      setScreens,
      'Failed to fetch hosts. Please try again later.'
    );

    fetchData(
      `${apiurl}/interviewer`,
      setHosts,
      'Failed to fetch hosts. Please try again later.'
    );

    fetchData(
      `${apiurl}/hrs`,
      setHrs,
      'Failed to fetch HRs. Please try again later.'
    );
    const getprofiles = async () => {

      try {
        const response = await axios.get(`${apiurl}/users/${userData.id}/applicants`, {
          headers: getAuthHeaders(),
        });

        setProfiles(response.data)
        console.log(profiles, "profoilesssssssssssssssssssssssssssswfhwbfh")

      } catch (error) {
        setError('Failed to fetch profiles. Please try again later.', error);
      }

    }
    getprofiles();

    setLoading(false);
  }, [5000]); // Add dependencies to avoid unnecessary re-renders



  const formData = {
    applicant_uuid: selectedProfile ? selectedProfile.applicant_uuid : null,
    interviewer_id: selectedHost ? selectedHost.id : null,
    time_of_interview: selectedDateTime ? selectedDateTime.toISOString() : null,

  };

  const handleShowModal = (profile) => {
    console.log("profile>>>>", profile);
    setSelectedProfile(profile);

    // Check if the email is null, undefined, or an empty string
    if (profile.applicant_email === null || profile.applicant_email === "" || profile.applicant_email === undefined) {
      setShowEmailModal(true);
    } else {
      setShowModal(true);
    }


  };


  const handleShowNext = () => {
    setShowDateModel(true);
    setShowCalendlyModal(false);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setComment('');
    setCalendlyUrl('');
    setShowCalendlyModal(false);
    setShowDateModel(false)
    setSelectedHost(false);
    setSelectedDateTime("")
    setShowEmailModal(false)
    setEmail("")
  };

  ///<---------------------------------------------- actions for reject, not intrest,no response------------------------------------------------------------------------>
  const handleAction = async (applicant_uuid, action) => {
    setActionToPerform(action);
    setSelectedProfile(applicant_uuid);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!comment.trim()) {
      return toast.error('Please enter a comment');
    }

    setShowConfirm(false);

    if (!selectedProfile) return;
    
    
    

    const payload = {
      applicant_uuid: selectedProfile,
      action: actionToPerform,
      comments: comment
    };
 console.log(payload,"payload")
    try {
      const response = await axios.post(`${apiurl}/updatestatus`, payload, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      handleCloseModal();
    }
  };






  const handleMoveForwardMenuToggle = () => {
    setMoveForwardMenu(!moveForwardMenu);
  };
  const handleChangeScrenningToggle = () => {
    setChangeScrenningMenu(!ChangeScrenningMenu);
  };
  const handleSelect = async (eventKey, applicant_uuid) => {
    const selected = screens.find(screen => screen.name === eventKey);

    setSelectedScreen(selected);

    if (selected) {
      const newUserId = selected.id;
      console.log(newUserId, "<<<<<<<<<<newUserId", applicant_uuid)
      try {
        console.log("apiurl>>>>>>", apiurl)
        const response = await axios.post(`${apiurl}/assignapplicanttoUser`, {
          newUserId: newUserId,
          applicantId: applicant_uuid
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        toast.error('Error occurred while Assigning  user');
      }
    }
  };

  const handleDateTimeSave = async () => {
    if (!selectedDateTime) {
      toast.error("Please select a date and time.");
      return;
    }


    const now = new Date();
    if (selectedDateTime <= now) {
      toast.error("Please select a date and time in the future.");
      return;
    }


    try {
      const response = await axios.post(`${apiurl}/assign-interviewer`, formData, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        console.log(formData);
        console.log("Message from server:", response.data.message); // Access message from response.data
        toast.success(response.data.message);
        setSelectedDateTime("")// Display the message from server
        setTimeout(() => {
          window.location.reload();
        }, 1800)

      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Check if the error response exists to display error message
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while updating status."); // Default error message
      }
    } finally {
      // handleCloseModal();
    }

  };

  const handleSelectHost = async (eventKey) => {
    const selected = hosts.find(host => host.name === eventKey);

    const calendlyUsername = selected.email.trim().split(/[@.]/).join('-').slice(0, -4);
    setSelectedHost(selected);
    if (selected) {
      const calendlyUrl = `https://calendly.com/${calendlyUsername}`;
      setCalendlyUrl(calendlyUrl);
      setShowCalendlyModal(true);

    }
  };
  // const formatTime = (date) => {
  //   return format(parseISO(date), 'EEE dd MMM yyyy HH:mm');
  // };




  const filteredProfiles = profiles.filter(profile => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return profile.applicant_name?.toLowerCase().includes(lowercasedTerm) ||
      profile.applicant_email?.toLowerCase().includes(lowercasedTerm) ||
      profile.applicant_phone?.toString().includes(lowercasedTerm) ||
      profile.created_at?.toLowerCase().includes(lowercasedTerm);
  });
  const sortedProfiles = [...filteredProfiles].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));


  const handleSubmitEmail = async () => {
    const payload = {
      applicant_uuid: selectedProfile.applicant_uuid,
      email,
    };

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return; // Stop execution if the email is invalid
    }

    console.log(payload, "update email");

    try {
      const response = await axios.post(`${apiurl}/updateemail`, payload, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setShowModal(true);
      setEmail("");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>

          <Form className="mb-4">
            <Form.Control
              className="m-auto border-black fw-bolder w-100 custom-placeholder"
              type="text"
              placeholder="Search by Name, Email, Phone, Market, or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <table className="table table-striped" >
            <thead>
              <tr>
                {['SC.NO', 'Name', 'Phone', 'Referred By', 'Reference NTID', 'Created At', 'Action'].map((header, index) => (
                  <th key={index} style={{ backgroundColor: '#E10174', color: 'white' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedProfiles.length > 0 ? (
                sortedProfiles.map((profile, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{profile.applicant_name}</td>
                    {/* <td>{profile.applicant_email}</td> */}
                    <td>{profile.applicant_phone}</td>
                    <td>{profile.referred_by}</td>
                    <td>{profile.reference_id}</td>
                    <td>{new Date(profile.created_at).toLocaleString('en-US', { hour12: true })}</td>

                    <td>
                      <Button variant='contained' onClick={() => handleShowModal(profile)}>Proceed</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No profiles available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Col>
      </Row>

      <Modal show={showEmailModal}
        onHide={handleCloseModal}
        size="md"
        backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Action for {selectedProfile?.applicant_uuid}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form>
            <Form.Group controlId="comment" className="mx-5">
              <Form.Label className="fw-bolder">Email<sup className="fs-6 text-danger">*</sup></Form.Label>
              <Form.Control
                className="border-dark mb-2"
                as="textarea"
                rows={1}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <div className='d-flex justify-content-center'>
              <Button variant="contained" color='success' className=' mt-2 ' onClick={handleSubmitEmail}>Update Email</Button>

            </div>
            <div className='d-flex justify-content-center m-2'>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleAction(selectedProfile.applicant_uuid, 'no show at Screening')}
              >
                No Show
              </Button>
              <ConfirmationModal
                    show={showConfirm}
                    handleClose={() => setShowConfirm(false)}
                    handleConfirm={handleConfirm}
                    message={`Are you sure you want to mark this applicant as ${actionToPerform}?`}
                  />

            </div>


          </Form>


        </Modal.Body>

      </Modal>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Action for {selectedProfile?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Conditional rendering based on showCalendlyModal */}
          {!showCalendlyModal ? (
            // Action Form
            <Form>
              <Form.Group controlId="comment" className="mx-5">
                <Form.Label className="fw-bolder">
                  Comment<sup className="fs-6 text-danger">*</sup>
                </Form.Label>
                <Form.Control
                  className="border-dark"
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex mx-5 flex-column flex-md-row justify-content-around mt-3">
                {/* Left Container for Action Buttons */}
                <Container>
                  <Row className="gap-2">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleAction(selectedProfile.applicant_uuid, 'rejected at Screening')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleAction(selectedProfile.applicant_uuid, 'no show at Screening')}
                    >
                      No Show
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAction(selectedProfile.applicant_uuid, 'Not Interested at screening')}
                    >
                      Not Interested
                    </Button>
                  </Row>
                  {/* Confirmation Modal */}
                  <ConfirmationModal
                    show={showConfirm}
                    handleClose={() => setShowConfirm(false)}
                    handleConfirm={handleConfirm}
                    message={`Are you sure you want to mark this applicant as ${actionToPerform}?`}
                  />
                </Container>


                {/* Right Container for Move Forward Button */}
                <Container>
                  <Row className="gap-2">
                    <Dropdown
                      onSelect={handleSelectHost}
                      show={moveForwardMenu}
                      onToggle={handleMoveForwardMenuToggle}
                    >
                      <Dropdown.Toggle className="w-100 bg-primary text-white border-secondary" id="dropdown-basic">
                        Move Forward
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-auto">
                        {hosts
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((host, index) => (
                            <Dropdown.Item
                              key={index}
                              eventKey={host.name}
                              className="bg-light text-dark"
                            >
                              {host.name}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown
                      onSelect={(eventKey) => {
                        if (selectedProfile) {
                          handleSelect(eventKey, selectedProfile.applicant_uuid); // Only call handleSelect if selectedProfile exists
                        } else {
                          console.error('selectedProfile is null or undefined');
                        }
                      }}
                      show={ChangeScrenningMenu}
                      onToggle={handleChangeScrenningToggle}
                    >
                      <Dropdown.Toggle className="w-100 bg-primary text-white border-secondary" id="dropdown-basic">
                        Change Assign To
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-auto">
                        {screens
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((screen, index) => (
                            <Dropdown.Item
                              key={index}
                              eventKey={screen.name}
                              className="bg-light text-dark"
                            >
                              {screen.name}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>

                  </Row>
                </Container>
              </div>
            </Form>
          ) : (
            // Calendly Modal for scheduling
            <Form>
              <div className="text-center mt-5">
                <div className="mb-3">{selectedHost?.name}</div>
                {/* Using d-flex to show iframe and date picker side by side */}
                <div className="d-flex justify-content-between align-items-start">
                  {/* Iframe Container */}
                  <div className="flex-grow-1 me-3">
                    <iframe
                      src={calendlyUrl}
                      width="100%"
                      height="500"
                      frameBorder="0"
                      title="Calendly Scheduling"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>

                  {/* Date Picker Container */}
                  <div className="flex-grow-1">

                    <Form.Group controlId="dateTime" className="my-3 w-100">
                      <p>Select date & Time</p>
                      <DatePicker
                        selected={selectedDateTime}
                        onChange={(date) => setSelectedDateTime(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        className="form-control"
                      />
                    </Form.Group>
                    <Button
                      variant="contained"
                      color="success"
                      className="mt-3"
                      onClick={() => setConfirmassiging(true)}
                    >
                      Assign to Interviewer
                    </Button>

                  </div>
                  <ConfirmationModal
                    show={confirmassiging}
                    handleClose={() => setConfirmassiging(false)}
                    handleConfirm={() => handleDateTimeSave(selectedProfile.id, 'Moved')}
                    message={'Have you scheduled the interview in the calendar? Please confirm before submitting.'}
                  />
                </div>

                {/* Button Below the Iframe and DatePicker */}
              </div>
            </Form>

          )}
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </Container>


  );
}

export default New;
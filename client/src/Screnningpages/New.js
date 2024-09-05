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
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState('');
  const [moveForwardMenu, setMoveForwardMenu] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [screeners, setScreeners] = useState([]);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ChangeScrenningMenu, setChangeScrenningMenu] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [showdateModel, setShowDateModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      `${apiurl}/users/${userData.id}/applicants`,
      setProfiles,
      'Failed to fetch profiles. Please try again later.'
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

    setLoading(false);
  }, [5000]); // Add dependencies to avoid unnecessary re-renders

  const formData = {
    applicant_uuid: selectedProfile ? selectedProfile.applicant_uuid : null,
    interviewer_id: selectedHost ? selectedHost.id : null,
    time_of_interview: selectedDateTime ? selectedDateTime.toISOString() : null,

  };

  const handleShowModal = (profile) => {
    setSelectedProfile(profile);

    setShowModal(true);
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
  };

  ///<---------------------------------------------- actions for reject, not intrest,no response------------------------------------------------------------------------>
  const handleAction = async (applicant_uuid, action) => {
    setActionToPerform(action);
    setSelectedProfile(applicant_uuid);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    if (!selectedProfile) return;

    const payload = {
      applicant_uuid: selectedProfile,
      action: actionToPerform,
      comment: comment
    };

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
  const handleSelect = () => {
  }
  const handleDateTimeSave = async (applicant_uuid) => {
    

    try {
      const response = await axios.post(`${apiurl}/assign-interviewer`, formData, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        console.log(formData);
        console.log("Message from server:", response.data.message); // Access message from response.data
        toast.success(response.data.message); // Display the message from server
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
    // setShowModal(false);
    const selected = hosts.find(host => host.name === eventKey);
    setSelectedHost(selected);
    if (selected) {
      const calendlyUrl = "https://calendly.com/ptharun-techno-communications";
      setCalendlyUrl(calendlyUrl);
      setShowCalendlyModal(true);
    }
  };
  // const formatTime = (date) => {
  //   return format(parseISO(date), 'EEE dd MMM yyyy HH:mm');
  // };




  const filteredProfiles = profiles.filter(profile => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return profile.applicant_name.toLowerCase().includes(lowercasedTerm) ||
      profile.applicant_email.toLowerCase().includes(lowercasedTerm) ||
      profile.applicant_phone.toString().includes(lowercasedTerm) ||
      profile.created_at.toLowerCase().includes(lowercasedTerm);
  });
  const sortedProfiles = [...filteredProfiles].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
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

      <Modal show={showModal} onHide={handleCloseModal} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Action for {selectedProfile?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {
  selectedHost ? (
    showCalendlyModal && (
      <div className="text-center mt-5">
        <div>{selectedHost?.name}</div>
        <iframe
          src={calendlyUrl}
          width="100%"
          height="500"
          frameBorder="0"
          title="Calendly Scheduling"
          style={{ maxWidth: '100%' }}
        />
      </div>
    )
  ) : (
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
              <Container>
                <Row className='gap-2'>
                  <Button variant="contained" color='error' onClick={() => handleAction(selectedProfile.applicant_uuid, 'rejected at Screening')}>
                    Reject
                  </Button>
                  <Button variant="contained" color='warning' onClick={() => handleAction(selectedProfile.applicant_uuid, 'no show at Screening')}>
                    No Response
                  </Button>
                  <Button variant="contained" color='secondary' onClick={() => handleAction(selectedProfile.applicant_uuid, 'Not Interested at screening')}>
                    Not Interested
                  </Button>
                </Row>
                <ConfirmationModal
                  show={showConfirm}
                  handleClose={() => setShowConfirm(false)}
                  handleConfirm={handleConfirm}
                  message={`Are you sure you want to mark this applicant as ${actionToPerform}?`}
                />
              </Container>
              <Container>
                <Row className="gap-2">
                  <Dropdown onSelect={handleSelectHost} show={moveForwardMenu} onToggle={handleMoveForwardMenuToggle}>
                    <Dropdown.Toggle className="w-100 bg-primary text-white border-secondary" id="dropdown-basic">
                      Move Forward
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-auto">
                      {hosts.sort((a, b) => a.name.localeCompare(b.name)).map((host, index) => (
                        <Dropdown.Item key={index} eventKey={host.name} className="bg-light text-dark">
                          {host.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Row>
              </Container>
            </div>
          </Form>
  )
}

          
         
        </Modal.Body>
        <Modal.Footer>
          {selectedHost ? <Button variant="contained" onClick={handleShowNext}>Next</Button> : ''}
        </Modal.Footer>
      </Modal>
      



      {/* Modal for Date Selection */}
      <Modal show={showdateModel} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Date and Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="dateTime">
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
          <Button variant="contained" color="success" onClick={() => handleDateTimeSave(selectedProfile.id, 'Moved')}>Save</Button>
        </Modal.Footer>
      </Modal>


      <ToastContainer />
    </Container>
  );

  // </div>

}

export default New;
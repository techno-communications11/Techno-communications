import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Dropdown, Form } from 'react-bootstrap';
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


  const apiurl = process.env.REACT_APP_API;
  const HrData = decodeToken();
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${apiurl}/users/${userData.id}/applicants`, {
          headers: getAuthHeaders(),
        });
        setProfiles(response.data);
        setLoading(true);
      } catch (error) {
        setError('Failed to fetch profiles. Please try again later.');
      } finally {
        setLoading(false)
      }
    };

    fetchProfiles();
  }, []);

  const formData = {
    applicant_uuid: selectedProfile ? selectedProfile.applicant_uuid : null,
    interviewer_id: selectedHost ? selectedHost.id : null,
    time_of_interview: selectedDateTime ? selectedDateTime.toISOString() : null,
  };


  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await axios.get(`${apiurl}/interviewer`, {
          headers: getAuthHeaders(),
        });

        setHosts(response.data);
      } catch (error) {
        setError('Failed to fetch hosts. Please try again later.');
      }
    };

    fetchHosts();
  }, []);

  useEffect(() => {
    const fetchHrs = async () => {
      try {
        const response = await axios.get(`${apiurl}/hrs`, {
          headers: getAuthHeaders(),
        });

        setHrs(response.data);
      } catch (error) {
        setError('Failed to fetch hosts. Please try again later.');
      }
    };

    fetchHrs();
  }, []);

  const handleShowModal = (profile) => {
    setSelectedProfile(profile);
    setShowModal(true);
  };
  const handleShowNext = () => {
    setShowDateModel(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setComment('');
    setCalendlyUrl('');
    setShowCalendlyModal(false);
    setShowDateModel(false)
  };
  const handleActionClick = async (applicant_uuid, action) => {
    const status = {
      applicant_uuid: applicant_uuid,
      action: action,
      comment: comment,
    };
    try {

      const response = await axios.put('http://localhost:3001/api/auth/updatestatus', status, {
        headers: getAuthHeaders(),
      });
      if (response.status === 200) {

      }
    } catch (error) {
      console.error('Error updating status:', error);
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
  const handleSelectHost = async (eventKey) => {
    const selected = hosts.find(host => host.name === eventKey);
    setSelectedHost(selected);
    if (selected) {
      const calendlyUrl = "https://calendly.com/ptharun-techno-communications";
      setCalendlyUrl(calendlyUrl);
      setShowCalendlyModal(true);
    }
  };
  const formatTime = (date) => {
    return format(parseISO(date), 'EEE dd MMM yyyy HH:mm');
  };
  const filteredProfiles = profiles.filter(profile => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return profile.applicant_name.toLowerCase().includes(lowercasedTerm) ||
      profile.applicant_email.toLowerCase().includes(lowercasedTerm) ||
      profile.applicant_phone.toString().includes(lowercasedTerm) ||
      profile.created_at.toLowerCase().includes(lowercasedTerm);
  });
  const sortedProfiles = [...filteredProfiles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
                {['SC.NO', 'Name', 'Email', 'Phone', 'Referred By', 'Reference NTID', 'Created At', 'Action'].map((header, index) => (
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
                    <td>{profile.applicant_email}</td>
                    <td>{profile.applicant_phone}</td>
                    <td>{profile.referred_by}</td>
                    <td>{profile.reference_id}</td>
                    <td>{formatTime(profile.created_at)}</td>
                    <td>
                      <Button className="btn btn-primary shadow-none fw-bold" onClick={() => handleShowModal(profile)}>Proceed</Button>
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
              <Button variant="danger" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={() => handleActionClick(selectedProfile.id, 'Reject')}>Reject</Button>
              <Button variant="warning" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={() => handleActionClick(selectedProfile.id, 'No Response')}>No Response</Button>
              <Dropdown onSelect={handleSelectHost} show={moveForwardMenu} onToggle={handleMoveForwardMenuToggle}>
                <Dropdown.Toggle className="w-100 bg-transparent text-dark border-secondary" id="dropdown-basic">
                  Move Forward
                </Dropdown.Toggle>
                {HrData.role === 'screening_manager' &&
                  <Dropdown.Menu className="w-100 overflow-auto" style={{ maxHeight: '200px' }}>
                    {hosts.sort((a, b) => a.name.localeCompare(b.name)).map((host, index) => (
                      <Dropdown.Item key={index} eventKey={host.name}>
                        {host.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                }
                {HrData.role === 'interviewer' &&
                  <Dropdown.Menu className="w-100 overflow-auto" style={{ maxHeight: '200px' }}>
                    {hrs.sort((a, b) => a.name.localeCompare(b.name)).map((host, index) => (
                      <Dropdown.Item key={index} eventKey={host.name}>
                        {host.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                }
              </Dropdown>
              <Button variant="warning" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={() => handleActionClick(selectedProfile.id, 'Not Interested')}>Not Interested</Button>
              <Dropdown onSelect={handleSelect} show={ChangeScrenningMenu} onToggle={handleChangeScrenningToggle}>
                <Dropdown.Toggle className="w-100 bg-transparent text-dark border-secondary" id="dropdown-basic">
                  Change assignTo
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100 overflow-auto" style={{ maxHeight: '200px' }}>
                  {screeners.sort((a, b) => a.name.localeCompare(b.name)).map((host, index) => (
                    <Dropdown.Item key={index} eventKey={host.name}>
                      {host.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
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
          <Button variant="secondary" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={handleShowNext}>Next</Button>
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
    </Container>
  );

  // </div>

}

export default New;
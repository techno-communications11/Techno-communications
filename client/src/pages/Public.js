import React, { useState, useRef, useEffect } from 'react';
// import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Login from './Login';
import job from './images/4882404.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';

function Public() {
  const apiUrl = process.env.REACT_APP_API;
  const [error, setError] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [markets, setMarkets] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State to track invalid fields
  const [invalidFields, setInvalidFields] = useState({
    name: false,
    // email: false,
    // phone: true,
    referredBy: false,
    referenceNtid: false,
    market: false
  });

  const nameRef = useRef();
  // const emailRef = useRef();
  const phoneRef = useRef();
  const referredByRef = useRef();
  const referenceNtidRef = useRef();

  // const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const regexPhone = /^[0-9]{10}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validate each field
    const nameValid = nameRef.current?.value.trim() !== '';
    // const emailValid = regexEmail.test(emailRef.current?.value);
    // const phoneValid = regexPhone.test(phoneRef.current?.value);
    const marketValid = selectedMarket !== '';
    const referredByValid = referredByRef.current?.value.trim() !== '';
    const referenceNtidValid = referenceNtidRef.current?.value.trim() !== '';

    // Update invalidFields state
    const newInvalidFields = {
        name: !nameValid,
        // email: !emailValid,
        // phone: !phoneValid,
        referredBy: !referredByValid,
        referenceNtid: !referenceNtidValid,
        market: !marketValid
    };

    setInvalidFields(newInvalidFields);

    // Check if any field is invalid
    const isFormValid = Object.values(newInvalidFields).every(field => !field);

    if (!isFormValid) {
        setError('Please fill out all fields correctly.');
        setLoading(false);
        return;
    } else {
        setError('');
    }

    try {
        const formData = {
            name: nameRef.current.value,
            // email: emailRef.current.value,
            phone: phoneRef.current.value,
            work_location: selectedMarket,
            referred_by: referredByRef.current.value,
            reference_id: referenceNtidRef.current.value,
        };
        console.log(formData);

        const response = await axios.post(`${apiUrl}/submit`, formData);

        if (response.status === 201) {
            Swal.fire({
                title: "Thank You!",
                text: "Data submitted successfully!",
                icon: "success"
            });
        }
    } catch (error) {
        // Handle errors
        if (error.response && error.response.data && error.response.data.error) {
            Swal.fire({
                title: "Error",
                text: error.response.data.error,
                icon: "error"
            });
        } else {
            Swal.fire({
                title: "Failed",
                text: 'Failed to submit data. Please try again later.',
                icon: "error"
            });
        }
    } finally {
        // Reset form fields
        nameRef.current.value = "";
        // emailRef.current.value = "";
        phoneRef.current.value = "";
        referredByRef.current.value = "";
        referenceNtidRef.current.value = "";
        setSelectedMarket("");
        setInvalidFields({
            name: false,
            // email: false,
            // phone: false,
            referredBy: false,
            referenceNtid: false,
            market: false
        });
        setLoading(false);
    }
};


  const handleSelectMarket = (eventKey) => {
    setSelectedMarket(eventKey);
    // Remove invalid state when user selects a market
    setInvalidFields(prev => ({ ...prev, market: false }));
  };

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/markets`);
        setMarkets(response.data);
        // console.log(response.data);
      } catch (error) {
        setError('Failed to fetch markets. Please try again later.');
        toast.error('Failed to fetch markets. Please try again later.');
      }
    };

    fetchMarkets();
  }, [apiUrl]);

  const handleLoginModalShow = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);

  return (
    <Container fluid>
      <Row className="vh-100">
        {/* Left Column with Image */}
        <Col md={6} lg={6} className="d-flex justify-content-center align-items-center">
          <img
            src={job}
            alt="jobs"
            className="img-fluid d-none d-md-block"
            style={{ height: "100vh" }}
          />
        </Col>

        {/* Right Column with Form */}
        <Col md={6} lg={6} className="d-flex flex-column mt-4">
          <h2 className='mt-4'>TECHNO-HIRING</h2>
          <Form className="shadow-lg p-4 rounded-3 mt-4" onSubmit={handleSubmit} noValidate>
            <h3 className="text-center mb-4 fw-bolder">Candidate Details Form</h3>

            {/* Form Fields */}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                ref={nameRef}
                type="text"
                placeholder="Name"
                required
                isInvalid={invalidFields.name}
              />
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                ref={emailRef}
                type="email"
                placeholder="Email"
                required
                isInvalid={invalidFields.email}
              />
            </Form.Group> */}

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Control
                ref={phoneRef}
                type="tel"
                placeholder="Phone Number"
                required
              // isInvalid={invalidFields.phone}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicReferredBy">
              <Form.Control
                ref={referredByRef}
                type="text"
                placeholder="Referred By"
                required
                isInvalid={invalidFields.referredBy}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicReferenceNtid">
              <Form.Control
                ref={referenceNtidRef}
                type="text"
                placeholder="Reference NTID"
                required
                isInvalid={invalidFields.referenceNtid}
              />
            </Form.Group>

            {/* Market Selection Dropdown */}
            <Form.Group className="mb-3" controlId="formBasicMarket">
              <div className={`border ${invalidFields.market ? 'border-danger' : 'border-secondary'} rounded`}>
                <Dropdown onSelect={handleSelectMarket}>
                  <Dropdown.Toggle
                    className={`w-100 bg-transparent text-dark fw-bold`}
                    id="dropdown-basic"
                    style={{ borderRadius: '5px', padding: '10px', textAlign: 'left' }}
                  >
                    {selectedMarket || "Select Market"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="w-100 overflow-auto"
                    style={{
                      height: '15rem',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {markets
                      .sort((a, b) => (a.location_name || '').localeCompare(b.location_name || ''))
                      .map((market, index) => (
                        <Dropdown.Item
                          key={market.id || index}
                          eventKey={market.location_name}
                          style={{
                            padding: '10px',
                            backgroundColor: '#f8f9fa',
                            color: '#333',
                            fontWeight: '500',
                            borderBottom: '1px solid #ddd'
                          }}
                          className="dropdown-item-hover"
                        >
                          {market.location_name.toUpperCase()}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {invalidFields.market && (
                <div className="invalid-feedback d-block">
                  Please select a market.
                </div>
              )}
            </Form.Group>

            {/* Submit Button */}
            <Button className="w-100" variant="contained" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>

            {error && <div className="text-danger mt-3">{error}</div>}
          </Form>

          {/* Login Button */}
          <div className="text-center mt-4">
            <Button

              style={{ width: "100%", backgroundColor: "#ffc55a", color: "black", outline: "none" }}
              onClick={handleLoginModalShow}
            >
              Login to Application
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modal for Login */}
      <Modal show={showLoginModal} onHide={handleLoginModalClose} centered style={{ height: "70vh", marginTop: "30px" }}>
        <Modal.Body>
          <Login />
        </Modal.Body>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </Container>
  );
}

export default Public;

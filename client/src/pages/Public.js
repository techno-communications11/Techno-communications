import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Login from "./Login";
import job from "./images/logo.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { FaUser, FaPhone, FaBuilding, FaIdCard, FaSignInAlt } from "react-icons/fa"; // Import icons

function Public() {
  const apiUrl = process.env.REACT_APP_API;
  const [error, setError] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [markets, setMarkets] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State to track invalid fields
  const [invalidFields, setInvalidFields] = useState({
    name: false,
    referredBy: false,
    referenceNtid: false,
    market: false,
  });

  const nameRef = useRef();
  const phoneRef = useRef();
  const referredByRef = useRef();
  const referenceNtidRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validate each field
    const nameValid = nameRef.current?.value.trim() !== "";
    const marketValid = selectedMarket !== "";
    const referredByValid = referredByRef.current?.value.trim() !== "";

    // Update invalidFields state
    const newInvalidFields = {
      name: !nameValid,
      referredBy: !referredByValid,
      market: !marketValid,
    };

    setInvalidFields(newInvalidFields);

    // Check if any field is invalid
    const isFormValid = Object.values(newInvalidFields).every(
      (field) => !field
    );

    function sanitizePhoneNumber(phoneNumber) {
      const sanitized = phoneNumber.replace(/[^\d]/g, "");
      const phoneWithoutCountryCode =
        sanitized.length > 10 ? sanitized.slice(-10) : sanitized;
      return phoneWithoutCountryCode.length === 10
        ? phoneWithoutCountryCode
        : "";
    }

    const phoneNumber = sanitizePhoneNumber(phoneRef.current.value);

    if (!phoneNumber) {
      setError("Please enter a valid phone number with exactly 10 digits.");
      setLoading(false);
      return;
    }

    if (!isFormValid) {
      setError("Please fill out all fields correctly.");
      setLoading(false);
      return;
    } else {
      setError("");
    }

    try {
      const formData = {
        name: nameRef.current.value,
        phone: phoneNumber,
        work_location: selectedMarket,
        referred_by: referredByRef.current.value,
        reference_id: referenceNtidRef.current.value,
      };

      const response = await axios.post(`${apiUrl}/submit`, formData);

      if (response.status === 201) {
        Swal.fire({
          title: "Thank You!",
          text: "Data submitted successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        Swal.fire({
          title: "Error",
          text: error.response.data.error,
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Failed",
          text: "Failed to submit data. Please try again later.",
          icon: "error",
        });
      }
    } finally {
      nameRef.current.value = "";
      phoneRef.current.value = "";
      referredByRef.current.value = "";
      referenceNtidRef.current.value = "";
      setSelectedMarket("");
      setInvalidFields({
        name: false,
        referredBy: false,
        referenceNtid: false,
        market: false,
      });
      setLoading(false);
    }
  };

  const handleSelectMarket = (eventKey) => {
    setSelectedMarket(eventKey);
    setInvalidFields((prev) => ({ ...prev, market: false }));
  };

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/markets`);
        setMarkets(response.data);
      } catch (error) {
        setError("Failed to fetch markets. Please try again later.");
        toast.error("Failed to fetch markets. Please try again later.");
      }
    };

    fetchMarkets();
  }, [apiUrl]);

  const handleLoginModalShow = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);

  return (
    <Container fluid>
      <h2 className="mt-4 display-2 fw-bolder" style={{ color: '#E10174' }}>Welcome Back..</h2>
      <Row className="vh-90">
        {/* Left Column with Image */}
        <Col md={6} lg={6} className="d-flex justify-content-center align-items-center">
          <img
            src={job}
            alt="jobs"
            className="img-fluid d-none d-md-block"
            style={{ height: "30vh" }}
          />
        </Col>

        {/* Right Column with Form */}
        <Col md={6} lg={6} className="d-flex flex-column mt-4">
          <Form className="shadow-lg p-4 rounded-3 mt-4 p-4" onSubmit={handleSubmit} noValidate>
            <h3 className="text-center mb-4 fw-bolder">Candidate Details Form</h3>

            {/* Form Fields with Icons */}
            <Form.Group className="mb-3" controlId="formBasicName">
              <div className="input-group">
                <span className="input-group-text"><FaUser style={{color:'#e10174'}} /></span>
                <Form.Control
                  ref={nameRef}
                  type="text"
                  placeholder="Name"
                  className="shadow-none border"
                  required
                  isInvalid={invalidFields.name}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <div className="input-group">
                <span className="input-group-text"><FaPhone style={{color:'#e10174'}} /></span>
                <Form.Control
                  ref={phoneRef}
                  type="tel"
                  placeholder="Phone Number"
                  className="shadow-none border"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicReferredBy">
              <div className="input-group">
                <span className="input-group-text"><FaUser style={{color:'#e10174'}} /></span>
                <Form.Control
                  ref={referredByRef}
                  type="text"
                  placeholder="Referred By"
                  className="shadow-none border"
                  required
                  isInvalid={invalidFields.referredBy}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicReferenceNtid">
              <div className="input-group">
                <span className="input-group-text"><FaIdCard  style={{color:'#e10174'}}/></span>
                <Form.Control
                  ref={referenceNtidRef}
                  type="text"
                  className="shadow-none border"
                  placeholder="Reference NTID (optional)"
                />
              </div>
            </Form.Group>

            {/* Market Selection Dropdown with Icon */}
            <Form.Group className="mb-3" controlId="formBasicMarket">
              <div className={`${invalidFields.market ? "border-danger" : "border"} rounded`}>
                <Dropdown onSelect={handleSelectMarket}>
                  <Dropdown.Toggle
                    className="w-100 bg-transparent text-muted shadow-none border"
                    id="dropdown-basic"
                    style={{ padding: "10px", textAlign: "left" }}
                  >
                    <FaBuilding className="me-2" style={{color:'#e10174'}} />
                    {selectedMarket || "Select Market"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="w-100 overflow-auto shadow-none border"
                    style={{
                      height: "15rem",
                      borderRadius: "5px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {markets
                      .sort((a, b) =>
                        (a.location_name || "").localeCompare(b.location_name || "")
                      )
                      .map((market, index) => (
                        <Dropdown.Item
                          key={market.id || index}
                          eventKey={market.location_name}
                          style={{
                            padding: "10px",
                            backgroundColor: "#f8f9fa",
                            color: "#333",
                            fontWeight: "500",
                            borderBottom: "1px solid #ddd",
                          }}
                          className="dropdown-item-hover text-capitalize"
                        >
                          {market.location_name.toLowerCase()}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {invalidFields.market && (
                <div className="invalid-feedback d-block">Please select a market.</div>
              )}
            </Form.Group>

            {/* Submit Button */}
            <Button
              className="w-100"
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>

            {error && <div className="text-danger mt-3">{error}</div>}
          </Form>

          {/* Login Button with Icon */}
          <div className="text-center mt-4">
            <Button
              style={{
                width: "100%",
                backgroundColor: "#E10174",
                color: "white",
                outline: "none",
              }}
              onClick={handleLoginModalShow}
            >
              <FaSignInAlt className="me-2" />
              Login to Application
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modal for Login */}
      <Modal
        show={showLoginModal}
        onHide={handleLoginModalClose}
        centered
        style={{ height: "70vh", marginTop: "30px" }}
      >
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
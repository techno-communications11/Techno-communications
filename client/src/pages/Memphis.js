import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import job from '../pages/images/4882404.jpg'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
function PublicFixedLocation() {
  const apiUrl = process.env.REACT_APP_API;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [marketValue,setMarketValue]=useState("");
  const location = useLocation();
  // State to track invalid fields
  const [invalidFields, setInvalidFields] = useState({
    name: false,
    referredBy: false,
  });

  const nameRef = useRef();
  const phoneRef = useRef();
  const referredByRef = useRef();
  const referenceNtidRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    // Function to sanitize phone number by removing country code, non-digit characters, and ensuring 10 digits
    function sanitizePhoneNumber(phoneNumber) {
      // Remove all non-digit characters (spaces, symbols, letters, etc.)
      const sanitized = phoneNumber.replace(/[^\d]/g, '');
      
      // Ensure we only keep the last 10 digits (if country code exists, it will be removed)
      const phoneWithoutCountryCode = sanitized.length > 10 ? sanitized.slice(-10) : sanitized;
      
      // If the sanitized number has exactly 10 digits, return it, otherwise return an empty string
      return phoneWithoutCountryCode.length === 10 ? phoneWithoutCountryCode : '';
    }
  
    // Get the phone number value from the input field and sanitize it
    const phoneNumber = sanitizePhoneNumber(phoneRef.current.value);
  
    // If phone number is invalid, show error and prevent submission
    if (!phoneNumber) {
      setError("Please enter a valid phone number with exactly 10 digits.");
      setLoading(false);
      return;
    }
  
    try {
      // Construct the form data
      const formData = {
        name: nameRef.current.value, // No validation on name
        phone: phoneNumber, // Sanitized phone number
        work_location: marketValue, // Assuming marketValue is valid or default
        referred_by: referredByRef.current.value, // No validation on referred_by
        reference_id: referenceNtidRef.current.value, // No validation on reference_id
      };
  
      console.log(formData, "Submitting data");
  
      // Send the data to the backend using axios
      const response = await axios.post(`${apiUrl}/submit`, formData);
  
      if (response.status === 201) {
        Swal.fire({
          title: "Thank You!",
          text: "Data submitted successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      // Handle errors and display appropriate message
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
      // Reset form fields and state
      nameRef.current.value = "";
      phoneRef.current.value = "";
      referredByRef.current.value = "";
      referenceNtidRef.current.value = "";
      setMarketValue('select Market');
      setLoading(false);
    }
  };
  
  
  
  
  
  

 
  console.log(location.pathname);
  
  return (
    <Container fluid>
      <Row className="vh-100 ">
        <Col
          md={6}
          lg={6}
          className="d-flex justify-content-center align-items-center"
        >
          <img
            src={job}
            alt="jobs"
            className="img-fluid d-none d-md-block"
            style={{ height: "100vh" }}
          />
        </Col>

        <Col
          md={6}
          lg={6}
          className="d-flex flex-column"
          style={{ marginTop: "70px" }}
        >
          <h2 className="mt-4">TECHNO HIRING</h2>
          <Form
            className="shadow-lg p-4 rounded-3 mt-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <h3 className="text-center mb-4 fw-bolder">
              Candidate Details Form
            </h3>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                ref={nameRef}
                type="text"
                placeholder="Name"
                required
                isInvalid={invalidFields.name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Control
                ref={phoneRef}
                type="tel"
                placeholder="Phone Number"
                required
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
                placeholder="Reference NTID (optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3 " controlId="Market">
              <Form.Select
                style={{
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  fontWeight: "500",
                  borderBottom: "1px solid #ddd",
                  boxShadow:'none'
                }}
                value={marketValue} // Use state variable for the selected value
                onChange={(e) => setMarketValue(e.target.value)} // Handle value change
              >
                <option value="">Select Market</option>
                <option value="Memphis">Memphis</option>
                <option value="Relocation">Relocation</option>
              </Form.Select>
            </Form.Group>

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
        </Col>
      </Row>

      <ToastContainer />
    </Container>
  );
}

export default PublicFixedLocation;

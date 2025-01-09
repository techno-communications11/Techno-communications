import React, { useState, useMemo } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import job from './images/logo.webp';
import Swal from "sweetalert2";

function PublicFixedLocation() {
  const apiUrl = process.env.REACT_APP_API;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    referred_by: "",
    reference_id: "",
    work_location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sanitizePhoneNumber = (phoneNumber) => {
    const sanitized = phoneNumber.replace(/[^\d]/g, "");
    const phoneWithoutCountryCode = sanitized.length > 10 ? sanitized.slice(-10) : sanitized;
    return phoneWithoutCountryCode.length === 10 ? phoneWithoutCountryCode : "";
  };

  const sanitizedPhone = useMemo(() => sanitizePhoneNumber(formData.phone), [formData.phone]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!sanitizedPhone) {
      setError("Please enter a valid phone number with exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      // console.log(formData,'ffff')
      const response = await axios.post(`${apiUrl}/submit`, {
        ...formData,
        phone: sanitizedPhone,
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Thank You!",
          text: "Data submitted successfully!",
          icon: "success",
        });

        // Reset form data
        setFormData({
          name: "",
          phone: "",
           referred_by: "",
          reference_id: "",
          work_location: "",
        });
        setError("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to submit data. Please try again later.";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="vh-100">
        <Col md={6} lg={6} className="d-flex justify-content-center align-items-center">
          <img
            src={job}
            alt="jobs"
            className="img-fluid d-none d-md-block"
            style={{ height: "30vh" }}
          />
        </Col>

        <Col md={6} lg={6} className="d-flex flex-column" style={{ marginTop: "70px" }}>
          <h2 className="mt-4">TECHNO HIRING</h2>
          <Form className="shadow-lg p-4 rounded-3 mt-4" onSubmit={handleSubmit} noValidate>
            <h3 className="text-center mb-4 fw-bolder">Candidate Details Form</h3>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Control
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasic referred_by">
              <Form.Control
                name="referred_by"
                type="text"
                placeholder="Referred By"
                value={formData.referred_by}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicreference_id">
              <Form.Control
                name="reference_id"
                type="text"
                placeholder="Reference NTID (optional)"
                value={formData.reference_id}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Market">
              <Form.Select
                name="work_location"
                value={formData.work_location}
                onChange={handleInputChange}
                style={{
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  fontWeight: "500",
                  borderBottom: "1px solid #ddd",
                  boxShadow: "none",
                }}
              >
                <option value="">Select Market</option>
                <option value="Memphis">Memphis</option>
                <option value="Relocation">Relocation</option>
              </Form.Select>
            </Form.Group>

            <Button
              style={{ backgroundColor: "#E10174" }}
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

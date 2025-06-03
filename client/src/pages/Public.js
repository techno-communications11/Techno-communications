import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Login from "./Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegHandPointer } from "react-icons/fa";
import Inputicons from "../utils/Inputicons";
import SanitizePhoneNumber from "../utils/SanitizePhoneNumber";
import Loader from "../utils/Loader";
import Swal from "sweetalert2";
import { FaUser, FaPhone, FaBuilding, FaIdCard, FaSignInAlt } from "react-icons/fa";
import Button from "../utils/Button";
import "../Styles/Button.css";
import useFetchMarkets from "../Hooks/useFetchMarkets";
import API_URL from "../Constants/ApiUrl";

const memphisArray = ["memphis", "relocation"];

function Public() {
  const [selectedMarket, setSelectedMarket] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { markets } = useFetchMarkets();
  
  const nameRef = useRef();
  const phoneRef = useRef();
  const referredByRef = useRef();
  const referenceNtidRef = useRef();
  const pathname = window.location.pathname;

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    const phoneNumber = SanitizePhoneNumber(phoneRef.current?.value);

    if (!nameRef.current?.value.trim()) {
      errors.name = "Name is required";
    }
    
    if (!phoneNumber) {
      errors.phone = "Valid 10-digit phone number is required";
    }
    
    if (!referredByRef.current?.value.trim()) {
      errors.referredBy = "Referrer name is required";
    }
    
    if (!selectedMarket) {
      errors.market = "Please select a market";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset validation when user starts typing
  const handleInputChange = (field) => {
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    
    try {
      const phoneNumber = SanitizePhoneNumber(phoneRef.current.value);
      const formData = {
        name: nameRef.current.value.trim(),
        phone: phoneNumber,
        work_location: selectedMarket,
        referred_by: referredByRef.current.value.trim(),
        reference_id: referenceNtidRef.current?.value.trim() || null,
      };

      const response = await axios.post(
        `${API_URL}/submit`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Data submitted successfully!",
          icon: "success",
        });
        resetForm();
      }
    } catch (error) {
      let errorMessage = "Failed to submit data. Please try again later.";
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    nameRef.current.value = "";
    phoneRef.current.value = "";
    referredByRef.current.value = "";
    referenceNtidRef.current.value = "";
    setSelectedMarket("");
    setFormErrors({});
  };

  const handleSelectMarket = (eventKey) => {
    setSelectedMarket(eventKey);
    setFormErrors(prev => ({ ...prev, market: null }));
  };

  const handleLoginModalShow = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid>
      <h2 className="mt-4 display-2 fw-bolder" style={{ color: "#E10174" }}>
        Welcome Back..
      </h2>
      <Row className="vh-90">
        {/* Left Column with Image */}
        <Col md={6} lg={6} className="d-flex justify-content-center align-items-center">
          <img
            src="/logo.webp"
            alt="jobs"
            className="img-fluid d-none d-md-block"
            style={{ height: "30vh" }}
          />
        </Col>

        {/* Right Column with Form */}
        <Col md={6} lg={6} className="d-flex flex-column mt-4">
          <Form className="shadow-lg p-4 rounded-3 mt-4 p-4" onSubmit={handleSubmit} noValidate>
            <h3 className="text-center mb-4 fw-bolder">Candidate Details Form</h3>

            {/* Name Field */}
            <Form.Group className="mb-3" controlId="formBasicName">
              <div className="input-group">
                <Inputicons icon={FaUser} />
                <Form.Control
                  ref={nameRef}
                  type="text"
                  placeholder="Name"
                  className={`shadow-none border ${formErrors.name ? "is-invalid" : ""}`}
                  onChange={() => handleInputChange("name")}
                  isInvalid={!!formErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            {/* Phone Field */}
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <div className="input-group">
                <Inputicons icon={FaPhone} />
                <Form.Control
                  ref={phoneRef}
                  type="tel"
                  placeholder="Phone Number"
                  className={`shadow-none border ${formErrors.phone ? "is-invalid" : ""}`}
                  onChange={() => handleInputChange("phone")}
                  isInvalid={!!formErrors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.phone}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            {/* Referred By Field */}
            <Form.Group className="mb-3" controlId="formBasicReferredBy">
              <div className="input-group">
                <Inputicons icon={FaUser} />
                <Form.Control
                  ref={referredByRef}
                  type="text"
                  placeholder="Referred By"
                  className={`shadow-none border ${formErrors.referredBy ? "is-invalid" : ""}`}
                  onChange={() => handleInputChange("referredBy")}
                  isInvalid={!!formErrors.referredBy}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.referredBy}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            {/* Reference NTID Field */}
            <Form.Group className="mb-3" controlId="formBasicReferenceNtid">
              <div className="input-group">
                <Inputicons icon={FaIdCard} />
                <Form.Control
                  ref={referenceNtidRef}
                  type="text"
                  className="shadow-none border"
                  placeholder="Reference NTID (optional)"
                />
              </div>
            </Form.Group>

            {/* Market Selection Dropdown */}
            <Form.Group className="mb-3" controlId="formBasicMarket">
              <div className={`rounded ${formErrors.market ? "border-danger" : "border"}`}>
                <Dropdown onSelect={handleSelectMarket}>
                  <Dropdown.Toggle
                    className={`w-100 bg-transparent text-muted shadow-none border me-auto ${formErrors.market ? "border-danger" : ""}`}
                    id="dropdown-basic"
                    style={{ padding: "10px", textAlign: "left" }}
                  >
                    <FaBuilding className="me-2" style={{ color: "#e10174" }} />
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
                      .filter((market) =>
                        pathname === "/memphis"
                          ? memphisArray.includes(market.location_name.toLowerCase())
                          : true
                      )
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
                          {market.location_name?.toLowerCase()}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {formErrors.market && (
                <div className="invalid-feedback d-block">
                  {formErrors.market}
                </div>
              )}
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="btn-primary w-100"
              type="submit"
              disabled={loading}
              loading={loading}
              label=" Submit"
              icon={<FaRegHandPointer />}
            />
          </Form>

          {pathname !== "/memphis" && (
            <Button
              variant="w-100 mt-3"
              code="#E10174"
              label=" Login to Application"
              onClick={handleLoginModalShow}
              icon={<FaSignInAlt />}
              disabled={loading}
            />
          )}
        </Col>
      </Row>

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

      <ToastContainer position="top-right" autoClose={5000} />
    </Container>
  );
}

export default Public;
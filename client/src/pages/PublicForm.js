import { useState, useRef } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaPhone, FaIdCard, FaSignInAlt } from "react-icons/fa";

import InputField from "../utils/InputField";
import MarketDropdown from "../utils/MarketDropdown";
import SubmitButton from "../utils/SubmitButton";
import LoginModal from "../utils/LoginModal";

import useFetchMarkets from "../Hooks/useFetchMarkets";
import SanitizePhoneNumber from "../utils/SanitizePhoneNumber";
import Loader from "../utils/Loader";
import Button from "../utils/Button";
import API_URL from "../Constants/ApiUrl";

function PublicForm() {
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

  const validateForm = () => {
    const errors = {};
    const phoneNumber = SanitizePhoneNumber(phoneRef.current?.value);

    if (!nameRef.current?.value.trim()) errors.name = "Name is required";
    if (!phoneNumber) errors.phone = "Valid 10-digit phone number is required";
    if (!referredByRef.current?.value.trim())
      errors.referredBy = "Referrer name is required";
    if (!selectedMarket) errors.market = "Please select a market";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field) => {
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSelectMarket = (eventKey) => {
    setSelectedMarket(eventKey);
    setFormErrors((prev) => ({ ...prev, market: null }));
  };

  const resetForm = () => {
    nameRef.current && (nameRef.current.value = "");
    phoneRef.current && (phoneRef.current.value = "");
    referredByRef.current && (referredByRef.current.value = "");
    referenceNtidRef.current && (referenceNtidRef.current.value = "");
    setSelectedMarket("");
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      console.log("Form Data:", formData);

      const response = await axios.post(
        `${API_URL}/submit-public-form`,
        formData
      );

      console.log("Response:", response);

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Data submitted successfully!",
          icon: "success",
        });
        resetForm();
      }
    } catch (error) {
      console.error("Submission Error:", error);

      let errorMessage = "Failed to submit data. Please try again later.";

      if (error.response) {
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message || errorMessage;
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

  if (loading) return <Loader />;

  return (
    <Container fluid>
      <h2 className="mt-4 display-2 fw-bolder" style={{ color: "#E10174" }}>
        Welcome Back..
      </h2>
      <Row className="vh-90">
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <img
            src="/logo.webp"
            alt="logo"
            className="img-fluid d-none d-md-block"
            style={{ height: "30vh" }}
          />
        </Col>

        <Col md={6} className="d-flex flex-column mt-4">
          <Form
            className="shadow-lg p-4 rounded-3 mt-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <h3 className="text-center mb-4 fw-bolder">
              Candidate Details Form
            </h3>

            <InputField
              icon={FaUser}
              refProp={nameRef}
              placeholder="Name"
              error={formErrors.name}
              onChange={() => handleInputChange("name")}
            />

            <InputField
              icon={FaPhone}
              refProp={phoneRef}
              type="tel"
              placeholder="Phone Number"
              error={formErrors.phone}
              onChange={() => handleInputChange("phone")}
            />

            <InputField
              icon={FaUser}
              refProp={referredByRef}
              placeholder="Referred By"
              error={formErrors.referredBy}
              onChange={() => handleInputChange("referredBy")}
            />

            <InputField
              icon={FaIdCard}
              refProp={referenceNtidRef}
              placeholder="Reference NTID (optional)"
            />

            <Form.Group className="mb-3">
              <MarketDropdown
                selectedMarket={selectedMarket}
                handleSelectMarket={handleSelectMarket}
                markets={markets}
                formErrors={formErrors}
                pathname={pathname}
              />
            </Form.Group>

            <SubmitButton loading={loading} />
          </Form>

          {pathname !== "/memphis" && (
            <Button
              variant="w-100 mt-3"
              code="#E10174"
              label=" Login to Application"
              onClick={() => setShowLoginModal(true)}
              icon={<FaSignInAlt />}
              disabled={loading}
            />
          )}
        </Col>
      </Row>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <ToastContainer position="top-right" autoClose={5000} />
    </Container>
  );
}

export default PublicForm;

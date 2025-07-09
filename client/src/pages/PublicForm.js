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
import ResumeUpload from "../utils/ResumeUpload";

function PublicForm() {
  const [selectedMarket, setSelectedMarket] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [fileError, setFileError] = useState(null);
  const { markets } = useFetchMarkets();

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const referredByRef = useRef(null);
  const referenceNtidRef = useRef(null);
  const [file, setFile] = useState(null);

  const pathname = window.location.pathname;
  const EXCLUDED_LOGIN_PATHS = ["/memphis"];

  const validateForm = () => {
    const errors = {};
    const name = nameRef.current?.value.trim();
    const phone = phoneRef.current?.value;
    const referredBy = referredByRef.current?.value.trim();
    const referenceId = referenceNtidRef.current?.value.trim();
    const phoneNumber = SanitizePhoneNumber(phone);

    if (!name) errors.name = "Name is required";
    if (!phoneNumber) errors.phone = "Valid phone number is required";
    if (!referredBy) errors.referredBy = "Referrer name is required";
    if (referenceId && !/^[a-zA-Z0-9]{1,20}$/.test(referenceId)) {
      errors.referenceNtid = "Invalid reference ID format";
    }
    if (!selectedMarket) errors.market = "Please select a market";
    // if (!file) errors.file = "Please select a resume file";
    else if (fileError) errors.file = fileError;

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
    if (nameRef.current) nameRef.current.value = "";
    if (phoneRef.current) phoneRef.current.value = "";
    if (referredByRef.current) referredByRef.current.value = "";
    if (referenceNtidRef.current) referenceNtidRef.current.value = "";
    setSelectedMarket("");
    setFile(null);
    setFileError(null);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    let isMounted = true;
    setLoading(true);

    try {
      const phoneNumber = SanitizePhoneNumber(phoneRef.current.value);

      const formData = new FormData();
      formData.append("name", nameRef.current.value);
      formData.append("phone", phoneNumber);
      formData.append("file", file);
      formData.append("work_location", selectedMarket);
      formData.append("referred_by", referredByRef.current.value);
      formData.append("reference_id", referenceNtidRef.current?.value || "");

      const apiUrl = API_URL || "http://localhost:3000";
      const response = await axios.post(`${apiUrl}/submit-public-form`, formData);

      if (response.status === 201 && isMounted) {
        Swal.fire({
          title: "Success!",
          text: "Data submitted successfully!",
          icon: "success",
        });
        resetForm();
      }
    } catch (error) {
      if (isMounted) {
        const errorMessage = error.response?.data?.error || error.message || "Submission failed.";
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
        });
      }
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  };

  if (loading) return <Loader />;

  return (
    <Container fluid>
      <h2 className="mt-2 display-2 fw-bolder" style={{ color: "#E10174" }}>
        Welcome Back..
      </h2>
      <Row className="vh-90">
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <img src="/logo.webp" alt="logo" className="img-fluid d-none d-md-block" style={{ height: "30vh" }} />
        </Col>

        <Col md={6} className="d-flex flex-column mt-2">
          <Form className="shadow-lg p-4 rounded-3 mt-4" onSubmit={handleSubmit} noValidate>
            <h3 className="text-center mb-4 fw-bolder">Candidate Details Form</h3>

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
              error={formErrors.referenceNtid}
              onChange={() => handleInputChange("referenceNtid")}
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
            <ResumeUpload setFile={setFile} setFileError={setFileError} />
            <SubmitButton loading={loading} />
          </Form>

          {!EXCLUDED_LOGIN_PATHS.includes(pathname) && (
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

      <LoginModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />
      <ToastContainer position="top-right" autoClose={5000} />
    </Container>
  );
}

export default PublicForm;
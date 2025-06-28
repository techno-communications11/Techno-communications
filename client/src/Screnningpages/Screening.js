import { useState, useRef, useContext } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Swal from "sweetalert2";
import SanitizePhoneNumber from "../utils/SanitizePhoneNumber";
import { MyContext } from "../pages/MyContext";
import useFetchMarkets from "../Hooks/useFetchMarkets";
import { FaUser, FaPhone, FaIdCard } from "react-icons/fa";

import InputField from "../utils/InputField";
import MarketDropdown from "../utils/MarketDropdown";
import SubmitButton from "../utils/SubmitButton";

function Screening() {
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [selectedMarket, setSelectedMarket] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const referredByRef = useRef();
  const referenceNtidRef = useRef();

  const apiUrl = process.env.REACT_APP_API;
  const { userData } = useContext(MyContext);
  const { markets } = useFetchMarkets();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (field) => {
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectMarket = (eventKey) => {
    setSelectedMarket(eventKey);
    setFormErrors((prev) => ({ ...prev, market: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);

    const name = nameRef.current?.value.trim();
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;
    const referredBy = referredByRef.current?.value.trim();
    const referenceId = referenceNtidRef.current?.value;

    const phoneNumber = SanitizePhoneNumber(phone);

    const errors = {};
    if (!name) errors.name = "Name is required.";
    if (!regexEmail.test(email)) errors.email = "Invalid email format.";
    if (!phoneNumber) errors.phone = "Phone must be 10 digits.";
    if (!referredBy) errors.referredBy = "Referred By is required.";
    if (!selectedMarket) errors.market = "Please select a market.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setError("Please correct the highlighted errors.");
      setLoading(false);
      return;
    }

    setError("");

    const formData = {
      name,
      email,
      phone: phoneNumber,
      work_location: selectedMarket,
      referred_by: referredBy,
      reference_id: referenceId,
      sourcedBy: userData?.name || "Anonymous",
    };

    try {
      const response = await axios.post(`${apiUrl}/submit-public-form`, formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Thank You!",
          text: "Data submitted successfully!",
          icon: "success",
        });

        // Clear form fields
        nameRef.current.value = "";
        emailRef.current.value = "";
        phoneRef.current.value = "";
        referredByRef.current.value = "";
        referenceNtidRef.current.value = "";
        setSelectedMarket("");
        setFormErrors({});
      } else {
        setError("Unexpected response status: " + response.status);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center mt-4">
      <div className="row mx-5 rounded-3 mt-5">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src="./registerUser.png"
            alt="Register User"
            className="img-fluid"
            style={{ height: "80%" }}
          />
        </div>

        <div className="col-md-6 border border-2 border-secondary shadow-lg">
          <Form className="bg-white p-4 rounded-3" onSubmit={handleSubmit}>
            <h3 className="text-center mb-4 fw-bold" style={{ color: "#E10174" }}>
              Register Candidate
            </h3>

            <InputField
              icon={FaUser}
              refProp={nameRef}
              placeholder="Name"
              error={formErrors.name}
              onChange={() => handleInputChange("name")}
            />

            <InputField
              icon={FaUser}
              refProp={emailRef}
              placeholder="Email"
              error={formErrors.email}
              onChange={() => handleInputChange("email")}
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
              />
            </Form.Group>

            <SubmitButton loading={loading} />
            <div className="text-danger mt-3">{error}</div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Screening;

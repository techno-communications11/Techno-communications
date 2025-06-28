import  { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Swal from "sweetalert2";
import SanitizePhoneNumber from "../utils/SanitizePhoneNumber";
import { useContext } from "react";
import { MyContext } from "../pages/MyContext";
import useFetchMarkets from "../Hooks/useFetchMarkets";
import { FaUser, FaPhone, FaIdCard } from "react-icons/fa";

import InputField from "../utils/InputField";
import MarketDropdown from "../utils/MarketDropdown";
import SubmitButton from "../utils/SubmitButton";
import { fi } from "date-fns/locale";


function Screening() {
  const [error, setError] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const referredByRef = useRef();
  const referenceNtidRef = useRef();
  const apiUrl = process.env.REACT_APP_API;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { userData } = useContext(MyContext);
  const { markets } = useFetchMarkets();
    const [formErrors, setFormErrors] = useState({});
     const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    setLoading(true); // Set loading to true when submission starts
    event.preventDefault();
    event.stopPropagation();
    const nameValid = nameRef.current?.value.trim() !== "";
    const emailValid = regexEmail.test(emailRef.current?.value);
    const marketValid = selectedMarket !== "";
    const referredByValid = referredByRef.current?.value.trim() !== "";

    if (!nameValid || !emailValid || !marketValid || !referredByValid) {
      setError("Please fill out all fields correctly.");
      return;
    }
    const phoneNumber = SanitizePhoneNumber(phoneRef.current.value);

    if (!phoneNumber) {
      setError("Please enter a valid phone number with exactly 10 digits.");
      return;
    }
    setError("");

    try {
      const formData = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneNumber,
        work_location: selectedMarket,
        referred_by: referredByRef.current.value,
        reference_id: referenceNtidRef.current.value,
        sourcedBy: userData.name, // Directly assign the userData.name here
      };

      const response = await axios.post(`${apiUrl}/submit-public-form`, formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Thank You!",
          text: "Data submitted successfully!",
          icon: "success",
        });

        // Reset the form fields on successful submission
        nameRef.current.value = "";
        emailRef.current.value = "";
        phoneRef.current.value = "";
        referredByRef.current.value = "";
        referenceNtidRef.current.value = "";
        setSelectedMarket("");
      } else {
        setError("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("Failed to submit data. Please try again later.");
    } finally {

    setLoading(false); // Set loading to false when submission ends
    }
  };

  const handleSelectMarket = (eventKey) => {
    setSelectedMarket(eventKey);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center mt-4">
      <div className="row  mx-5 rounded-3 mt-5">
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
            <h3
              className="text-center mb-4 fw-bold"
              style={{ color: "#E10174" }}
            >
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

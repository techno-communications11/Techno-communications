import React, { useState, useRef } from "react";
import Button from "../utils/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import Swal from "sweetalert2";
import SanitizePhoneNumber from "../utils/SanitizePhoneNumber";
import { useContext } from "react";
import { MyContext } from "../pages/MyContext";
import useFetchMarkets from "../Hooks/useFetchMarkets";

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

  const handleSubmit = async (event) => {
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

      const response = await axios.post(`${apiUrl}/submit`, formData, {
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

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                className="shadow-none border"
                ref={nameRef}
                type="text"
                placeholder="Name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                ref={emailRef}
                className="shadow-none border"
                type="email"
                placeholder="Email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Control
                ref={phoneRef}
                className="shadow-none border"
                type="tel"
                placeholder="Phone Number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicReferredBy">
              <Form.Control
                ref={referredByRef}
                className="shadow-none border"
                type="text"
                placeholder="Referred By"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicReferenceNtid">
              <Form.Control
                ref={referenceNtidRef}
                className="shadow-none border"
                type="text"
                placeholder="Reference NTID"
              />
            </Form.Group>

            <Form.Group
              className="mb-3 border-secondary"
              controlId="formBasicMarket"
            >
              <Dropdown onSelect={handleSelectMarket}>
                <Dropdown.Toggle
                  className="w-100 bg-transparent text-dark border-secondary text-start text-secondary"
                  id="dropdown-basic"
                >
                  {selectedMarket || "Select Market"}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="w-100 overflow-auto "
                  style={{ height: "15rem" }}
                >
                  {markets
                    .sort((a, b) =>
                      (a.markets || "").localeCompare(b.markets || "")
                    )
                    .map((market, index) => (
                      <Dropdown.Item
                        key={market.location_name || index}
                        eventKey={market.location_name}
                        className="text-capitalize shadow "
                      >
                        {market.location_name.toLowerCase()}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Button
              label={"Submit"}
              variant="btn-primary w-100"
              type="submit"
            />
            <div className="text-danger mt-3">{error}</div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Screening;

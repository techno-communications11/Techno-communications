import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@mui/material';
import Form from 'react-bootstrap/Form';
// import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Swal from 'sweetalert2';
import decodeToken from '../decodedDetails';

function DirectForm() {
  const userData = decodeToken();
  const [error, setError] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [markets, setMarkets] = useState([]);
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const referredByRef = useRef();
  const referenceNtidRef = useRef();
  const apiUrl = process.env.REACT_APP_API;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const nameValid = nameRef.current?.value.trim() !== '';
    const emailValid = regexEmail.test(emailRef.current?.value);
    const phoneValid = phoneRef.current?.value.trim() !== ''; // Add phone validation if needed
    // const marketValid = selectedMarket !== '';
    const referredByValid = referredByRef.current?.value.trim() !== '';

    if (!nameValid || !emailValid || !phoneValid || !referredByValid) {
      setError('Please fill out all fields correctly.');
      return;
    }

    setError('');

    try {
      const formData = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        referred_by: referredByRef.current.value,
        reference_id: referenceNtidRef.current.value,
        sourcedBy: userData.name,
        assign_to: userData.id,
      };

      const response = await axios.post(`${apiUrl}/directform`, formData);

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
        setError(''); // Clear any previous errors
      } else {
        setError("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError('Failed to submit data. Please try again later.');
    }
  };


  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/markets`);
        setMarkets(response.data);
      } catch (error) {
        setError('Failed to fetch markets. Please try again later.');
      }
    };

    fetchMarkets();
  }, []);



  return (
    <div className='container-fluid d-flex justify-content-center align-items-center mt-4'>
      <div className='row  mx-5 rounded-3'>
        {/* Image Section */}
        <div className='col-md-6 d-flex justify-content-center align-items-center'>
          <img src="./registerUser.png" alt="Register User" className="img-fluid" style={{ height: '80%' }} />
        </div>

        <div className='col-md-6'>
          <Form className='bg-white p-4 rounded-3' onSubmit={handleSubmit}>
            <h3 className='text-center mb-4 fw-bold'>Register Candidate</h3>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                className={`shadow-none border ${!nameRef.current?.value && 'is-invalid'}`}
                ref={nameRef}
                type="text"
                placeholder="Name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                ref={emailRef}
                className={`shadow-none border ${!regexEmail.test(emailRef.current?.value) && 'is-invalid'}`}
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

            <Button className='w-100' variant="contained" type="submit">
              Submit
            </Button>

            <div className='text-danger mt-3'>{error}</div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default DirectForm;

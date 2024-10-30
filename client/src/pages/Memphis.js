import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Login from './Login';
import job from './images/4882404.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';

function PublicFixedLocation() {
    const apiUrl = process.env.REACT_APP_API;
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // State to track invalid fields
    const [invalidFields, setInvalidFields] = useState({
        name: false,
        referredBy: false
    });

    const nameRef = useRef();
    const phoneRef = useRef();
    const referredByRef = useRef();
    const referenceNtidRef = useRef();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Validate fields
        const nameValid = nameRef.current?.value.trim() !== '';
        const referredByValid = referredByRef.current?.value.trim() !== '';

        // Update invalidFields state
        const newInvalidFields = {
            name: !nameValid,
            referredBy: !referredByValid
        };

        setInvalidFields(newInvalidFields);

        // Check if any field is invalid
        const isFormValid = Object.values(newInvalidFields).every(field => !field);

        if (!isFormValid) {
            setError('Please fill out all fields correctly.');
            setLoading(false);
            return;
        } else {
            setError('');
        }

        try {
            const formData = {
                name: nameRef.current.value,
                phone: phoneRef.current.value,
                work_location: 'Memphis', // Setting location as Memphis
                referred_by: referredByRef.current.value,
                reference_id: referenceNtidRef.current.value
            };
            console.log(formData);

            const response = await axios.post(`${apiUrl}/submit`, formData);

            if (response.status === 201) {
                Swal.fire({
                    title: "Thank You!",
                    text: "Data submitted successfully!",
                    icon: "success"
                });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                Swal.fire({
                    title: "Error",
                    text: error.response.data.error,
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "Failed",
                    text: 'Failed to submit data. Please try again later.',
                    icon: "error"
                });
            }
        } finally {
            nameRef.current.value = "";
            phoneRef.current.value = "";
            referredByRef.current.value = "";
            referenceNtidRef.current.value = "";
            setInvalidFields({
                name: false,
                referredBy: false
            });
            setLoading(false);
        }
    };

    const handleLoginModalShow = () => setShowLoginModal(true);
    const handleLoginModalClose = () => setShowLoginModal(false);
const Memphis = "MEMPHIS"
    return (
        <Container fluid>
            <Row className="vh-100 ">
                <Col md={6} lg={6} className="d-flex justify-content-center align-items-center">
                    <img
                        src={job}
                        alt="jobs"
                        className="img-fluid d-none d-md-block"
                        style={{ height: "100vh" }}
                    />
                </Col>

                <Col md={6} lg={6} className="d-flex flex-column" style={{marginTop:"70px"}}>

                    <h2 className='mt-4'>TECHNO HIRING</h2>
                    <Form className="shadow-lg p-4 rounded-3 mt-4" onSubmit={handleSubmit} noValidate>
                        <h3 className="text-center mb-4 fw-bolder">Candidate Details Form</h3>

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
                        <Form.Group className="mb-3" controlId="Market">
                            <Form.Control
                             style={{
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                color: '#333',
                                fontWeight: '500',
                                borderBottom: '1px solid #ddd'
                              }}
                               value={Memphis}
                               placeholder='Market For'
                            />
                        </Form.Group>

                        <Button className="w-100" variant="contained" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
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

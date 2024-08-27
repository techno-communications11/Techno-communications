import axios from 'axios';
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router';
import { Table, Form, Row, Col, Button, Container, Toast,Tabs, Tab,} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import Accordion from 'react-bootstrap/Accordion';
import 'react-toastify/dist/ReactToastify.css';
const Hrinterview = ({ applicant_uuidProps }) => {
  // State for showing toast and form data
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [firstRound, setFirstRound] = useState([])
  const [activeKey, setActiveKey] = useState(null); // State to manage active tab
  const [formData, setFormData] = useState({
    submissionDate: '',
    name: '',
    email: '',
    firstName: '',
    lastName: '',
    applicantId: '',
    candidateEmail: '',
    market: '',
    marketTraining: '',
    trainingLocation: '',
    compensationType: '',
    offeredSalary: '',
    payroll: '',
    acceptOffer: '',
    returnDate: '',
    joiningDate: '',
    notes: '',
    noShow: false,
    workHoursDays: '',
    proceedCandidate: '',
    phoneNumber: '',
    submissionId: '',
    backOut: '',
    reasonBackOut: '',
    verificationJoining: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  console.log(formData)
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send POST request to the backend
      const response = await axios.post(`${process.env.REACT_APP_API}/add-hrevaluation`, formData);

      // Show toast
      setShowToast(true);

      setFormData({
        submissionDate: '',
        name: '',
        email: '',
        firstName: '',
        lastName: '',
        applicantId: '',
        candidateEmail: '',
        market: '',
        marketTraining: '',
        trainingLocation: '',
        compensationType: '',
        offeredSalary: '',
        payroll: '',
        acceptOffer: '',
        returnDate: '',
        joiningDate: '',
        notes: '',
        noShow: false,
        workHoursDays: '',
        proceedCandidate: '',
        phoneNumber: '',
        submissionId: '',
        backOut: '',
        reasonBackOut: '',
        verificationJoining: ''
      });

      // Check if the response is successful
      if (response.status === 200) {
        toast.success("Response submitted successfully!");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit response.");
    } finally {
      // Optionally reset or update state here
      setTimeout(() => {
        navigate('/hrhome'); // Correct spelling of navigate
      }, 1800); // Adjust the timeout duration if needed
    }
  };

  useEffect(() => {

    const fetchingresponse = async () => {

      try {
        console.log("applicant_uuidProps...........................", applicant_uuidProps)
        const response = await axios.get(`http://localhost:5000/api/first_round_res/${applicant_uuidProps}`)
        if (response.data && response.data.length > 0) {
          setFirstRound(response.data[0]);
          console.log("setFirstRound", setFirstRound)
        } else {
          console.log("No data found");
        }

        console.log("First round response:", response);
      } catch (err) {

        console.log(err)
      }

    }

    fetchingresponse();
  }, [applicant_uuidProps])

  return (
    <Container className="d-flex  justify-content-center">
     <Col md={8} lg={5} className="m-4">
        <h2 className='m-2'>{applicant_uuidProps} First Round Details</h2>
        {/* Accordion to display first round details */}
        <Accordion defaultActiveKey="0" className="mt-4">
          {Object.entries(firstRound).map(([key, value], index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>{key}</Accordion.Header>
              <Accordion.Body>
                {value ? value.toString() : 'No data available'}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Col>
      <Col md lg={7} className="m-4">
        <h2 className='m-2'>HR Interview Questions</h2>


        <Form onSubmit={handleSubmit} >
          {/* Submission Date */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              1. Submission Date
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="date"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* PLEASE SELECT YOUR NAME */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              2. PLEASE SELECT YOUR NAME
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="name"
                value={formData.name}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option>Roshan</option>
                <option>Hurr</option>
                <option>Sultan</option>
              </Form.Control>
            </Col>
          </Form.Group>

          {/* PLEASE ENTER YOUR EMAIL */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              3. PLEASE ENTER YOUR EMAIL
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* First Name */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              4. First Name
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Last Name */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              5. Last Name
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* PLEASE ENTER THE APPLICANT ID */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              6. PLEASE ENTER THE APPLICANT ID
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="applicantId"
                placeholder="Enter Applicant ID"
                value={formData.applicantId}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* PLEASE ENTER THE CANDIDATE'S EMAIL */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              7. PLEASE ENTER THE CANDIDATE'S EMAIL
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="email"
                name="candidateEmail"
                placeholder="Enter Candidate's Email"
                value={formData.candidateEmail}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* PLEASE SELECT THE MARKET WHERE THE APPLICANT IS GETTING HIRED FOR */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              8. PLEASE SELECT THE MARKET WHERE THE APPLICANT IS GETTING HIRED FOR
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="market"
                value={formData.market}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option>Market 1</option>
                <option>Market 2</option>
                <option>Market 3</option>
              </Form.Control>
            </Col>
          </Form.Group>

          {/* WILL THE APPLICANT DIRECTLY GO TO THE MARKET HE IS BEING HIRED FOR OR A DIFFERENT MARKET FOR TRAINING */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              9. WILL THE APPLICANT DIRECTLY GO TO THE MARKET HE IS BEING HIRED FOR OR A DIFFERENT MARKET FOR TRAINING
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="marketTraining"
                value={formData.marketTraining}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option>Direct Market</option>
                <option>Different Market for Training</option>
              </Form.Control>
            </Col>
          </Form.Group>

          {/* PLEASE SELECT WHERE WILL THE APPLICANT GO FOR TRAINING */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              10. PLEASE SELECT WHERE WILL THE APPLICANT GO FOR TRAINING
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="trainingLocation"
                value={formData.trainingLocation}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option>Location 1</option>
                <option>Location 2</option>
                <option>Location 3</option>
              </Form.Control>
            </Col>
          </Form.Group>

          {/* COMPENSATION TYPE */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              11. COMPENSATION TYPE
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="compensationType"
                value={formData.compensationType}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option>Type 1</option>
                <option>Type 2</option>
                <option>Type 3</option>
              </Form.Control>
            </Col>
          </Form.Group>

          {/* PLEASE ENTER THE OFFERED SALARY */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              12. PLEASE ENTER THE OFFERED SALARY
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="number"
                name="offeredSalary"
                placeholder="Enter salary"
                value={formData.offeredSalary}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* IS THE APPLICANT ON CURRENT OR BACK PAYROLL */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              13. IS THE APPLICANT ON CURRENT OR BACK PAYROLL
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="payroll"
                value={formData.payroll}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option>Current Payroll</option>
                <option>Back Payroll</option>
              </Form.Control>
            </Col>
          </Form.Group>

          {/* DID THE APPLICANT ACCEPT THE OFFER? */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              14. DID THE APPLICANT ACCEPT THE OFFER?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="acceptOffer"
                value="Yes"
                checked={formData.acceptOffer === 'Yes'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="acceptOffer"
                value="No"
                checked={formData.acceptOffer === 'No'}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* IF THE APPLICANT HAS DECIDED TO THINK ABOUT IT PLEASE SELECT WHEN WILL HE RETURN BACK TO YOU */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              15. IF THE APPLICANT HAS DECIDED TO THINK ABOUT IT PLEASE SELECT WHEN WILL HE RETURN BACK TO YOU
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* PLEASE ENTER THE APPLICANT'S DATE OF JOINING */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              16. PLEASE ENTER THE APPLICANT'S DATE OF JOINING
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* OTHER NOTES/POINTERS */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              17. OTHER NOTES/POINTERS
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                placeholder="Enter any notes or pointers"
                value={formData.notes}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* IS THE APPLICANT A NO SHOW? */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              18. IS THE APPLICANT A NO SHOW?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="checkbox"
                name="noShow"
                checked={formData.noShow}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* PLEASE ENTER THE HOURS/DAYS THAT THE EMPLOYEE HAS PROMISED TO WORK */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              19. PLEASE ENTER THE HOURS/DAYS THAT THE EMPLOYEE HAS PROMISED TO WORK
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="workHoursDays"
                placeholder="Enter hours/days"
                value={formData.workHoursDays}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* WOULD YOU LIKE TO PROCEED WITH THE CANDIDATE? */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              20. WOULD YOU LIKE TO PROCEED WITH THE CANDIDATE?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="proceedCandidate"
                value="Yes"
                checked={formData.proceedCandidate === 'Yes'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="proceedCandidate"
                value="No"
                checked={formData.proceedCandidate === 'No'}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Applicant's Phone # */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              21. Applicant's Phone #
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Submission ID */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              22. Submission ID
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="submissionId"
                placeholder="Enter submission ID"
                value={formData.submissionId}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* DID THE EMPLOYEE BACK OUT? */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              23. DID THE EMPLOYEE BACK OUT?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="backOut"
                value="Yes"
                checked={formData.backOut === 'Yes'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="backOut"
                value="No"
                checked={formData.backOut === 'No'}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* IF SO WHY DID HE BACK OUT */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              24. IF SO WHY DID HE BACK OUT
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="reasonBackOut"
                placeholder="Enter reason"
                value={formData.reasonBackOut}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* VERIFICATION OF JOINING */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              25. VERIFICATION OF JOINING
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="verificationJoining"
                value="Yes"
                checked={formData.verificationJoining === 'Yes'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="verificationJoining"
                value="No"
                checked={formData.verificationJoining === 'No'}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Submit Button */}
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 6, offset: 6 }}>
              <Button type="submit">Submit Details</Button>
            </Col>
          </Form.Group>
        </Form>
      </Col>

      {/* Toast Notification */}
      <ToastContainer position="middle-center" className="p-3" style={{ height: '50vh' }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          className="border border-success rounded"
        >
          <Toast.Body className="d-flex align-items-center text-success" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            <i className="fas fa-check-circle me-2" style={{ fontSize: '1.5rem' }}></i>
            Details submitted successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container >
  );
}

export default Hrinterview;

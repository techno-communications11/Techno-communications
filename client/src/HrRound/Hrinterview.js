import React, { useState } from 'react';
// import axios from 'axios';
import { Table,Form, Row, Col, Button, Container, Toast, ToastContainer } from 'react-bootstrap';

const Hrinterview = () => {
  // State for showing toast and form data
  const [showToast, setShowToast] = useState(false);
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
      // await axios.post('http://localhost:3001/api/auth/hrinterview', formData);

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

      // Optionally, you can hide the toast after a certain duration
      setTimeout(() => {
        setShowToast(false);
        window.location.reload(); // Refresh the page
      }, 1800); // Adjust the timeout duration if needed 
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error if needed
    }
  };

  return (
    <Container className="d-flex gap-5 justify-content-center align-items-center">
      <Col className='col-md-5'>
      <h2>Interviewer Results</h2>
      <div>
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Applicant's Age</td>
            <td></td> {/* Answer will be populated from backend data */}
          </tr>
          <tr>
            <td>Applicant's Gender</td>
            <td></td>
          </tr>
          <tr>
            <td>Email on File</td>
            <td></td>
          </tr>
          <tr>
            <td>Country</td>
            <td></td>
          </tr>
          <tr>
            <td>City</td>
            <td></td>
          </tr>
          <tr>
            <td>Interviewed Before</td>
            <td></td>
          </tr>
          <tr>
            <td>Visa Category</td>
            <td></td>
          </tr>
          <tr>
            <td>Education Level</td>
            <td></td>
          </tr>
          <tr>
            <td>Major In</td>
            <td></td>
          </tr>
          <tr>
            <td>Currently Studying</td>
            <td></td>
          </tr>
          <tr>
            <td>University Name</td>
            <td></td>
          </tr>
          <tr>
            <td>Course Type</td>
            <td></td>
          </tr>
          <tr>
            <td>Semester</td>
            <td></td>
          </tr>
          <tr>
            <td>Had Car</td>
            <td></td>
          </tr>
          <tr>
            <td>Family Operate TI</td>
            <td></td>
          </tr>
          <tr>
            <td>Cellphone Carrier</td>
            <td></td>
          </tr>
          <tr>
            <td>Worked Before</td>
            <td></td>
          </tr>
          <tr>
            <td>Currently Employed</td>
            <td></td>
          </tr>
          <tr>
            <td>Current Company</td>
            <td></td>
          </tr>
          <tr>
            <td>Current Job in TI</td>
            <td></td>
          </tr>
          <tr>
            <td>Hours of Daily Work</td>
            <td></td>
          </tr>
          <tr>
            <td>Daily Wage</td>
            <td></td>
          </tr>
          <tr>
            <td>Compensation Type</td>
            <td></td>
          </tr>
          <tr>
            <td>Reason to Leave</td>
            <td></td>
          </tr>
          <tr>
            <td>Cellular Experience</td>
            <td></td>
          </tr>
          <tr>
            <td>Name Tele Company Name</td>
            <td></td>
          </tr>
          <tr>
            <td>Experience of Tele</td>
            <td></td>
          </tr>
          <tr>
            <td>Type of Work Doing</td>
            <td></td>
          </tr>
          <tr>
            <td>Other Employment Exp</td>
            <td></td>
          </tr>
          <tr>
            <td>Foreign Work Exp</td>
            <td></td>
          </tr>
          <tr>
            <td>Mention Line Exp</td>
            <td></td>
          </tr>
          <tr>
            <td>Appearance</td>
            <td></td>
          </tr>
          <tr>
            <td>Personality</td>
            <td></td>
          </tr>
          <tr>
            <td>Confidence</td>
            <td></td>
          </tr>
          <tr>
            <td>Communication Skills</td>
            <td></td>
          </tr>
          <tr>
            <td>Pitch</td>
            <td></td>
          </tr>
          <tr>
            <td>Overcoming Objections</td>
            <td></td>
          </tr>
          <tr>
            <td>Negotiations</td>
            <td></td>
          </tr>
          <tr>
            <td>Applicant Strength</td>
            <td></td>
          </tr>
          <tr>
            <td>Applicant's Weakness</td>
            <td></td>
          </tr>
          <tr>
            <td>Comments</td>
            <td></td>
          </tr>
          <tr>
            <td>Contract Sign</td>
            <td></td>
          </tr>
          <tr>
            <td>Evaluation</td>
            <td></td>
          </tr>
          <tr>
            <td>Recommend Hiring</td>
            <td></td>
          </tr>
          <tr>
            <td>Course Type Selection</td>
            <td></td>
          </tr>
          <tr>
            <td>Current Residence</td>
            <td></td>
          </tr>
          <tr>
            <td>Current City</td>
            <td></td>
          </tr>
          <tr>
            <td>Current Country</td>
            <td></td>
          </tr>
        </tbody>
      </div>
      </Col >
      <Col className='col-md-5'>
        <h1 className="m-4">HR Interview</h1>
        <Form onSubmit={handleSubmit}>
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
    </Container>
  );
}

export default Hrinterview;

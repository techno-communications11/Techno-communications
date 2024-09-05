import axios from 'axios';
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router';
// import { useNavigate } from 'react-router';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { Table, Form, Row, Col, Button, Container, Toast, Tabs, Tab, Modal, Dropdown } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import Accordion from 'react-bootstrap/Accordion';
import 'react-toastify/dist/ReactToastify.css';
import { MyContext } from '../pages/MyContext';
import { useContext } from 'react';

const Hrinterview = () => {
  // const navigate = useNavigate();
  const { applicant_uuid } = useContext(MyContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleShow = () => setShowConfirmation(true);

  const handleClose = () => setShowConfirmation(false);

  const handleConfirm = () => {
    // Show the toast message upon confirmation
    toast.success('Action confirmed!');
    setShowConfirmation(false);
    setTimeout(() => {
      navigate("/hrnew")
    }, 1800)
  };

  // State for showing toast and form data
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [firstRound, setFirstRound] = useState([])
  const [activeKey, setActiveKey] = useState(null); // State to manage active tab
  const [formData, setFormData] = useState({
    submissionDate: '',
    // name: '',
    email: '',
    // firstName: '',
    // lastName: '',
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
    verificationJoining: '',
    recommend_hiring: '',
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


      setFormData({
        submissionDate: '',
        // name: '',
        email: '',
        // firstName: '',
        // lastName: '',
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
        verificationJoining: '',
        recommend_hiring: '',
      });

      // Check if the response is successful
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/hrtabs'); // Correct spelling of navigate
        }, 1800);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit response.");
    } finally {

      // Adjust the timeout duration if needed
    }
  };

  useEffect(() => {

    const fetchingresponse = async () => {

      try {
        console.log("applicant_uuidProps...........................", applicant_uuid)
        const response = await axios.get(`http://localhost:5000/api/first_round_res/${applicant_uuid}`)
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
  }, [applicant_uuid])


  const noshowatinterview = async (applicant_uuid, action) => {
    console.log("status....", applicant_uuid);

    // Create the payload object to be sent in the request
    const payload = {
      applicant_uuid: applicant_uuid,
      action,
      // Include other data if needed, such as a comment

    };
    console.log("status....", applicant_uuid, payload.action);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/updatestatus`, payload);

      if (res.status === 200) {
        // Show success message
        toast.success(res.data.message);

        // Reload the page after a short delay
        setTimeout(() => {
          navigate("/hrtabs")
        }, 1800);
      }
    } catch (error) {
      console.error("Error updating no-show to interview:", error);
      // Show error message
      toast.error("Failed to update no-show status.");
    }
  };
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState('');
  const [selectedTrainerName, setSelectedTrainerName] = useState(null);
  const [applicantUuid, setApplicantUuid] = useState(''); // This should be set based on your use case
  const apiurl = process.env.REACT_APP_API; // Ensure this is set correctly
  const [showDropdown, setShowDropdown] = useState(true); // New state for controlling dropdown visibility
  const handleTrainerSelect = (eventKey) => {
    const selectedTrainer = trainers.find(trainer => trainer.name === eventKey);
    setSelectedTrainerName(selectedTrainer);
    setTrainerId(selectedTrainer.id)
    // if (selectedTrainer) {
    //   setTrainerId(id);
    //   setSelectedTrainerName(selectedTrainer.name);
    // }
  };
  useEffect(() => {
    // Fetch trainers list when component mounts
    const fetchTrainers = async () => {
      // console.log("trainers.................")
      try {
        const response = await axios.get(`${apiurl}/trainers`, {
          headers: getAuthHeaders(),
        });
        setTrainers(response.data);
        console.log("traines........", trainers)
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTrainers();
  }, [apiurl]);

  const sentForEvaluation = async () => {
    if (!trainerId) {
      alert('Please select a trainer.');
      return;
    }
    console.log(`${applicant_uuid} assing to ${trainerId}`)
    const payload = {
      applicant_uuid: applicant_uuid,
      trainer_id: trainerId,
    };
    console.log('Payload of trainer details', payload);

    try {
      const res = await axios.post(`${apiurl}/assign-trainer`, payload, {
        headers: getAuthHeaders(),
      });

      if (res.status === 200) {
        toast.success(res.data.message)
        setShowDropdown(false); // Hide the dropdown after successful assignment
        //  formData.recommend_hiring = ""; // Reset recommendation status if needed
      } else {
        alert('Failed to assign trainer.');
      }
    } catch (error) {
      console.error('Error assigning trainer:', error);
    }
  };


  return (
    <Container className="d-flex justify-content-center ">



      <Col md={8} lg={5} className="m-4">
        <h2 className='m-2'>{applicant_uuid} First Round Details</h2>
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
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="warning"
            onClick={() => noshowatinterview(applicant_uuid, 'no show at Interview')}
            className="mt-2"
          >
            No Show
          </Button>
          <Button
            variant="danger"
            onClick={() => noshowatinterview(applicant_uuid, 'rejected at Hr')}
            className="mt-2"
          >
            Rejected
          </Button>
        </div>

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
          {/* <Form.Group as={Row} className="mb-3">
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
          </Form.Group> */}

          {/* PLEASE ENTER YOUR EMAIL */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              2. PLEASE ENTER YOUR EMAIL
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
          {/* <Form.Group as={Row} className="mb-3">
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
          </Form.Group> */}

          {/* Last Name
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
          </Form.Group> */}

          {/* PLEASE ENTER THE APPLICANT ID */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              3. PLEASE ENTER THE APPLICANT ID
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
              4. PLEASE ENTER THE CANDIDATE'S EMAIL
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
              5. PLEASE ENTER THE MARKET WHERE THE APPLICANT IS GETTING HIRED FOR
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="name"
                name="market"
                value={formData.market}
                onChange={handleChange}
              >

              </Form.Control>
            </Col>
          </Form.Group>

          {/* WILL THE APPLICANT DIRECTLY GO TO THE MARKET HE IS BEING HIRED FOR OR A DIFFERENT MARKET FOR TRAINING */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              6. WILL THE APPLICANT DIRECTLY GO TO THE MARKET HE IS BEING HIRED FOR OR A DIFFERENT MARKET FOR TRAINING
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
              7. PLEASE ENTER WHERE WILL THE APPLICANT GO FOR TRAINING
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="name"
                name="trainingLocation"
                value={formData.trainingLocation}
                onChange={handleChange}
              >

              </Form.Control>
            </Col>
          </Form.Group>

          {/* COMPENSATION TYPE */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              8. COMPENSATION TYPE
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="name"
                name="compensationType"
                value={formData.compensationType}
                onChange={handleChange}
              >

              </Form.Control>
            </Col>
          </Form.Group>

          {/* PLEASE ENTER THE OFFERED SALARY */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              9. PLEASE ENTER THE OFFERED SALARY
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
              10. IS THE APPLICANT ON CURRENT OR BACK PAYROLL
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
              11. DID THE APPLICANT ACCEPT THE OFFER?
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
              12. IF THE APPLICANT HAS DECIDED TO THINK ABOUT IT PLEASE SELECT WHEN WILL HE RETURN BACK TO YOU
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
              13. PLEASE ENTER THE APPLICANT'S DATE OF JOINING
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
              14. OTHER NOTES/POINTERS
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
              15. IS THE APPLICANT A NO SHOW?
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
              16. PLEASE ENTER THE HOURS/DAYS THAT THE EMPLOYEE HAS PROMISED TO WORK
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
              17. WOULD YOU LIKE TO PROCEED WITH THE CANDIDATE?
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
              18. Applicant's Phone #
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
              19. Submission ID
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
              20. DID THE EMPLOYEE BACK OUT?
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
              21. IF SO WHY DID HE BACK OUT
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
              22. VERIFICATION OF JOINING
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
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              23. WOULD YOU RECOMMEND THE APPLICANT FOR HIRING?
            </Form.Label>
            <Col sm={6} className="text-start">
              <Form.Check
                type="radio"
                label="Yes"
                name="recommend_hiring"
                value="selected at Hr"  // Updated to send 'selected at Hr' as the value
                checked={formData.recommend_hiring === 'selected at Hr'}
                onChange={handleChange}
              // isInvalid={!!errors.recommend_hiring}
              />
              <Form.Check
                type="radio"
                label="No"
                name="recommend_hiring"
                value="rejected at Hr"  // Updated to send 'rejected at Hr' as the value
                checked={formData.recommend_hiring === 'rejected at Hr'}
                onChange={handleChange}
              // isInvalid={!!errors.recommend_hiring}
              />
              <Form.Check
                type="radio"
                label="Sent for Evaluation"
                name="recommend_hiring"
                value="Sent for Evaluation"
                checked={formData.recommend_hiring === 'Sent for Evaluation'}
                onChange={handleChange}
              // isInvalid={!!errors.recommend_hiring}
              />
              {formData.recommend_hiring === 'Sent for Evaluation' && showDropdown && <div className='p-2'>
                {/** Dropdown for selecting a trainer */}
                <Dropdown onSelect={handleTrainerSelect}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {selectedTrainerName ? selectedTrainerName.name : "Select Trainer"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {trainers.map((trainer) => (
                      <Dropdown.Item key={trainer.id} eventKey={trainer.name}>
                        {trainer.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/** Button to trigger assignment */}
                <Button className='p-2 m-1' onClick={() => sentForEvaluation(applicantUuid)}>Assign Trainer</Button>
              </div>}
              <Form.Check
                type="radio"
                label="Applicant will think about It"
                name="recommend_hiring"
                value="Applicant will think about It"
                checked={formData.recommend_hiring === 'Applicant will think about It'}
                onChange={handleChange}
              // isInvalid={!!errors.recommend_hiring}
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
      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to proceed?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}

      <ToastContainer />
    </Container >
  );
}

export default Hrinterview;

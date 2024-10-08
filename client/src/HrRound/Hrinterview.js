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
import decodeToken from '../decodedDetails';
import { ro } from 'date-fns/locale';

const Hrinterview = () => {
  const { applicant_uuid } = useContext(MyContext);
  const userData = decodeToken();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleShow = () => setShowConfirmation(true);
  useEffect(() => {
    if (applicant_uuid && applicant_uuid.length > 0) {
      sessionStorage.setItem("uuid", applicant_uuid);
    }
  }, [applicant_uuid]);
  let applicant_uuidprops = applicant_uuid || sessionStorage.getItem('uuid');
  const role = userData.role
  console.log("applicant_uuid1111111111111111111111111", applicant_uuidprops, role)
  const handleClose = () => setShowConfirmation(false);

  const handleConfirm = () => {
    // Show the toast message upon confirmation
    toast.success('Action confirmed!');
    setShowConfirmation(false);

    setTimeout(() => {
      if (role === "direct_hiring") {
        navigate("/directnew");
      } else {
        navigate("/hrnew");
      }
    }, 1800);
  };



  // State for showing toast and form data
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [firstRound, setFirstRound] = useState([])
  const [activeKey, setActiveKey] = useState(null); // State to manage active tab
  const [formData, setFormData] = useState({

    applicantId: applicant_uuidprops,

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

    workHoursDays: '',

    backOut: '',
    reasonBackOut: '',

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

        applicantId: '',

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

        workHoursDays: '',

        backOut: '',
        reasonBackOut: '',

        recommend_hiring: '',
      });

      // Check if the response is successful
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          if (role === "direct_hiring") {
            navigate("/directnew");
          } else {
            navigate("/hrtabs");
          }
        }, 1800);
        // setTimeout(() => {
        //   navigate('/hrtabs'); // Correct spelling of navigate
        // }, 1800);
        applicant_uuidprops = '';
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit response.");
    } finally {

      // Adjust the timeout duration if needed
    }
  };





  useEffect(() => {
    let isMounted = true;

    const fetchingresponse = async () => {

      if (!applicant_uuidprops) {
        console.log('No applicant UUID found.');
        return;
      }

      try {
        const response = await axios.get(`${apiurl}/first_round_res/${applicant_uuidprops}`);
        if (isMounted && response.data && response.data.length > 0) {
          setFirstRound(response.data[0]);
        } else {
          console.log("No data found");
        }
      } catch (err) {
        console.error("Error fetching first round data:", err);
      }
    };

    fetchingresponse();

    return () => {
      isMounted = false;  // Cleanup flag to avoid state updates after unmount
    };
  }, [applicant_uuidprops]);




  const noshowatinterview = async (applicant_uuidprops, action) => {
    console.log("status....", applicant_uuidprops);

    // Create the payload object to be sent in the request
    const payload = {
      applicant_uuid: applicant_uuidprops,
      action,
      // Include other data if needed, such as a comment

    };
    console.log("status....", applicant_uuidprops, payload.action);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/updatestatus`, payload);

      if (res.status === 200) {
        // Show success message
        if (toast) {
          toast.success(res.data.message);
        } else {
          console.error("Toast is undefined");
        };
        setTimeout(() => {
          if (role === "direct_hiring") {
            navigate("/directnew");
          } else {
            navigate("/hrtabs");
          }
        }, 1800);
        // Reload the page after a short delay
        // setTimeout(() => {
        //   navigate("/hrtabs")
        // }, 1800);
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
  const [applicantUuid, setApplicantUuid] = useState(sessionStorage.getItem('uuid')); // This should be set based on your use case
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
    console.log(`${applicant_uuidprops} assing to ${trainerId}`)
    const payload = {
      applicant_uuid: applicant_uuidprops,
      trainer_id: trainerId,
    };
    console.log('Payload of trainer details', payload);

    try {
      const res = await axios.post(`${apiurl}/assign-trainer`, payload, {
        headers: getAuthHeaders(),
      });

      if (res.status === 200) {
        if (toast) {
          toast.success(res.data.message);
        } else {
          console.error("Toast is undefined");
        }
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
        <h2 className='m-2'>{applicant_uuidprops} First Round Details</h2>
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
            onClick={() => noshowatinterview(applicant_uuidprops, 'no show at Interview')}
            className="mt-2"
          >
            No Show
          </Button>
          <Button
            variant="danger"
            onClick={() => noshowatinterview(applicant_uuidprops, 'rejected at Hr')}
            className="mt-2"
          >
            Rejected
          </Button>
        </div>

        <h2 className='m-2'>HR Interview Questions</h2>


        <Form onSubmit={handleSubmit} >



          {/* PLEASE SELECT THE MARKET WHERE THE APPLICANT IS GETTING HIRED FOR */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              1. PLEASE ENTER THE MARKET WHERE THE APPLICANT IS GETTING HIRED FOR
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
              2. WILL THE APPLICANT DIRECTLY GO TO THE MARKET HE IS BEING HIRED FOR OR A DIFFERENT MARKET FOR TRAINING
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
              3. PLEASE ENTER WHERE WILL THE APPLICANT GO FOR TRAINING
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
              4. COMPENSATION TYPE
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
              5. PLEASE ENTER THE OFFERED SALARY
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
              6. IS THE APPLICANT ON CURRENT OR BACK PAYROLL
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
              7. DID THE APPLICANT ACCEPT THE OFFER?
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
              8. IF THE APPLICANT HAS DECIDED TO THINK ABOUT IT PLEASE SELECT WHEN WILL HE RETURN BACK TO YOU
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
              9. PLEASE ENTER THE APPLICANT'S DATE OF JOINING
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




          {/* PLEASE ENTER THE HOURS/DAYS THAT THE EMPLOYEE HAS PROMISED TO WORK */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              10. PLEASE ENTER THE HOURS/DAYS THAT THE EMPLOYEE HAS PROMISED TO WORK
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


          {/* DID THE EMPLOYEE BACK OUT? */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              11. DID THE EMPLOYEE BACK OUT?
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
              12. IF SO WHY DID HE BACK OUT
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

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              13. WOULD YOU RECOMMEND THE APPLICANT FOR HIRING?
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

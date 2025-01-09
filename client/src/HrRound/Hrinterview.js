import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { Form, Row, Col, Button, Container, Modal, Dropdown } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import Accordion from 'react-bootstrap/Accordion';
import 'react-toastify/dist/ReactToastify.css';
import { MyContext } from '../pages/MyContext';
import { useContext } from 'react';
import decodeToken from '../decodedDetails';
import Select from "react-select";
const Hrinterview = () => {
  const { applicant_uuid } = useContext(MyContext);
  const userData = decodeToken();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [jobId,setJobId]=useState('')

 
  let applicant_uuidprops = applicant_uuid || sessionStorage.getItem('uuid');
  const role = userData.role
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

  const validateForm = () => {
    const errors = {};
    const fields = [
      'market', 'marketTraining', 'trainingLocation', 'compensationType',
      'payroll', 'joiningDate', 'workHoursDays',
      'recommend_hiring',
    ];

    fields.forEach(field => {
      const value = formData[field];

      if (value === undefined || value === null || typeof value !== 'string' || value.trim() === '') {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`;
      }
    });

    const dateFields = ['joiningDate'];
    dateFields.forEach(field => {
      const parsedDate = Date.parse(formData[field]);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (!isNaN(parsedDate)) {
        if (parsedDate < currentDate) {
          errors[field] = `${field.replace(/([A-Z])/g, ' ')} must be today or in the future.`;
        }
      } else {
        errors[field] = `${field.replace(/([A-Z])/g, ' ')} is invalid.`;
      }
    });

    return errors;
  };
  const locations = [
    { id: 4, name: 'ARIZONA' },
    { id: 5, name: 'Bay Area' },
    { id: 6, name: 'COLORADO' },
    { id: 7, name: 'DALLAS' },
    { id: 8, name: 'El Paso' },
    { id: 9, name: 'FLORIDA' },
    { id: 10, name: 'HOUSTON' },
    { id: 11, name: 'LOS ANGELES' },
    { id: 12, name: 'MEMPHIS' },
    { id: 13, name: 'NASHVILLE' },
    { id: 14, name: 'NORTH CAROLINA' },
    { id: 15, name: 'SACRAMENTO' },
    { id: 16, name: 'SAN DIEGO' },
    { id: 17, name: 'SAN FRANCISCO' },
    { id: 18, name: 'SAN JOSE' },
    { id: 19, name: 'SANTA ROSA' },
    { id: 21, name: 'RELOCATION' },
  ];
  const navigate = useNavigate();
  const [firstRound, setFirstRound] = useState([])
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
    disclosed: '',
    reasonBackOut: '',
    // Job_id: '',
    recommend_hiring: '',
    evaluationDate: '',
    offDays: [],

  });
  const options = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
    { value: "OPEN", label: "Open" },
  ];
  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      offDays: selectedOptions ? selectedOptions.map(option => option.value) : []
    });
  };

  useEffect(() => {
    const getJobId = async () => {
      console.log(formData.market, "ffms");
      try {
        const response = await axios.get(`${apiurl}/get_jobId?location=${formData.market}`);
        if (response.status === 200) {
          setJobId(response.data.id); 
          console.log(response.data.id,"ids")
        }
      } catch (error) {
        console.error("Error fetching job ID:", error); // Log the error for debugging
      }
    };
  
    if (formData.market) {
      getJobId(); // Fetch job ID only if market is available
    }
  }, [formData.market]);
  
  



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'workHoursDays' && formData.timeType === 'days') {
      if (value < 1 || value > 7) {
        setErrors({
          ...errors,
          workHoursDays: 'Please enter a value between 1 and 7 for days',
        });
      } else {
        setErrors({ ...errors, workHoursDays: '' });
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setErrors({ ...errors, workHoursDays: '' });
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      if (type === 'checkbox') {
        if (checked) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [name]: "" // Clear the error for the checkbox field
          }));
        }
      } else {
        if (value.trim() !== "") {
          if (name === 'joiningDate') {
            const parsedDate = Date.parse(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set current date to midnight for comparison
            if (!isNaN(parsedDate)) {
              if (parsedDate >= currentDate) {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  [name]: "" // Clear the error for valid date fields
                }));
              } else {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  [name]: `${name.replace(/([A-Z])/g, ' $1')} must be today or in the future.`
                }));
              }
            } else {
              setErrors(prevErrors => ({
                ...prevErrors,
                [name]: `${name.replace(/([A-Z])/g, ' ')} is invalid.`
              }));
            }
          } else {
            setErrors(prevErrors => ({
              ...prevErrors,
              [name]: "" // Clear the error for the other fields
            }));
          }
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            [name]: `${name.replace(/([A-Z])/g, ' ')} is required.` // Show error message
          }));
        }
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post(`${apiurl}/add-hrevaluation`, formData);
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
        disclosed: '',
        reasonBackOut: '',
        // Job_id:'',
        recommend_hiring: '',
        evaluationDate: "",
      });
      // updateChoosen(jobId,"idssssssssss") 
      if (response.status === 200) {
       
        // console.log("api calling...")
        toast.success(response.data.message);
        setTimeout(() => {
          if (role === "direct_hiring") {
            navigate("/directnew");
          } else {
            navigate("/hrtabs");
          }
        }, 1800);
      
        applicant_uuidprops = '';
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit response.");
    }
  };

  useEffect(() => {
    if (formData.recommend_hiring === 'selected at Hr'
      //  && jobId
      //  && formData.Job_id !== jobId
      ) {
      setFormData(prevFormData => ({
        ...prevFormData,
        // Job_id: jobId,
      }));
    }
  }, [jobId, formData.recommend_hiring]);
  
  

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

    const payload = {
      applicant_uuid: applicant_uuidprops,
      action,
      // Include other data if needed, such as a comment

    };
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
       
      }
    } catch (error) {
      console.error("Error updating no-show to interview:", error);
      // Show error message
      toast.error("Failed to update no-show status.");
    }
  };
  const [trainers, setTrainers] = useState([]);
  const apiurl = process.env.REACT_APP_API; // Ensure this is set correctly
  

  useEffect(() => {
    // Fetch trainers list when component mounts
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(`${apiurl}/trainers`, {
          headers: getAuthHeaders(),
        });
        setTrainers(response.data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTrainers();
  }, [apiurl]);

  
 


 
  const handleTimeTypeChange = (e) => {
    const { value } = e.target;

    // Reset the workHoursDays field when timeType is changed
    setFormData({
      ...formData,
      timeType: value,
      workHoursDays: '', // Clear the input field when switching between hours and days
    });
    setErrors({ ...errors, workHoursDays: '' }); // Reset errors when switching
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
              <Form.Select
                name="market"
                value={formData.market}
                onChange={handleChange}
                isInvalid={!!errors.market}
              >
                <option value="">Select Market</option> {/* Default empty option */}
                {locations.map(location => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </Form.Select>
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
                isInvalid={!!errors.marketTraining}
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
              <Form.Select
                name="trainingLocation"
                value={formData.trainingLocation}
                onChange={handleChange}
                isInvalid={!!errors.trainingLocation}
              >
                <option value="">Select Training Location</option> {/* Default empty option */}
                {locations.map(location => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </Form.Select>
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
                isInvalid={!!errors.compensationType}
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
                isInvalid={!!errors.payroll}
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
                isInvalid={!!errors.acceptOffer}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="acceptOffer"
                value="No"
                checked={formData.acceptOffer === 'No'}
                // isInvalid={!!errors.acceptOffer}
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
                // isInvalid={!!errors.returnDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} // Disable previous dates
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
                isInvalid={!!errors.joiningDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} // Disable previous dates
              />
            </Col>
          </Form.Group>




          {/* PLEASE ENTER THE HOURS/DAYS THAT THE EMPLOYEE HAS PROMISED TO WORK */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              10. PLEASE SELECT HOURS OR DAYS THAT THE EMPLOYEE HAS PROMISED TO WORK
            </Form.Label>
            <Col sm={6}>
              <Form.Select
                name="timeType"
                value={formData.timeType}
                onChange={handleTimeTypeChange} // Separate handler for timeType change
                aria-label="Select hours or days"
              >
                <option value="">Select Hours or Days</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              {formData.timeType === 'days'
                ? 'Enter days (1-7)'
                : 'Enter hours'}
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="workHoursDays"
                placeholder={`Enter ${formData.timeType}`}
                value={formData.workHoursDays}
                isInvalid={!!errors.workHoursDays}
                onChange={handleChange}
                disabled={!formData.timeType} // Disabled when no type selected
              />
              {errors.workHoursDays && (
                <Form.Text style={{ color: 'red' }}>
                  {errors.workHoursDays}
                </Form.Text>
              )}
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
                // isInvalid={!!errors.backOut}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="backOut"
                value="No"
                checked={formData.backOut === 'No'}
                isInvalid={!!errors.backOut}
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
                // isInvalid={!!errors.reasonBackOut}
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
                isInvalid={!!errors.recommend_hiring}
              />
              <Form.Check
                type="radio"
                label="No"
                name="recommend_hiring"
                value="rejected at Hr"  // Updated to send 'rejected at Hr' as the value
                checked={formData.recommend_hiring === 'rejected at Hr'}
                onChange={handleChange}
                isInvalid={!!errors.recommend_hiring}
              />
              
              <Form.Group as={Row} className="mb-3">
                <Col sm={12}>
                  <Form.Check
                    type="radio"
                    label="Store Evaluation"
                    name="recommend_hiring"
                    value="Store Evaluation"
                    checked={formData.recommend_hiring === 'Store Evaluation'}
                    isInvalid={!!errors.recommend_hiring}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Spanish Evaluation"
                    name="recommend_hiring"
                    value="Spanish Evaluation"
                    checked={formData.recommend_hiring === 'Spanish Evaluation'}
                    isInvalid={!!errors.recommend_hiring}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Will think about it"
                    name="recommend_hiring"
                    value="Applicant will think about It"
                    checked={formData.recommend_hiring === 'Applicant will think about It'}
                    isInvalid={!!errors.recommend_hiring}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              {formData.recommend_hiring === 'Store Evaluation' && (
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={12} className="text-start">
                    Select evaluation date:
                  </Form.Label>
                  <Col sm={12}>
                    <Form.Control
                      type="date"
                      name="evaluationDate"
                      value={formData.evaluationDate}
                      onChange={handleChange}
                      isInvalid={!!errors.evaluationDate}
                      min={new Date().toISOString().split("T")[0]} // Disable previous dates
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.evaluationDate}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

              )}

             
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
                // isInvalid={!!errors.notes}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              15. Contract Disclosed?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="disclosed"
                value="Yes"
                checked={formData.disclosed === 'Yes'}
                // isInvalid={!!errors.disclosed}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="disclosed"
                value="No"
                checked={formData.disclosed === 'No'}
                isInvalid={!!errors.disclosed}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              Select Off Days
            </Form.Label>
            <Col sm={6}>
              <Select
                isMulti
                name="offDays"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleSelectChange}
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

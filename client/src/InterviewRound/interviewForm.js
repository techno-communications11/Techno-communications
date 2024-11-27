import React, { useState } from "react";
import { Form, Row, Col, Button, Container, Modal } from "react-bootstrap";
import { getAuthHeaders } from "../Authrosization/getAuthHeaders";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ApplicantForm = ({
  applicant_uuidProps,
  applicantEmail,
  applicantPhone,
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // const handleShow = () => setShowConfirmation(true);
  const handleClose = () => setShowConfirmation(false);

  const handleConfirm = () => {
    // Show the toast message upon confirmation
    toast.success("Action confirmed!");
    setShowConfirmation(false);
    setTimeout(() => {
      navigate("/interviewhome");
    }, 1800);
  };

  const naviagte = useNavigate();
  const [formData, setFormData] = useState({
    applicant_uuid: applicant_uuidProps,
    applicants_age: "",
    applicants_gender: "",
    email_on_file: applicantEmail,
    country: "",
    city: "",
    interviewed_before: false,
    visa_category: "",
    education_level: "",
    major_in: "",
    currently_studying: "",
    university_name: "",
    course_type: "",
    semester: "",
    had_car: "",
    family_operate_ti: "",
    cellphone_carrier: "",
    worked_before: false,
    currently_employed: false,
    current_company: "",
    current_job_in_ti: false,
    hours_of_daily_work: "",
    daily_wage: "",
    compensation_type: "",
    reason_to_leave: "",
    cellular_experience: "",
    name_tele_company_name: "",
    experience_of_tele: "",
    type_of_work_doing: "",
    other_employment_exp: "",
    foreign_work_exp: "",
    mention_line_exp: "",
    appearance: "",
    personality: "",
    confidence: "",
    communication_skills: "",
    pitch: "",
    overcoming_objections: "",
    negotiations: "",
    applicant_strength: "",
    applicants_weakness: "",
    comments: "",
    contract_sign: "",
    evaluation: "",
    recommend_hiring: "",
    current_city: "",
    current_country: "",
    
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    const fields = [
      "applicant_uuid",
      "applicants_age",
      "applicants_gender",
      "email_on_file",
      "country",
      "city",
      "visa_category",
      "education_level",
      "major_in",
      "university_name",
      "course_type",
      "semester",
      "current_company",
      "hours_of_daily_work",
      "daily_wage",
      "compensation_type",
      "reason_to_leave",
      "cellular_experience",
      "name_tele_company_name",
      "experience_of_tele",
      "type_of_work_doing",
      "foreign_work_exp",
      "mention_line_exp",
      "appearance",
      "personality",
      "confidence",
      "communication_skills",
      "pitch",
      "overcoming_objections",
      "negotiations",
      "applicant_strength",
      "applicants_weakness",
      "comments",
      "contract_sign",
      "evaluation",
      "recommend_hiring",
      
      "current_city",
      "current_country",
      
    ];

    fields.forEach((field) => {
      const value = formData[field];

      if (value === undefined || value === null) {
        errors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    // Handle boolean fields separately
    const booleanFields = [
      "interviewed_before",
      "currently_studying",
      "had_car",
      "family_operate_ti",
      "other_employment_exp",
      "cellphone_carrier",
      "worked_before",
      "currently_employed",
      "current_job_in_ti",
    ];

    booleanFields.forEach((field) => {
      if (formData[field] === undefined || formData[field] === null) {
        errors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "radio" ? value : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    // console.log("cliked", applicantEmail);
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
//  console.log(formData,'fmd')

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/add-evaluation`,
        formData,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 200) {
        toast.success("response submitted successfully!");
        // console.log(formData);
        setTimeout(() => {
          // setShowToast(true);
          naviagte("/interviewhome");
          // Reload the page after the toast disappears
        }, 1800);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed submit response.");
    } finally {
      // setShowToast(false);
    }
  };
  const noshowatinterview = async (applicant_uuid) => {
    // console.log("status....", applicant_uuid);

    // Create the payload object to be sent in the request
    const payload = {
      applicant_uuid: applicant_uuid,
      action: "no show at Interview",
      // Include other data if needed, such as a comment
    };
    // console.log("status....", applicant_uuid, payload.action);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/updatestatus`,
        payload
      );

      if (res.status === 200) {
        // Show success message
        toast.success(res.data.message);

        // Reload the page after a short delay
        setTimeout(() => {
          naviagte("/interviewhome");
        }, 1800);
      }
    } catch (error) {
      console.error("Error updating no-show to interview:", error);
      // Show error message
      toast.error("Failed to update no-show status.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Col
        lg={8}
        className="border px-5 mt-5"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        {/* Flex container to align button to the right */}
        <div className="d-flex justify-content-end">
          <Button
            variant="warning"
            onClick={() => noshowatinterview(applicant_uuidProps)}
            className="mt-2"
          >
            No Show
          </Button>
        </div>

        <h1 className="m-4">
          {applicant_uuidProps} Applicant Information Form
        </h1>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              1. Enter Applicant uuid
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="applicant_uuid"
                placeholder={applicant_uuidProps}
                value={formData.applicant_uuid}
                onChange={handleChange}
                // isInvalid={!!errors.applicant_uuid}
                readOnly
              ></Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              2. WHAT IS THE APPLICANT'S AGE
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="number"
                name="applicants_age" // Add name attribute for the state
                value={formData.applicants_age} // Bind value to state
                placeholder="Enter age"
                onChange={handleChange}
                isInvalid={!!errors.applicants_age} // Handle changes with a change handler
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              3. APPLICANT'S GENDER
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="applicants_gender" // Add name attribute for the state
                value={formData.applicants_gender} // Bind value to state
                onChange={handleChange}
                isInvalid={!!errors.applicants_gender} // Handle changes with a change handler
              >
                <option value="" disabled>
                  Select Gender{" "}
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              4. APPLICANT'S EMAIL ON FILE.
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="email"
                name="email_on_file" // Add name attribute for the state
                value={formData.applicantEmail} // Bind value to state
                placeholder={applicantEmail}
                // Placeholder text
                onChange={handleChange}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              5. APPLICANT'S MOBILE NUM ON FILE.
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="phone"
                name="phone_on_file" // Add name attribute for the state
                // value={formData.applicantEmail} // Bind value to state
                placeholder={applicantPhone}
                // Placeholder text
                onChange={handleChange}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              6. PLEASE SELECT THE COUNTRY
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="current_country"
                value={formData.current_country}
                onChange={handleChange}
                isInvalid={!!errors.current_country}
              >
                <option value={formData.current_country}>
                  {!formData.current_country
                    ? "Select a country"
                    : formData.current_country}
                </option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="India">India</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              7. WHAT CITY IS HE IN?
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                placeholder="Enter city"
                name="current_city"
                value={formData.current_city}
                onChange={handleChange}
                isInvalid={!!errors.current_city}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              8.PLEASE ENTER THE HOME COUNTRY
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="country" // Add name attribute for the state
                value={formData.country}
                placeholder="Enter Home Country" // Bind selected value to formData
                onChange={handleChange}
                isInvalid={!!errors.country} // Handle changes with a change handler
              ></Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              9. PLEASE ENTER THE HOME CITY
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="city" // Add name attribute
                placeholder="Enter  Home city"
                value={formData.city} // Bind value to formData
                onChange={handleChange}
                isInvalid={!!errors.city} // Handle changes with a change handler
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              10. HAS THE APPLICANT INTERVIEWED WITH US BEFORE?
            </Form.Label>
            <Col sm={6} className="text-start">
              <Form.Check
                type="checkbox"
                name="interviewed_before"
                checked={formData.interviewed_before} // Bind the checked attribute to formData
                onChange={handleChange}
                isInvalid={!!errors.interviewed_before} // Handle changes with a change handler
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              11. WHAT VISA CATEGORY IS THE APPLICANT ON
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text" // Change 'as="select"' to 'type="text"'
                name="visa_category" // Add name attribute
                value={formData.visa_category} // Bind value attribute to formData
                onChange={handleChange} // Handle changes with a change handler
                isInvalid={!!errors.visa_category} // Display validation error if needed
              />
              <Form.Control.Feedback type="invalid">
                {errors.visa_category} {/* Display error message */}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              12. CURRENT LEVEL OF COMPLETED EDUCATION
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="education_level" // Add name attribute
                value={formData.education_level} // Bind value attribute to formData
                onChange={handleChange}
                isInvalid={!!errors.education_level} // Handle changes with a change handler
              >
                <option>High School</option>
                <option>Associate's Degree</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>PhD</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              13. WHAT DID THEY MAJOR IN
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="major_in" // Add name attribute
                value={formData.major_in} // Bind value attribute to formData
                placeholder="Enter major"
                onChange={handleChange}
                isInvalid={!!errors.major_in} // Handle changes with a change handler
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              14. ARE YOU CURRENTLY STUDYING
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="currently_studying"
                value={formData.currently_studying === "Yes"}
                onChange={handleChange}
                isInvalid={!!errors.currently_studying}
              />
              <Form.Check
                type="radio"
                label="No"
                name="currently_studying"
                value={formData.currently_studying === "No"}
                onChange={handleChange}
                isInvalid={!!errors.currently_studying}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              15. ENTER THE NAME OF THE UNIVERSITY
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="university_name"
                placeholder="Enter university name"
                value={formData.university_name}
                onChange={handleChange}
                isInvalid={!!errors.university_name}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              16. COURSE TYPE
            </Form.Label>
            <Col sm={6} className="text-start">
              <Form.Check
                type="radio"
                label="Online"
                name="course_type"
                id="courseTypeOnline"
                value="Online"
                checked={formData.course_type === "Online"}
                onChange={handleChange}
                isInvalid={!!errors.course_type}
              />
              <Form.Check
                type="radio"
                label="In-Person"
                name="course_type"
                id="courseTypeInPerson"
                value="In-Person"
                checked={formData.course_type === "In-Person"}
                onChange={handleChange}
                isInvalid={!!errors.course_type}
              />
              <Form.Check
                type="radio"
                label="Hybrid"
                name="course_type"
                id="courseTypeHybrid"
                value="Hybrid"
                checked={formData.course_type === "Hybrid"}
                onChange={handleChange}
                isInvalid={!!errors.course_type}
              />
              <Form.Control.Feedback type="invalid">
                {errors.course_type}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              17. PLEASE MENTION THE SEMESTER HE/SHE IS IN
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="semester"
                placeholder="Enter semester"
                value={formData.semester}
                onChange={handleChange}
                isInvalid={!!errors.semester}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              18. DOES THE APPLICANT HAVE A CAR?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                id="hasCarYes"
                name="had_car"
                label="Yes"
                value={formData.had_car === "Yes"}
                onChange={handleChange}
                isInvalid={!!errors.had_car}
              />
              <Form.Check
                type="radio"
                id="hasCarNo"
                name="had_car"
                label="No"
                value={formData.had_car === "No"}
                onChange={handleChange}
                isInvalid={!!errors.had_car}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              19. DOES APPLICANT'S FRIENDS/FAMILY WORK/OPERATE IN THE
              TELECOMMUNICATION INDUSTRY? (OWN STORES)
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                id="friendsFamilyYes"
                name="family_operate_ti"
                label="Yes"
                value={formData.family_operate_ti === "Yes"}
                onChange={handleChange}
                isInvalid={!!errors.family_operate_ti}
              />
              <Form.Check
                type="radio"
                id="friendsFamilyNo"
                name="family_operate_ti"
                label="No"
                value={formData.family_operate_ti === "No"}
                onChange={handleChange}
                isInvalid={!!errors.family_operate_ti}
              />
            </Col>
          </Form.Group>

          {/* Cellphone Carrier */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              20. WHAT CELLPHONE CARRIER DO THEY WORK FOR
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="cellphone_carrier"
                placeholder="Enter cellphone carrier"
                value={formData.cellphone_carrier || ""}
                onChange={handleChange}
                isInvalid={!!errors.cellphone_carrier}
              />
            </Col>
          </Form.Group>

          {/* Worked in US */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              21. HAS THE APPLICANT WORKED IN THE US BEFORE?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                name="worked_before"
                label="Yes"
                value={formData.worked_before === "Yes"}
                onChange={handleChange}
                isInvalid={!!errors.worked_before}
              />
              <Form.Check
                type="radio"
                name="worked_before"
                label="No"
                value={formData.worked_before === "No"}
                onChange={handleChange}
                isInvalid={!!errors.worked_before}
              />
            </Col>
          </Form.Group>

          {/* Current Employment */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              22. IS THE APPLICANT CURRENTLY EMPLOYED
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                name="currently_employed"
                label="Yes"
                value={formData.currently_employed === "Yes"}
                onChange={handleChange}
                isInvalid={!!errors.currently_employed}
              />
              <Form.Check
                type="radio"
                name="currently_employed"
                label="No"
                value={formData.currently_employed === "No"}
                onChange={handleChange}
                isInvalid={!!errors.currently_employed}
              />
            </Col>
          </Form.Group>

          {/* Company Name */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              23. PLEASE MENTION THE COMPANY
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="current_company"
                placeholder="Enter company name"
                value={formData.current_company || ""}
                onChange={handleChange}
                isInvalid={!!errors.current_company}
              />
            </Col>
          </Form.Group>

          {/* Job in Telecom */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              24. IS THE CURRENT JOB IN TELECOMMUNICATION INDUSTRY?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="current_job_in_ti"
                value={formData.current_job_in_ti === "Yes"}
                onChange={handleChange}
                isInvalid={!!errors.current_job_in_ti}
              />
              <Form.Check
                type="radio"
                label="No"
                name="current_job_in_ti"
                value={formData.current_job_in_ti === "No"}
                onChange={handleChange}
                isInvalid={!!errors.current_job_in_ti}
              />
            </Col>
          </Form.Group>

          {/* Hours Worked */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              25. HOW MANY HOURS A WEEK DOES HE/SHE WORK
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="number"
                placeholder="Enter hours per week"
                name="hours_of_daily_work"
                value={formData.hours_of_daily_work || ""}
                onChange={handleChange}
                isInvalid={!!errors.hours_of_daily_work}
              />
            </Col>
          </Form.Group>

          {/* Salary */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              26. HOW MUCH DOES HE MAKE
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                placeholder="Enter salary"
                name="daily_wage"
                value={formData.daily_wage || ""}
                onChange={handleChange}
                isInvalid={!!errors.daily_wage}
              />
            </Col>
          </Form.Group>

          {/* Type of Compensation */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              27. TYPE OF COMPENSATION?
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="compensation_type"
                onChange={handleChange}
                isInvalid={!!errors.compensation_type}
                value={formData.compensation_type || ""}
              >
                <option value="">Select an option</option>
                <option value="Salary">Salary</option>
                <option value="Hourly">Hourly</option>
                <option value="Commission">Commission</option>
                <option value="Other">Other</option>
                {/* Add more options as needed */}
              </Form.Control>
            </Col>
          </Form.Group>

          {/* Reason for Leaving */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              28. WHY DOES HE WANT TO LEAVE?
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter reason"
                name="reason_to_leave"
                value={formData.reason_to_leave || ""}
                onChange={handleChange}
                isInvalid={!!errors.reason_to_leave}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              29. DOES THE EMPLOYEE HAVE ANY CELLULAR EXPERIENCE
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="cellular_experience"
                value="YES"
                checked={formData.cellular_experience === "YES"}
                onChange={handleChange}
                isInvalid={!!errors.cellular_experience}
              />
              <Form.Check
                type="radio"
                label="No"
                name="cellular_experience"
                value="NO"
                checked={formData.cellular_experience === "NO"}
                onChange={handleChange}
                isInvalid={!!errors.cellular_experience}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cellular_experience}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Previous Telecom Work */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              30. PLEASE MENTION THE NAME WHERE HE WORKED IN TELECOMMUNICATION
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                name="name_tele_company_name"
                value={formData.name_tele_company_name || ""}
                onChange={handleChange}
                isInvalid={!!errors.name_tele_company_name}
              />
            </Col>
          </Form.Group>

          {/* Duration of Telecom Work */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              31. HOW LONG DID HE/SHE WORK THERE?
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                placeholder="Enter duration"
                name="experience_of_tele"
                value={formData.experience_of_tele || ""}
                onChange={handleChange}
                isInvalid={!!errors.experience_of_tele}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              32. WHAT IS THE KIND OF WORK HE IS DOING RIGHT NOW
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                placeholder="Enter current work"
                name="type_of_work_doing"
                value={formData.type_of_work_doing || ""}
                onChange={handleChange}
                isInvalid={!!errors.type_of_work_doing}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              33. MENTION ANY OTHER EMPLOYMENT EXPERIENCE SEPARATE BY EACH LINE.
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter other employment experience"
                name="other_employment_exp"
                value={formData.other_employment_exp || ""}
                onChange={handleChange}
                isInvalid={!!errors.other_employment_exp}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              34. DOES THE EMPLOYEE HAVE FOREIGN WORK EXPERIENCE?
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Yes"
                name="foreign_work_exp"
                value={formData.foreign_work_exp === "Yes"}
                onChange={handleChange}
                isInvalid={!!errors.foreign_work_exp}
              />
              <Form.Check
                type="radio"
                label="No"
                name="foreign_work_exp"
                value={formData.foreign_work_exp === "No"}
                onChange={handleChange}
                isInvalid={!!errors.foreign_work_exp}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              35. PLEASE MENTION THE FOREIGN EXPERIENCE (SEPARATE BY EACH LINE)
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter foreign work experience"
                name="mention_line_exp"
                value={formData.mention_line_exp}
                onChange={handleChange}
                isInvalid={!!errors.mention_line_exp}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              36. APPEARANCE & DEMEANOR
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Poor"
                name="appearance"
                value="poor"
                checked={formData.appearance === "poor"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Good"
                name="appearance"
                value="good"
                checked={formData.appearance === "good"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Excellent"
                name="appearance"
                value="excellent"
                checked={formData.appearance === "excellent"}
                onChange={handleChange}
                inline
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              37. PERSONALITY
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Poor"
                name="personality"
                value="poor"
                checked={formData.personality === "poor"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Good"
                name="personality"
                value="good"
                checked={formData.personality === "good"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Excellent"
                name="personality"
                value="excellent"
                checked={formData.personality === "excellent"}
                onChange={handleChange}
                inline
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              38. CONFIDENCE
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Poor"
                name="confidence"
                value="poor"
                checked={formData.confidence === "poor"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Good"
                name="confidence"
                value="good"
                checked={formData.confidence === "good"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Excellent"
                name="confidence"
                value="excellent"
                checked={formData.confidence === "excellent"}
                onChange={handleChange}
                inline
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              39. COMMUNICATION SKILLS
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Poor"
                name="communication_skills"
                value="poor"
                checked={formData.communication_skills === "poor"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Good"
                name="communication_skills"
                value="good"
                checked={formData.communication_skills === "good"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Excellent"
                name="communication_skills"
                value="excellent"
                checked={formData.communication_skills === "excellent"}
                onChange={handleChange}
                inline
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              37. PITCH
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Poor"
                name="pitch"
                value="poor"
                checked={formData.pitch === "poor"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Good"
                name="pitch"
                value="good"
                checked={formData.pitch === "good"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Excellent"
                name="pitch"
                value="excellent"
                checked={formData.pitch === "excellent"}
                onChange={handleChange}
                inline
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              40. OVERCOMING OBJECTIONS
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Poor"
                name="overcoming_objections"
                value="poor"
                checked={formData.overcoming_objections === "poor"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Good"
                name="overcoming_objections"
                value="good"
                checked={formData.overcoming_objections === "good"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Excellent"
                name="overcoming_objections"
                value="excellent"
                checked={formData.overcoming_objections === "excellent"}
                onChange={handleChange}
                inline
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              41. NEGOTIATION
            </Form.Label>
            <Col sm={6}>
              <Form.Check
                type="radio"
                label="Poor"
                name="negotiations"
                value="poor"
                checked={formData.negotiations === "poor"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Good"
                name="negotiations"
                value="good"
                checked={formData.negotiations === "good"}
                onChange={handleChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Excellent"
                name="negotiations"
                value="excellent"
                checked={formData.negotiations === "excellent"}
                onChange={handleChange}
                inline
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              42. WHAT ARE THE STRENGTHS OF THE APPLICANT
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter strengths"
                name="applicant_strength"
                value={formData.applicant_strength}
                onChange={handleChange}
                isInvalid={!!errors.applicant_strength}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              43. WHAT ARE THE WEAKNESSES OF THE APPLICANT
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter weaknesses"
                name="applicants_weakness"
                value={formData.applicants_weakness}
                onChange={handleChange}
                isInvalid={!!errors.applicants_weakness}
              />
            </Col>
          </Form.Group>
          
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              44. HOW LONG OF A CONTRACT CAN THE APPLICANT SIGN IF GIVEN JOB
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                placeholder="Enter contract duration"
                name="contract_sign"
                value={formData.contract_sign}
                onChange={handleChange}
                isInvalid={!!errors.contract_sign}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              45. PLEASE WRITE A SUMMARY RECOMMENDATION/EVALUATION
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter recommendation/evaluation"
                name="evaluation"
                value={formData.evaluation}
                onChange={handleChange}
                isInvalid={!!errors.evaluation}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              46. WOULD YOU RECOMMEND THE APPLICANT FOR HIRING?
            </Form.Label>
            <Col sm={6} className="text-start">
              <Form.Check
                type="radio"
                label="Yes"
                name="recommend_hiring"
                value="selected at interview" // Updated to send 'selected at interview' as the value
                checked={formData.recommend_hiring === "selected at interview"}
                onChange={handleChange}
                isInvalid={!!errors.recommend_hiring}
              />
              <Form.Check
                type="radio"
                label="No"
                name="recommend_hiring"
                value="rejected at interview" // Updated to send 'rejected at interview' as the value
                checked={formData.recommend_hiring === "rejected at interview"}
                onChange={handleChange}
                isInvalid={!!errors.recommend_hiring}
              />
              <Form.Check
                type="radio"
                label="Put on Hold at Interview"
                name="recommend_hiring"
                value="put on hold at interview"
                checked={
                  formData.recommend_hiring === "put on hold at interview"
                }
                onChange={handleChange}
                isInvalid={!!errors.recommend_hiring}
              />
              <Form.Check
                type="radio"
                label="Need Second Opinion at Interview"
                name="recommend_hiring"
                value="need second opinion at interview"
                checked={
                  formData.recommend_hiring ===
                  "need second opinion at interview"
                }
                onChange={handleChange}
                isInvalid={!!errors.recommend_hiring}
              />
            </Col>
          </Form.Group>

          
           <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              47. ADDITIONAL NOTES & COMMENTS
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter additional notes"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                isInvalid={!!errors.comments}
              />
            </Col>
          </Form.Group> 

          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 6, offset: 6 }}>
              <Button type="submit" onClick={handleSubmit}>
                Submit Details
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Col>
      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>This Applicant Did Not Show Up</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default ApplicantForm;

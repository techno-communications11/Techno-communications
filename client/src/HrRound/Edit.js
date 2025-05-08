import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchMarkets from "../Hooks/useFetchMarkets";

const Edit = () => {
  const location = useLocation(); // Used to access the profile passed from navigate()
  const { profile } = location.state || {}; // Accessing profile from passed state
  const apiurl = process.env.REACT_APP_API;
  const { markets } = useFetchMarkets();

  const [formData, setFormData] = useState({
    applicantId: profile.applicant_id || "",
    market: profile.market || "",
    marketTraining: profile.market_training || "",
    trainingLocation: profile.training_location || "",
    compensationType: profile.compensation_type || "",
    offeredSalary: profile.offered_salary || "",
    payroll: profile.payroll || "",
    acceptOffer: profile.accept_offer || "",
    returnDate: profile.return_date || "",
    joiningDate: profile.joining_date || "",
    notes: profile.notes || "",
    workHoursDays: profile.work_hours_days || "",
    backOut: profile.back_out || "",
    reasonBackOut: profile.reason_back_out || "",
    recommend_hiring: profile.recommend_hiring || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.market) newErrors.market = "Market is required";
    if (!formData.compensationType)
      newErrors.compensationType = "Compensation Type is required";
    if (!formData.offeredSalary)
      newErrors.offeredSalary = "Offered Salary is required";
    if (!formData.acceptOffer)
      newErrors.acceptOffer = "Accept Offer selection is required";
    if (formData.acceptOffer === "No" && !formData.returnDate)
      newErrors.returnDate = "Return Date is required if offer not accepted";
    if (formData.backOut === "Yes" && !formData.reasonBackOut)
      newErrors.reasonBackOut = "Reason for backing out is required";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const response = await axios.put(
        `${apiurl}/hrevalution/${formData.applicantId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Form updated successfully!");
      }
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Failed to update the form.");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center">
      <Col md lg={7} className="m-4">
        <h2 className="m-2" style={{ color: "#E10174" }}>
          HR Interview Form Edit For {profile.applicant_id}
        </h2>
        <Form onSubmit={handleSubmit} className="p-4 rounded shadow">
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start text-capitalize">
              1. PLEASE ENTER THE MARKET WHERE THE APPLICANT IS GETTING HIRED
              FOR
            </Form.Label>
            <Col sm={6}>
              <Form.Select
                name="market"
                value={formData.market}
                onChange={handleChange}
                isInvalid={!!errors.market}
              >
                <option value="">Select Market</option>{" "}
                {markets.map((location) => (
                  <option key={location.id} value={location.location_name}>
                    {location.location_name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>

          {/* Market Training */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              2. WILL THE APPLICANT GO TO A DIFFERENT MARKET FOR TRAINING?
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

          {/* Training Location */}
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
                <option value="">Select Training Location</option>{" "}
                {/* Default empty option */}
                {markets.map((location) => (
                  <option key={location.id} value={location.location_name}>
                    {location.location_name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>

          {/* Compensation Type */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              4. COMPENSATION TYPE
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="compensationType"
                value={formData.compensationType}
                onChange={handleChange}
                isInvalid={!!errors.compensationType}
              />
              <Form.Control.Feedback type="invalid">
                {errors.compensationType}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Offered Salary */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              5. PLEASE ENTER THE OFFERED SALARY
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="number"
                name="offeredSalary"
                value={formData.offeredSalary}
                onChange={handleChange}
                isInvalid={!!errors.offeredSalary}
              />
              <Form.Control.Feedback type="invalid">
                {errors.offeredSalary}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Payroll */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              6. IS THE APPLICANT ON CURRENT OR BACK PAYROLL?
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="select"
                name="payroll"
                value={formData.payroll}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select...
                </option>
                {["Current Payroll", "Back Payroll"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          {/* Accept Offer */}
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
                checked={formData.acceptOffer === "Yes"}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="acceptOffer"
                value="No"
                checked={formData.acceptOffer === "No"}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Return Date */}
          {formData.acceptOffer === "No" && (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={6} className="text-start">
                8. IF THE APPLICANT HAS DECIDED TO THINK ABOUT IT, PLEASE SELECT
                WHEN WILL HE RETURN BACK TO YOU
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </Col>
            </Form.Group>
          )}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              8. IF THE APPLICANT HAS DECIDED TO THINK ABOUT IT PLEASE SELECT
              WHEN WILL HE RETURN BACK TO YOU
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="date"
                name="returnDate"
                value={formData.return_date}
                isInvalid={!!errors.returnDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} // Disable previous dates
              />
            </Col>
          </Form.Group>

          {/* Joining Date */}
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
                min={new Date().toISOString().split("T")[0]}
              />
            </Col>
          </Form.Group>

          {/* Work Hours/Days */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              10. PLEASE ENTER THE HOURS/DAYS THAT THE EMPLOYEE HAS PROMISED TO
              WORK
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                type="text"
                name="workHoursDays"
                value={formData.workHoursDays}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Back Out */}
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
                checked={formData.backOut === "Yes"}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="backOut"
                value="No"
                checked={formData.backOut === "No"}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Reason Back Out */}
          {formData.backOut === "Yes" && (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={6} className="text-start">
                12. IF SO, WHY DID HE BACK OUT?
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  name="reasonBackOut"
                  value={formData.reasonBackOut}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
          )}

          {/* Notes */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={6} className="text-start">
              14. OTHER NOTES/POINTERS
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          {/* Submit Button */}
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 6, offset: 6 }}>
              <Button type="submit">Update Details</Button>
            </Col>
          </Form.Group>
        </Form>
      </Col>
      <ToastContainer />
    </Container>
  );
};

export default Edit;

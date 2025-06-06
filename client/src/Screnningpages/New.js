import  { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Modal, Dropdown, Form, Container, Row, Col, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import ConfirmationModal from "../pages/Confirm";
import Loader from "../utils/Loader";
import { MyContext } from "../pages/MyContext";
import API_URL from "../Constants/ApiUrl";
import TableHead from "../utils/TableHead";

 const tableHeaders = [
  "SC.NO",
  "Name",
  "Phone",
  "Referred By",
  "Reference NTID",
  "Created At",
  "Action", 
];  

function New() {
  const [profiles, setProfiles] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [screens, setScreens] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState("");
  const [moveForwardMenu, setMoveForwardMenu] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [changeScreeningMenu, setChangeScreeningMenu] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAssigning, setConfirmAssigning] = useState(false);
  const [actionToPerform, setActionToPerform] = useState("");
  const { userData, isLoading: userDataLoading } = useContext(MyContext);

  const hasFetchedData = useRef(false);
  useEffect(() => {
    if (userDataLoading) {
      return;
    }

    if (!userData?.id) {
      setError("User data not available. Please log in.");
      return;
    }

    if (hasFetchedData.current) {
      console.log("Skipping fetch: Data already fetched.");
      return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const screensPromise = axios.get(`${API_URL}/screening`, { withCredentials: true, timeout: 5000 })
          .catch(err => {
            console.error("Error fetching /screening:", err);
            return { data: [] };
          });

        const hostsPromise = axios.get(`${API_URL}/interviewer`, { withCredentials: true, timeout: 5000 })
          .catch(err => {
            console.error("Error fetching /interviewer:", err);
            return { data: [] };
          });

        const hrsPromise = axios.get(`${API_URL}/hrs`, { withCredentials: true, timeout: 5000 })
          .catch(err => {
            console.error("Error fetching /hrs:", err);
            return { data: [] };
          });

        const profilesPromise = axios.get(`${API_URL}/users/${userData.id}/applicants`, { withCredentials: true, timeout: 5000 })
          .catch(err => {
            console.error("Error fetching /users/:id/applicants:", err);
            return { data: [] };
          });

        const [screensResponse, hostsResponse, hrsResponse, profilesResponse] = await Promise.all([
          screensPromise,
          hostsPromise,
          hrsPromise,
          profilesPromise,
        ]);

        if (screensResponse.data.length > 0) setScreens(screensResponse.data);
        if (hostsResponse.data.length > 0) setHosts(hostsResponse.data);
        if (hrsResponse.data.length > 0) setHrs(hrsResponse.data);
        if (profilesResponse.data.length > 0) setProfiles(profilesResponse.data);

        hasFetchedData.current = true;
      } catch (error) {
        console.error("Error in fetchInitialData:", error);
        setError(`Failed to load data: ${error.response?.status || "Unknown error"}. Please try again or contact support.`);
        toast.error(error.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [API_URL, userData?.id, userDataLoading]);

  useEffect(() => {
    localStorage.setItem("newcount", profiles.length);
  }, [profiles]);

  const formData = {
    applicant_uuid: selectedProfile?.applicant_uuid || null,
    interviewer_id: selectedHost?.id || null,
    time_of_interview: selectedDateTime ? selectedDateTime.toISOString() : null,
    comment,
  };

  const handleShowModal = (profile) => {
    setSelectedProfile(profile);
    if (!profile.applicant_email) {
      setShowEmailModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEmailModal(false);
    setShowCalendlyModal(false);
    setSelectedProfile(null);
    setSelectedHost(null);
    setSelectedScreen(null);
    setComment("");
    setEmail("");
    setCalendlyUrl("");
    setSelectedDateTime(null);
    setConfirmAssigning(false);
    setShowConfirm(false);
    setActionToPerform("");
  };

  const handleAction = (profile, action) => {
    console.log("handleAction called with:", { profile, action });
    setSelectedProfile(profile);
    setActionToPerform(action);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    console.log("handleConfirm called with:", { selectedProfile, actionToPerform, comment });
    if (!selectedProfile || !actionToPerform) {
      console.log("handleConfirm early return: missing selectedProfile or actionToPerform");
      return;
    }

    setShowConfirm(false);
    setActionLoading(true);

    const payload = {
      applicant_uuid: selectedProfile.applicant_uuid,
      action: actionToPerform,
      comments: comment || "No comment provided",
    };

    try {
      const response = await axios.post(`${API_URL}/updatestatus`, payload, {
        withCredentials: true,
        timeout: 5000,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setActionLoading(false);
      handleCloseModal();
    }
  };

  const handleMoveForwardMenuToggle = () => {
    setMoveForwardMenu(!moveForwardMenu);
  };

  const handleChangeScreeningToggle = () => {
    setChangeScreeningMenu(!changeScreeningMenu);
  };

  const handleSelect = async (eventKey) => {
    if (!selectedProfile) {
      toast.error("No profile selected.");
      return;
    }

    const selected = screens.find((screen) => screen.name === eventKey);
    setSelectedScreen(selected);

    if (selected) {
      setActionLoading(true);
      try {
        const response = await axios.post(`${API_URL}/assignapplicanttoUser`, {
          newUserId: selected.id,
          applicantId: selectedProfile.applicant_uuid,
          comment,
        }, { withCredentials: true, timeout: 5000 });

        if (response.status === 200) {
          toast.success(response.data.message);
          setTimeout(() => window.location.reload(), 1500);
        }
      } catch (error) {
        console.error("Error assigning user:", error);
        toast.error(error.response?.data?.message || "Error assigning user.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDateTimeSave = async () => {
    if (!selectedDateTime) {
      toast.error("Please select a date and time.");
      return;
    }

    const now = new Date();
    if (selectedDateTime <= now) {
      toast.error("Please select a date and time in the future.");
      return;
    }

    if (!selectedProfile || !selectedHost) {
      toast.error("Profile or host not selected.");
      return;
    }

    setActionLoading(true);
    try {
      const response = await axios.post(`${API_URL}/assign-interviewer`, formData, {
        withCredentials: true,
        timeout: 5000,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => window.location.reload(), 1800);
      }
    } catch (error) {
      console.error("Error assigning interviewer:", error);
      toast.error(error.response?.data?.message || "Error assigning interviewer.");
    } finally {
      setActionLoading(false);
      handleCloseModal();
    }
  };

  const handleSelectHost = (eventKey) => {
    const selected = hosts.find((host) => host.name === eventKey);
    if (!selected || !selected.email) {
      toast.error("Selected host does not have a valid email.");
      return;
    }

    const calendlyUsername = selected.email
      .trim()
      .split(/[@.]/)
      .join("-")
      .slice(0, -4);
    setSelectedHost(selected);
    const calendlyUrl = `https://calendly.com/${calendlyUsername}`;
    setCalendlyUrl(calendlyUrl);
    setShowCalendlyModal(true);
  };

  const handleSubmitEmail = async () => {
    if (!selectedProfile) {
      toast.error("No profile selected.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setActionLoading(true);
    const payload = {
      applicant_uuid: selectedProfile.applicant_uuid,
      email,
    };

    try {
      const response = await axios.post(`${API_URL}/updateemail`, payload, {
        withCredentials: true,
        timeout: 5000,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setShowEmailModal(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error(error.response?.data?.message || "Failed to update email.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return (
      profile.applicant_name?.toLowerCase().includes(lowercasedTerm) ||
      profile.applicant_email?.toLowerCase().includes(lowercasedTerm) ||
      profile.applicant_phone?.toString().includes(lowercasedTerm) ||
      profile.created_at?.toLowerCase().includes(lowercasedTerm)
    );
  });

  const sortedProfiles = [...filteredProfiles].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  if (loading || userDataLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form className="mb-4">
            <Form.Control
              className="m-auto border-black fw-bolder w-100 custom-placeholder"
              type="text"
              placeholder="Search by Name, Email, Phone, Market, or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="table-responsive">
            <Table striped bordered hover className="text-sm">
             <TableHead headData={tableHeaders} />
              <tbody>
                {sortedProfiles.length > 0 ? (
                  sortedProfiles.map((profile, index) => (
                    <tr key={profile.applicant_uuid || index}>
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{profile.applicant_name || "-"}</td>
                      <td className="p-2">{profile.applicant_phone || "-"}</td>
                      <td className="p-2">{profile.referred_by || "-"}</td>
                      <td className="p-2">{profile.reference_id || "-"}</td>
                      <td className="p-2">
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleString("en-US", {
                              hour12: true,
                            })
                          : "-"}
                      </td>
                      <td className="p-2">
                        <Button
                          variant="contained"
                          onClick={() => handleShowModal(profile)}
                          disabled={actionLoading}
                        >
                          Proceed
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No profiles available.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <Modal
        show={showEmailModal}
        onHide={handleCloseModal}
        size="md"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Action for {selectedProfile?.applicant_uuid || "Unknown"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="email" className="mx-5">
              <Form.Label className="fw-bolder">
                Email<sup className="fs-6 text-danger">*</sup>
              </Form.Label>
              <Form.Control
                className="border-dark mb-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button
                variant="contained"
                color="success"
                className="mt-2"
                onClick={handleSubmitEmail}
                disabled={actionLoading}
              >
                Update Email
              </Button>
            </div>
            <div className="d-flex justify-content-center m-2">
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleAction(selectedProfile, "no show at Screening")}
                disabled={actionLoading}
              >
                No Show
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Action for {selectedProfile?.applicant_name || "Unknown"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!showCalendlyModal ? (
            <Form>
              <Form.Group controlId="comment" className="mx-5">
                <Form.Label className="fw-bolder">
                  Comment<sup className="fs-6 text-danger">*</sup>
                </Form.Label>
                <Form.Control
                  className="border-dark"
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex mx-5 flex-column flex-md-row justify-content-around mt-3">
                <Container>
                  <Row className="gap-2">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleAction(selectedProfile, "rejected at Screening")}
                      disabled={actionLoading}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleAction(selectedProfile, "no show at Screening")}
                      disabled={actionLoading}
                    >
                      No Show
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAction(selectedProfile, "Not Interested at screening")}
                      disabled={actionLoading}
                    >
                      Not Interested
                    </Button>
                  </Row>
                </Container>
                <Container>
                  <Row className="gap-2">
                    <Dropdown
                      onSelect={handleSelectHost}
                      show={moveForwardMenu}
                      onToggle={handleMoveForwardMenuToggle}
                    >
                      <Dropdown.Toggle
                        className="w-100 bg-primary text-white border-secondary"
                        id="dropdown-basic"
                      >
                        Move Forward
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-auto">
                        {hosts
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((host, index) => (
                            <Dropdown.Item
                              key={host.id || index}
                              eventKey={host.name}
                              className="bg-light text-dark"
                            >
                              {host.name}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown
                      onSelect={handleSelect}
                      show={changeScreeningMenu}
                      onToggle={handleChangeScreeningToggle}
                    >
                      <Dropdown.Toggle
                        className="w-100 bg-primary text-white border-secondary"
                        id="dropdown-basic"
                      >
                        Change Assign To
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-auto">
                        {screens
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((screen, index) => (
                            <Dropdown.Item
                              key={screen.id || index}
                              eventKey={screen.name}
                              className="bg-light text-dark"
                            >
                              {screen.name}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Row>
                </Container>
              </div>
            </Form>
          ) : (
            <Form>
              <div className="text-center mt-5">
                <div className="mb-3">{selectedHost?.name || "Unknown Host"}</div>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1 me-3">
                    <iframe
                      src={calendlyUrl}
                      width="100%"
                      height="500"
                      frameBorder="0"
                      title="Calendly Scheduling"
                      style={{ maxWidth: "100%" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <Form.Group controlId="dateTime" className="my-3 w-100">
                      <p>Select Date & Time</p>
                      <DatePicker
                        selected={selectedDateTime}
                        onChange={(date) => setSelectedDateTime(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        className="form-control"
                      />
                    </Form.Group>
                    <Button
                      variant="contained"
                      color="success"
                      className="mt-3"
                      onClick={() => setConfirmAssigning(true)}
                      disabled={actionLoading}
                    >
                      Assign to Interviewer
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Moved Confirmation Modals to the root level */}
      <ConfirmationModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleConfirm}
        message={`Are you sure you want to mark this applicant as ${actionToPerform}?`}
      />
      <ConfirmationModal
        show={confirmAssigning}
        handleClose={() => setConfirmAssigning(false)}
        handleConfirm={handleDateTimeSave}
        message="Have you scheduled the interview in the calendar? Please confirm before submitting."
      />
      <ToastContainer />
    </Container>
  );
}

export default New;
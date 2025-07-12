import  { useEffect, useState, useContext } from "react";
import { Modal, Form, Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Accordion from "react-bootstrap/Accordion";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ConfirmationModal from "../pages/Confirm";
import TextField from "@mui/material/TextField";
import { MyContext } from "../pages/MyContext";
import Loader from "../utils/Loader";
import formatKey  from "../utils/formatKey"; // Assuming you have a utility function for formatting keys
import api from "../api/axios";
const deriveCategory = (status) => {
  if (!status) return "Unknown";
  const statusLower = status.toLowerCase();
  if (
    [
      "pending at screening",
      "no show at screening",
      "rejected at screening",
      "not interested at screening",
    ].includes(statusLower)
  )
    return "Screening";
  if (
    [
      "moved to interview",
      "no show at interview",
      "rejected at interview",
      "selected at interview",
      "need second opinion at interview",
      "put on hold at interview",
    ].includes(statusLower)
  )
    return "Interview";
  if (
    [
      "no show at hr",
      "moved to hr",
      "selected at hr",
      "rejected at hr",
      "sent for evaluation",
      "applicant will think about it",
    ].includes(statusLower)
  )
    return "HR";
  return "Unknown";
};

const getButtonStyle = (status) => ({
  backgroundColor:
    {
      "pending at Screening": "#FFA500",
      "no show at Screening": "#ff0000",
      "no show at Interview": "#ff0000",
      "no show at Hr": "#ff0000",
      "rejected at Screening": "red",
      "rejected at Interview": "red",
      "rejected at Hr": "red",
      "moved to Interview": "#32CD32",
      "selected at Interview": "#32CD32",
      "selected at Hr": "#32CD32",
      "Sent for Evaluation": "#4682B4",
      "need second opinion at Interview": "#FFD700",
      "put on hold at Interview": "#6A5ACD",
      "Applicant will think about It": "#DAA520",
      "Not Interested at screening": "#A9A9A9",
    }[status] || "#808080",
  color: ["need second opinion at Interview"].includes(status)
    ? "black"
    : "white",
  padding: "6px 12px",
  borderRadius: "4px",
});

const getStatusOptions = (category) => {
  const options =
    {
      Screening: [
        "pending at Screening",
        "no show at Screening",
        "rejected at Screening",
        "Not Interested at screening",
      ],
      Interview: [
        "moved to Interview",
        "no show at Interview",
        "rejected at Interview",
        "selected at Interview",
        "need second opinion at Interview",
        "put on hold at Interview",
      ],
      HR: [
        "no show at Hr",
        "Moved to HR",
        "selected at Hr",
        "rejected at Hr",
        "Sent for Evaluation",
        "Applicant will think about It",
      ],
    }[category] || [];
  return options;
};

const actionableStatuses = {
  hr: [
    "need second opinion at Interview",
    "selected at Interview",
    "no show at Hr",
    "put on hold at Interview",
  ],
  interviewer: ["no show at Screening", "no show at Interview"],
};



export default function InterviewedProfiles() {
  const apiurl = process.env.REACT_APP_API;
  const { userData } = useContext(MyContext);
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [hrs, setHrs] = useState([]);
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [selectedHost, setSelectedHost] = useState(null);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [interviewers, setInterviewers] = useState([]);
  const [firstRound, setFirstRound] = useState({});
  const [row, setRow] = useState(null);
  const [confirmAssigning, setConfirmAssigning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.id) {
      setError("User data not available. Please log in.");
      return;
    }
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [profilesResponse, hrsResponse, interviewersResponse] =
          await Promise.all([
            api.get(`/users/${userData.id}/applicantsatalllevel`),
            api.get("/hrs"),
            api.get("/interviewer"),
          ]);

        const profileData = profilesResponse.data || [];
        const enrichedProfiles = profileData.map((profile) => ({
          ...profile,
          category: deriveCategory(profile.status),
        }));
        setProfiles(enrichedProfiles);
        setFilteredProfiles(enrichedProfiles);
        setHrs(hrsResponse.data || []);
        setInterviewers(interviewersResponse.data || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load data. Please try again.");
        toast.error(error.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [apiurl, userData?.id]);
  

  const fetchResponse = async (applicantId) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/first_round_res/${applicantId}`);

      if (
        response.status === 200 &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setFirstRound(response.data[0]);
        setRow(response.data[0]);
        setShowMoreModal(true);
      } else {
        setFirstRound({ message: "No previous records found" });
        setRow(null);
        toast.info("No previous records found.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setFirstRound({ message: "No previous records found" });
      setRow(null);
      toast.error(
        error.response?.data?.message || "No previous records found."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (status) => {
    setSelectedStatus(status);
    let filtered = profiles;
    if (selectedCategory) {
      filtered = filtered.filter(
        (profile) =>
          profile.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (status) {
      filtered = filtered.filter(
        (profile) => profile.status?.toLowerCase() === status.toLowerCase()
      );
    }
    setFilteredProfiles(filtered);
  };

  const handleShowModal = (profile) => {
    setSelectedProfile(profile);
    setShowModal(true);
  };

  const columns = [
  { field: "applicant_name", headerName: "Name", width: 130 },
  { field: "applicant_phone", headerName: "Phone", width: 150 },
  { field: "created_at", headerName: "Created At", width: 200 },
  { field: "applicant_uuid", headerName: "UUID", width: 100 },
  { field: "applicant_email", headerName: "Email", width: 200 },
  {
    field: "status",
    headerName: "Action",
    width: 300,
    renderCell: (params) => (
      <Button
        style={getButtonStyle(params.value)}
        onClick={() => handleShowModal(params.row)}
        disabled={loading}
      >
        {params.value || "Unknown"}
      </Button>
    ),
  },
  {
    field: "button",
    headerName: "View",
    width: 150,
    renderCell: (params) => (
      <Button
        variant="contained"
        onClick={() => fetchResponse(params.row.applicant_uuid)}
        disabled={loading}
      >
        View
      </Button>
    ),
  },
];

  const handleCloseModal = () => {
    setSelectedProfile(null);
    setShowModal(false);
    setShowCalendlyModal(false);
    setShowMoreModal(false);
    setSelectedHost(null);
    setSelectedDateTime(null);
    setCalendlyUrl("");
    setConfirmAssigning(false);
  };

  const handleSelectHost = (eventKey) => {
    const selected =
      hrs.find((hr) => hr.name === eventKey) ||
      interviewers.find((interviewer) => interviewer.name === eventKey);
    if (!selected || !selected.email) {
      toast.error("Selected host does not have a valid email.");
      return;
    }

    let calendlyUsername = selected.email
      .trim()
      .split(/[@.]/)
      .join("-")
      .slice(0, -4);
    if (selected.email === "sultan@texasmobilepcs.com") {
      calendlyUsername = "sultan-sph2";
    }

    const calendlyUrl = `https://calendly.com/${calendlyUsername}`;
    setSelectedHost(selected);
    setCalendlyUrl(calendlyUrl);
    setShowCalendlyModal(true);
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

    setLoading(true);
    try {
      const isHr = hrs.some((hr) => hr.name === selectedHost.name);
      const url = isHr
        ? `${apiurl}/assigntohr`
        : `${apiurl}/assign-interviewer`;
      const payload = {
        applicant_uuid: selectedProfile.applicant_uuid,
        ...(isHr
          ? {
              hr_id: selectedHost.id,
              time_of_hrinterview: selectedDateTime.toISOString(),
            }
          : {
              interviewer_id: selectedHost.id,
              time_of_interview: selectedDateTime.toISOString(),
            }),
      };

      const response = await api.post(url, payload);
      if (response.status === 200) {
        toast.success(response.data.message || "Assignment successful.");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error(
        error.response?.data?.message || "Error scheduling interview."
      );
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const renderModalContent = () => {
    if (!selectedProfile) return <p>No profile selected.</p>;

    if (actionableStatuses.hr.includes(selectedProfile.status)) {
      return (
        <div>
          {showCalendlyModal ? (
            <div className="d-flex justify-content-between">
              <div className="flex-grow-1 me-2">
                <iframe
                  src={calendlyUrl}
                  width="100%"
                  height="500"
                  frameBorder="0"
                  title="Calendly Scheduling"
                />
              </div>
              <div className="flex-grow-1 ms-2 p-4">
                <h6 className="mb-2">Select Date & Time</h6>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    value={selectedDateTime}
                    onChange={setSelectedDateTime}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
                <Button
                  className="w-100 mt-2 bg-primary text-white"
                  onClick={() => setConfirmAssigning(true)}
                  disabled={loading}
                >
                  Assign to HR
                </Button>
                <ConfirmationModal
                  show={confirmAssigning}
                  handleClose={() => setConfirmAssigning(false)}
                  handleConfirm={handleDateTimeSave}
                  message="Have you scheduled the HR interview in the calendar? Please confirm before submitting."
                />
              </div>
            </div>
          ) : (
            <Form>
              <Form.Group controlId="formHRSelection" className="mb-3">
                <Form.Label>Select HR</Form.Label>
                <Dropdown onSelect={handleSelectHost}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {selectedHost ? selectedHost.name : "Select HR"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {hrs.map((hr) => (
                      <Dropdown.Item key={hr.id} eventKey={hr.name}>
                        {hr.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Form>
          )}
        </div>
      );
    }

    if (actionableStatuses.interviewer.includes(selectedProfile.status)) {
      return (
        <div>
          {showCalendlyModal ? (
            <div className="d-flex justify-content-between">
              <div className="flex-grow-1 me-2">
                <iframe
                  src={calendlyUrl}
                  width="100%"
                  height="500"
                  frameBorder="0"
                  title="Calendly Scheduling"
                />
              </div>
              <div className="flex-grow-1 ms-2 p-4">
                <h6 className="mb-2">Select Date & Time</h6>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    value={selectedDateTime}
                    onChange={setSelectedDateTime}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
                <Button
                  className="w-100 mt-2 bg-primary text-white"
                  onClick={() => setConfirmAssigning(true)}
                  disabled={loading}
                >
                  Assign to Interviewer
                </Button>
                <ConfirmationModal
                  show={confirmAssigning}
                  handleClose={() => setConfirmAssigning(false)}
                  handleConfirm={handleDateTimeSave}
                  message="Have you scheduled the interview in the calendar? Please confirm before submitting."
                />
              </div>
            </div>
          ) : (
            <Form>
              <Form.Group controlId="formInterviewerSelection" className="mb-3">
                <Form.Label>Select Interviewer</Form.Label>
                <Dropdown onSelect={handleSelectHost}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {selectedHost ? selectedHost.name : "Select Interviewer"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {interviewers.map((interviewer) => (
                      <Dropdown.Item
                        key={interviewer.id}
                        eventKey={interviewer.name}
                      >
                        {interviewer.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Form>
          )}
        </div>
      );
    }

    return <p>No actions available for this status.</p>;
  };

  const getRowId = (row) => row.applicant_id || row.applicant_uuid;
  
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedStatus(""); // Reset status when category changes
    handleFilterApply(""); // Apply filter with no status to show all profiles in the category
  };

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="container-fluid mt-4">
        {loading && <Loader />}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>Applicant Profiles</h5>
          <div className="d-flex align-items-center m-2">
            <div style={{ position: "relative", marginRight: "15px" }}>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{
                  width: "250px",
                  padding: "8px 12px",
                  border: "solid 1px #ced4da",
                  borderRadius: "4px",
                }}
              >
                <option value="">SELECT CATEGORIES</option>
                {["Screening", "Interview", "HR"].map((category) => (
                  <option key={category} value={category}>
                    {category.toLowerCase()}
                  </option>
                ))}
              </Form.Control>
              <ArrowDropDownIcon
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>

            <div style={{ position: "relative", marginRight: "15px" }}>
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={(e) => handleFilterApply(e.target.value)}
                style={{
                  width: "250px",
                  padding: "8px 12px",
                  border: "solid 1px #ced4da",
                  borderRadius: "4px",
                }}
              >
                <option value="">SELECT STATUS</option>
                {getStatusOptions(selectedCategory).map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </Form.Control>
              <ArrowDropDownIcon
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>

            <Tooltip title="Filter Profiles">
              <ArrowDropDownIcon />
            </Tooltip>
          </div>
        </div>

        <div style={{ height: 420, width: "100%" }}>
          <DataGrid
            rows={filteredProfiles.map((profile) => ({
              ...profile,
              button: "more",
            }))}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={getRowId}
            disableSelectionOnClick
            loading={loading}
          />
        </div>

        <Modal
          show={showModal && selectedProfile}
          onHide={handleCloseModal}
          size="lg"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Action for {selectedProfile?.status || "Unknown"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <div className="text-center">Scheduling...</div>
            ) : (
              renderModalContent()
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showMoreModal}
          onHide={handleCloseModal}
          size="xl"
          className="mt-2"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Interview Results for Applicant UUID:{" "}
              {row?.applicant_uuid || "Unknown"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {row ? (
              <div className="d-flex flex-wrap gap-3">
                {Object.entries(firstRound).map(([key, value], index) => (
                  <div key={key} style={{ flex: "1 1 300px" }}>
                    <Accordion>
                      <Accordion.Item eventKey={index.toString()}>
                        <Accordion.Header>{formatKey(key)}</Accordion.Header>
                        <Accordion.Body>
                          {value ? value.toString() : "No data available"}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <p>No data available.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer />
      </div>
    </LocalizationProvider>
  );
}

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import { Button, Dropdown ,Modal} from 'react-bootstrap'; // Using React Bootstrap for dropdown
import { Assignment } from '@mui/icons-material'; // Assignment icon
import { toast, ToastContainer } from 'react-toastify';

function HrNew() {
  const apiurl = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const userData = decodeToken();
  const [profiles, setProfiles] = useState([]);
  const [hrs, setHrs] = useState([]); // State to store HRs
  const { setapplicant_uuid } = useContext(MyContext);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedHRId, setSelectedHRId] = useState(null); // Store the selected HR ID for assignment
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Control confirmation modal visibility

  // Fetch the applicants assigned for HR interviews
  useEffect(() => {
    const fetchInterviewApplicants = async () => {
      try {
        const response = await axios.get(`${apiurl}/users/${userData.id}/hrinterviewapplicants`, {
          headers: getAuthHeaders()
        });
        if (response.status === 200) {
          setProfiles(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInterviewApplicants();
  }, [apiurl, userData]);

  // Fetch the list of HRs
  useEffect(() => {
    const fetchHRs = async () => {
      try {
        const response = await axios.get(`${apiurl}/hrs`, {
          headers: getAuthHeaders(),
        });
        setHrs(response.data); // Set the HRs data
      } catch (err) {
        console.error(err);
      }
    };

    fetchHRs();
  }, [apiurl]);

  // Show confirmation modal before assigning HR
  const handleSelect = (hrId, profile) => {
    setSelectedHRId(hrId); // Set selected HR ID
    setSelectedProfile(profile); // Set selected profile
    setShowConfirmModal(true);  // Show confirmation modal
  };

  // Confirm HR assignment
  const handleConfirmAssign = async () => {
    if (!selectedHRId || !selectedProfile) return; // Ensure valid HR and profile are selected

    try {
      await axios.post(
        `${apiurl}/newhr`, 
        { applicantId: selectedProfile.applicant_uuid, newUserId: selectedHRId }, // Payload format
        { headers: getAuthHeaders() }
      );
      toast.success('Assigned to New HR successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch (error) {
      console.error('Error assigning HR:', error);
      toast.error('Error assigning New HR');
    } finally {
      setShowConfirmModal(false); // Close modal after action
    }
  };

  const handleInterviewClick = (profile) => {
    setapplicant_uuid(profile.applicant_uuid);
    navigate("/hrinterview");
  };

  return (
    <div className="container">
      <div className="col-12 container w-80">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Applicant Name</th>
              <th>Applicant UUID</th>
              <th>Time Of Interview</th>
              <th>Action</th>
              <th>Assign New HR</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={profile.id}>
                <td>{index + 1}</td>
                <td>{profile.applicant_name}</td>
                <td>{profile.applicant_uuid}</td>
                <td>{new Date(profile.time_of_hrinterview).toLocaleString('en-US', { hour12: true })}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleInterviewClick(profile)}
                  >
                    Start Interview
                  </button>
                </td>
                <td>
                  <Dropdown
                    onSelect={(eventKey) => handleSelect(eventKey, profile)} // Pass HR ID and profile to handleSelect
                  >
                    <Dropdown.Toggle className="w-100 bg-primary text-white border-secondary" id="dropdown-basic">
                      <Assignment /> Change Assign To
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-auto">
                      {hrs
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((hr) => (
                          <Dropdown.Item key={hr.id} eventKey={hr.id} className="bg-light text-dark">
                            {hr.name}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to assign <strong>{selectedProfile?.applicant_name}</strong> to HR <strong>{hrs.find(hr => hr.id === selectedHRId)?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAssign}> {/* Call the confirmation handler */}
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default HrNew;

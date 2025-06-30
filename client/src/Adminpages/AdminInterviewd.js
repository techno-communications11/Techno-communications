import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, Table, Container } from 'react-bootstrap';
import { Assignment } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../utils/Loader';
import TableHead from '../utils/TableHead';
import API_URL from '../Constants/ApiUrl';
import ConfirmationModal from '../utils/ConfirmationModal'; // Corrected import
import useFetchHrs from '../Hooks/useFetchHrs';

const TableHeaders = [
  'S.No',
  'Applicant Name',
  'Applicant UUID',
  'Time Of Interview',
  'HR Name',
  'Assign New HR',
];

function AdminInterviewed() {
  const [profiles, setProfiles] = useState([]);
  const [activeDropdownRow, setActiveDropdownRow] = useState(null);
  const [selectedHRId, setSelectedHRId] = useState(null); // Track HR ID
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // Prevent multiple clicks
  const { hrs, loading: hrsLoading, error: hrsError } = useFetchHrs();

  useEffect(() => {
    const fetchInterviewApplicants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/users/getAllApplicationsForHR`, {
          withCredentials: true,
          timeout: 10000,
        });
        setProfiles(response.data || []);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        toast.error(err.response?.data?.message || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewApplicants();
  }, []);

  // Handle HR assignment after confirmation
  const handleConfirmAssign = async () => {
    console.log('handleConfirmAssign called:', { selectedHRId, selectedProfile }); // Debug log
    if (!selectedHRId || !selectedProfile?.applicant_uuid) {
      toast.error('Invalid HR or profile selected.');
      setShowConfirmModal(false);
      return;
    }

    setActionLoading(true);
    try {
      const payload = { applicantId: selectedProfile.applicant_uuid, newUserId: selectedHRId };
      console.log('Sending POST to backend:', { url: `${API_URL}/newhr`, payload }); // Debug API call
      const response = await axios.post(`${API_URL}/newhr`, payload, {
        withCredentials: true,
        timeout: 10000,
      });
      console.log('Backend response:', response.data); // Debug response
      toast.success('Assigned to new HR successfully!');
      // Refetch applicants
      const fetchResponse = await axios.get(`${API_URL}/users/getAllApplicationsForHR`, {
        withCredentials: true,
        timeout: 10000,
      });
      setProfiles(fetchResponse.data || []);
    } catch (error) {
      console.error('Error assigning HR:', error);
      toast.error(error.response?.data?.message || 'Error assigning new HR.');
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
      setSelectedHRId(null);
      setSelectedProfile(null);
    }
  };

  // Open confirmation modal with selected HR
  const handleHRSelect = (hr, profile) => {
    console.log('handleHRSelect called:', { hr, profile }); // Debug log
    setSelectedHRId(hr.id);
    setSelectedProfile(profile);
    setShowConfirmModal(true);
    console.log('Modal should show:', { hrId: hr.id, profile, showConfirmModal: true }); // Debug log
  };

  // Toggle dropdown only for the selected row
  const handleChangeScreeningToggle = (isOpen, index) => {
    console.log('Dropdown toggle:', { isOpen, index }); // Debug log
    if (isOpen) {
      setActiveDropdownRow(index);
    } else {
      setActiveDropdownRow(null);
    }
  };

  // Find HR name, with fallback
  const hrName = selectedHRId
    ? hrs.find((hr) => hr.id === selectedHRId)?.name || 'Unknown HR'
    : 'Unknown HR';

  // Debug modal state
  console.log('Modal state:', { showConfirmModal, hrName, selectedHRId, selectedProfile });

  // Render loading or error state
  if (loading || hrsLoading) {
    return <Loader />;
  }

  if (hrsError) {
    return (
      <Container fluid>
        <div className="alert alert-danger">Error: {hrsError}</div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    );
  }

  return (
    <Container fluid className="mt-1">
      <Table responsive striped bordered hover className="text-center">
        <TableHead headData={TableHeaders} />
        <tbody>
          {profiles.length === 0 ? (
            <tr>
              <td colSpan={TableHeaders.length} className="text-center">
                No profiles available.
              </td>
            </tr>
            ) : (
            profiles.map((profile, index) => (
              <tr key={profile.applicant_uuid || `fallback-${index}`}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2 text-capitalize">{profile.applicant_name || '-'}</td>
                <td className="p-2">{profile.applicant_uuid || '-'}</td>
                <td className="p-2">
                  {profile.time_of_hrinterview
                    ? new Date(profile.time_of_hrinterview).toLocaleString('en-US', {
                        hour12: true,
                      })
                    : '-'}
                </td>
                <td className="p-2">{profile.hr_name || '-'}</td>
                <td className="p-2">
                  <Dropdown
                    onSelect={(eventKey) => {
                      const selectedHR = hrs.find((hr) => hr.id === parseInt(eventKey));
                      handleHRSelect(selectedHR, profile);
                    }}
                    show={activeDropdownRow === index}
                    onToggle={(isOpen) => handleChangeScreeningToggle(isOpen, index)}
                  >
                    <Dropdown.Toggle
                      className="border-0 text-white"
                      style={{ backgroundColor: '#E10174' }}
                      id={`dropdown-${profile.applicant_uuid || index}`}
                      disabled={actionLoading}
                    >
                      <Assignment /> Change Assign To
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-auto">
                      {hrs
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((hr) => (
                          <Dropdown.Item
                            key={hr.id}
                            eventKey={hr.id.toString()}
                            className="bg-light text-dark"
                          >
                            {hr.name}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <ConfirmationModal
        show={showConfirmModal}
        handleClose={() => {
          setShowConfirmModal(false);
          setSelectedHRId(null);
          setSelectedProfile(null);
        }}
        handleConfirm={handleConfirmAssign}
        message={`Are you sure you want to assign this applicant to ${hrName}?`}
        confirmDisabled={actionLoading}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
}

export default AdminInterviewed;
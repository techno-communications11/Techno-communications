import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { Dropdown, Table } from 'react-bootstrap';
import { Assignment } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import TableHead from '../utils/TableHead';
import Loader from '../utils/Loader';
import useFetchHrs from '../Hooks/useFetchHrs';
import ConfirmationModal from '../utils/ConfirmationModal'; // Corrected import name
import { Button as MuiButton } from '@mui/material';
import API_URL from '../Constants/ApiUrl';

function HrNew() {
  const navigate = useNavigate();
  const { userData, setapplicant_uuid } = useContext(MyContext) || {};
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedHRId, setSelectedHRId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch HRs using custom hook
  const { hrs, loading: hrsLoading, error: hrsError } = useFetchHrs();

  // Fetch applicants assigned for HR interviews
  useEffect(() => {
    const fetchInterviewApplicants = async () => {
      if (!userData?.id) {
        toast.error('User ID not available. Please log in.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/users/${userData.id}/hrinterviewapplicants`,
          {
            withCredentials: true,
            timeout: 10000,
          }
        );
        setProfiles(response.data || []);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch applicants.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewApplicants();
  }, [userData?.id]);

  // Handle HR selection from dropdown
  const handleSelect = (eventKey, profile) => {
    console.log('Dropdown selected:', { eventKey, profile }); // Debug log
    const hrId = Number(eventKey);
    if (!hrId || !profile?.applicant_uuid) {
      toast.error('Invalid HR or profile selected.');
      return;
    }
    setSelectedHRId(hrId);
    setSelectedProfile(profile);
    setShowConfirmModal(true);
    console.log('Modal should show:', { hrId, profile, showConfirmModal: true }); // Debug log
  };

  // Confirm HR assignment
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
      const fetchResponse = await axios.get(
        `${API_URL}/users/${userData?.id}/hrinterviewapplicants`,
        { withCredentials: true, timeout: 10000 }
      );
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

  // Navigate to interview page
  const handleInterviewClick = (profile) => {
    if (profile?.applicant_uuid) {
      setapplicant_uuid?.(profile.applicant_uuid);
      navigate('/hrinterview');
    } else {
      toast.error('Invalid applicant UUID.');
    }
  };

  // Find HR name, with fallback
  const hrName = selectedHRId
    ? hrs.find((hr) => hr.id === selectedHRId)?.name || 'Unknown HR'
    : 'Unknown HR';

  // Debug modal state
  console.log('Modal state:', { showConfirmModal, hrName, selectedHRId, selectedProfile });

  // Render loading state
  if (loading || hrsLoading) {
    return <Loader />;
  }

  // Render error state
  if (hrsError) {
    return (
      <div className="container-fluid">
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
      </div>
    );
  }

  const tableHeaders = [
    'SI.No',
    'Applicant Name',
    'Applicant UUID',
    'Time of Interview',
    'Action',
    'Assign New HR',
  ];

  return (
    <div className="container-fluid">
      <div className="col-12 w-100">
        <Table striped bordered hover className="table-sm">
          <TableHead headData={tableHeaders} />
          <tbody>
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center">
                  No profiles available.
                </td>
              </tr>
            ) : (
              profiles.map((profile, index) => (
                <tr key={profile.applicant_uuid || `fallback-${index}`}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{profile.applicant_name || '-'}</td>
                  <td className="p-2">{profile.applicant_uuid || '-'}</td>
                  <td className="p-2">
                    {profile.time_of_hrinterview
                      ? new Date(profile.time_of_hrinterview).toLocaleString('en-US', {
                          hour12: true,
                        })
                      : '-'}
                  </td>
                  <td className="p-2">
                    <MuiButton
                      variant="contained"
                      color="primary"
                      onClick={() => handleInterviewClick(profile)}
                      disabled={actionLoading}
                    >
                      Start Interview
                    </MuiButton>
                  </td>
                  <td className="p-2">
                    <Dropdown
                      onSelect={(eventKey) => handleSelect(eventKey, profile)}
                    >
                      <Dropdown.Toggle
                        className="w-75 bg-primary text-white border-0"
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
      </div>

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
    </div>
  );
}

export default HrNew;
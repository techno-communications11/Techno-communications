import  { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { Dropdown, Table } from 'react-bootstrap';
import { Assignment } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import TableHead from '../utils/TableHead';
import Loader from '../utils/Loader';
import useFetchHrs from '../Hooks/useFetchHrs';
import ConfirmationModal from '../utils/ConformationModal';
import { Button as MuiButton } from '@mui/material';
import API_URL from '../Constants/ApiUrl';

function HrNew() {
  const navigate = useNavigate();
  const { userData, setapplicant_uuid } = useContext(MyContext);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedHRId, setSelectedHRId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // Added to prevent multiple clicks

  // Fetch HRs using custom hook
  const { hrs, loading: hrsLoading, error: hrsError } = useFetchHrs();

  // Fetch applicants assigned for HR interviews
  useEffect(() => {
    const fetchInterviewApplicants = async () => {
      if (!userData?.id) {
        console.error("User ID not available");
        toast.error("User ID not available. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fullUrl = `${API_URL}/users/${userData.id}/hrinterviewapplicants`;
        console.log("Fetching from URL:", fullUrl);
        const response = await axios.get(fullUrl, {
          withCredentials: true,
          timeout: 5000,
        });
        if (response.status === 200) {
          setProfiles(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching applicants:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch applicants.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewApplicants();
  }, [API_URL, userData?.id]);

  // Handle HR selection from dropdown
  const handleSelect = (hrId, profile) => {
    setSelectedHRId(Number(hrId));
    setSelectedProfile(profile);
    setShowConfirmModal(true);
  };

  // Confirm HR assignment
  const handleConfirmAssign = async () => {
    if (!selectedHRId || !selectedProfile) {
      toast.error('Invalid HR or profile selected.');
      setShowConfirmModal(false);
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        `${API_URL}/newhr`,
        { applicantId: selectedProfile.applicant_uuid, newUserId: selectedHRId },
        { withCredentials: true, timeout: 5000 }
      );
      toast.success('Assigned to new HR successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1800);
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
    console.log(profile, 'propopskc'); // Fixed typo: 'cons' → 'console'
    setapplicant_uuid(profile?.applicant_uuid);
    navigate('/hrinterview');
  };

  // Find HR name, with fallback
  const hrName = selectedHRId ? hrs.find((hr) => hr.id === selectedHRId)?.name || 'Unknown HR' : null;

  // Log for debugging
  console.log('hrs:', hrs, 'selectedHRId:', selectedHRId, 'hrName:', hrName);

  // Render loading state
  if (loading || hrsLoading) {
    return <Loader />;
  }

  // Render error state if HRs failed to load
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

  const tableHeaders = ['SI.No', 'Applicant Name', 'Applicant UUID', 'Time of Interview', 'Action', 'Assign New HR'];

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
                <tr key={profile.id || profile.applicant_uuid || index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{profile.applicant_name || "-"}</td>
                  <td className="p-2">{profile.applicant_uuid || "-"}</td>
                  <td className="p-2">
                    {profile.time_of_hrinterview
                      ? new Date(profile.time_of_hrinterview).toLocaleString('en-US', { hour12: true })
                      : "-"}
                  </td>
                  <td className="p-2">
                    <MuiButton
                      variant="contained"
                      sx={{
                        backgroundColor: '#E10174',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#c6005e',
                        },
                      }}
                      onClick={() => handleInterviewClick(profile)}
                    >
                      Start Interview
                    </MuiButton>
                  </td>
                  <td className="p-2">
                    <Dropdown onSelect={(eventKey) => handleSelect(eventKey, profile)}>
                      <Dropdown.Toggle
                        className="w-75 bg-primary text-white border-0"
                        id="dropdown-basic"
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
                              eventKey={hr.id}
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
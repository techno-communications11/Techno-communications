import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import { Button, Dropdown } from 'react-bootstrap'; // Using React Bootstrap for dropdown
import { IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'; // Material-UI icon
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
  const [ChangeScrenningMenu, setChangeScrenningMenu] = useState(false); // Show/Hide Dropdown

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

  // Handle assignment of an applicant to selected HR
  const handleSelect = async (selectedHRId, applicant_uuid) => {
    console.log(selectedHRId, applicant_uuid, ">>?<<")
    try {
      await axios.post(
        `${apiurl}/newhr`, // Assuming you have an endpoint for assigning HR
        { applicantId: applicant_uuid, newUserId: selectedHRId }, // Payload format
        { headers: getAuthHeaders() }
      );
      toast.success('Assigned to New HR successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1800);

    } catch (error) {
      console.error('Error assigning HR:', error);
      toast.error('Error assigning New HR:')
    }
  };

  const handleInterviewClick = (profile) => {
    setapplicant_uuid(profile.applicant_uuid);
    navigate("/hrinterview");
  };

  const handleChangeScrenningToggle = (isOpen) => {
    setChangeScrenningMenu(isOpen);
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
                    onSelect={(eventKey) => {
                      if (profile) {
                        handleSelect(eventKey, profile.applicant_uuid); // Assign HR
                      }
                    }}
                    show={ChangeScrenningMenu}
                    onToggle={handleChangeScrenningToggle}
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
      <ToastContainer />
    </div>
  );
}

export default HrNew;

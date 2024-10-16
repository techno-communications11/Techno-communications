import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { format } from 'date-fns';
import { Dropdown } from 'react-bootstrap'; // Using React Bootstrap for dropdown
import { Assignment } from '@mui/icons-material'; // Material-UI Assignment icon
import { toast, ToastContainer } from 'react-toastify';

function InterViewHome({ setApplicant_uuid, setApplicantEmail, setApplicantPhone }) {
  const apiurl = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const userData = decodeToken();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [filter, setFilter] = useState('');
  const [hrs, setHrs] = useState([]); // State to store HRs
  const [ChangeScrenningMenu, setChangeScrenningMenu] = useState(false); // Show/Hide Dropdown

  useEffect(() => {
    const assignedToInterviewer = async () => {
      try {
        const response = await axios.get(`${apiurl}/users/${userData.id}/interviewapplicants`, {
          headers: getAuthHeaders(),
        });

        if (response.status === 200) {
          const sortedProfiles = response.data.sort((a, b) =>
            new Date(b.time_of_interview) - new Date(a.time_of_interview)
          );
          setProfiles(sortedProfiles);
          setFilteredProfiles(sortedProfiles);
        }
      } catch (err) {
        console.log(err);
      }
    };
    assignedToInterviewer();
  }, [apiurl, userData.id]);

  // Fetch the list of HRs
  useEffect(() => {
    const fetchHRs = async () => {
      try {
        const response = await axios.get(`${apiurl}/interviewer`, {
          headers: getAuthHeaders(),
        });
        setHrs(response.data); // Set the HRs data
      } catch (err) {
        console.error(err);
      }
    };

    fetchHRs();
  }, [apiurl]);

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilter(value);
    const filtered = profiles.filter(profile =>
      profile.applicant_uuid.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProfiles(filtered);
  };

  const handleInterviewClick = (profile) => {
    setApplicant_uuid(profile.applicant_uuid);
    setApplicantEmail(profile.email);
    setApplicantPhone(profile.phone);
    navigate('/interview');
  };

  // Handle assignment of an applicant to selected HR
  const handleSelect = async (selectedHRId, applicant_uuid) => {
    try {
      await axios.post(
        `${apiurl}/newinterviewer`, // Assuming you have an endpoint for assigning HR
        { applicantId: applicant_uuid, newUserId: selectedHRId }, // Payload format
        { headers: getAuthHeaders() }
      );
      toast.success('Assigned to New Interviewer successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1800);      
    } catch (error) {
      console.error('Error assigning Interviewer:', error);
      toast.error('Error assigning Interviewer:');
    }
  };

  const handleChangeScrenningToggle = (isOpen) => {
    setChangeScrenningMenu(isOpen);
  };

  return (
    <div className="container my-5">
      <div className='d-flex mb-4'>
        <h2 className="text-start fw-bolder">{`Interviewer Dashboard`}</h2>
        <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
      </div>

      <div className="mb-5">
        <input
          type="text"
          className="form-control m-auto w-50 text-center"
          placeholder="Filter by applicant UUID"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>SI.No</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Applicant Name</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Applicant UUID</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Applicant Phone</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Applicant email</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Interview Time</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Action</th>
            <th style={{ backgroundColor: '#E10174', color: 'white' }}>Assign New Interviewer</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfiles.map((profile, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{profile.applicant_name}</td>
              <td>{profile.applicant_uuid}</td>
              <td>{profile.phone}</td>
              <td>{profile.email}</td>
              <td>
                {format(new Date(profile.time_of_interview), 'MM/dd/yyyy hh:mm a')}
              </td>
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
      <ToastContainer />
    </div>
  );
}

export default InterViewHome;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { format } from 'date-fns';

function InterViewHome({setApplicant_uuid}) {
  const apiurl = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const userData = decodeToken();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const assignedToInterviewer = async () => {
      try {
        const response = await axios.get(`${apiurl}/users/${userData.id}/interviewapplicants`, {
          headers: getAuthHeaders(),
        });
        
        if (response.status === 200) {
          // Sort profiles by interview time (descending order for most recent first)
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

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilter(value);

    // Log the input value and profiles
    console.log("Filter input:", value);
    console.log("Profiles:", profiles);

    // Filter profiles based on applicant_uuid
    const filtered = profiles.filter(profile =>
        profile.applicant_uuid.toLowerCase().includes(value.toLowerCase())
    );

    // Log the filtered profiles
    console.log("Filtered Profiles:", filtered);

    setFilteredProfiles(filtered);
};
const handleInterviewClick=(profile)=>{
  console.log(profile)
 setApplicant_uuid(profile.applicant_uuid);
 navigate('/interview')
}



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
            <th style={{backgroundColor:'#E10174', color:'white'}}>SI.No</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Applicant UUID</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Interview Time</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfiles.map((profile, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{profile.applicant_uuid}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default InterViewHome;

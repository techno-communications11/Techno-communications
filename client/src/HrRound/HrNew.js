import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';

function HrNew({setApplicant_uuid}) {
  const apiurl=process.env.REACT_APP_API;
  
  const navigate = useNavigate();
  const userData = decodeToken();
  const [profiles,setProfiles]=useState([]);

   useEffect(()=>{
    const assignedToInterviewer= async()=>{
      try {
        const response=await axios.get(`${apiurl}/users/${userData.id}/hrinterviewapplicants`,{
          headers:getAuthHeaders()
        })
        
        console.log(response.data)
        if(response.status===200){
          setProfiles(response.data);
        }
      }catch(err){
        console.log(err);
      }

    }
    assignedToInterviewer();

   },[])

  const handleInterviewClick = (profile) => {
    setApplicant_uuid(profile.applicant_uuid);
    
   
      navigate("/hrinterview")
    
  
  };

  return (
    <div>
      <div className="col-12 container w-80">
      <div className='d-flex my-4'>
          <h2 className="text-start fw-bolder">{`Interviewer Dashboard`}</h2>
          <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
        </div>
    

        <table className="table table-striped" >
          <thead>
            <tr>
              <th>SI.No</th>
              <th>applicant_uuid</th>
              <th>time_of_interview</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={profile.id}>
                <td>{index + 1}</td>
                <td>{profile.applicant_uuid}</td>
                <td>{profile.time_of_hrinterview}</td>
                
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
    </div>
  );
}

export default HrNew;

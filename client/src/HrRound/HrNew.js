import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { useContext } from 'react';

function HrNew() {
  const apiurl = process.env.REACT_APP_API;

  const navigate = useNavigate();
  const userData = decodeToken();
  const [profiles, setProfiles] = useState([]);
  const { setapplicant_uuid } = useContext(MyContext);

  useEffect(() => {
    const assignedToInterviewer = async () => {
      try {
        const response = await axios.get(`${apiurl}/users/${userData.id}/hrinterviewapplicants`, {
          headers: getAuthHeaders()
        })

        console.log(response.data)
        if (response.status === 200) {
          setProfiles(response.data);
        }
      } catch (err) {
        console.log(err);
      }

    }
    assignedToInterviewer();

  }, [])

  const handleInterviewClick = (profile) => {
    console.log(profile, "pp")
    setapplicant_uuid(profile.applicant_uuid);
    navigate("/hrinterview");
  };

  return (
    <div>
      <div className="col-12 container w-80">



        <table className="table table-striped" >
          <thead>
            <tr>
              <th>S.No</th>
              <th>  Applicant Name</th>
              <th>  Applicant uuid</th>
              <th>Time Of Interview</th>
              <th>Action </th>

            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={profile.id}>
                <td>{index + 1}</td>
                <td>{profile.applicant_name}</td>
                <td>{profile.applicant_uuid}</td>
                <td>{new Date(profile.time_of_hrinterview).toLocaleString('en-US', { hour12: true })}
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
    </div>
  );
}

export default HrNew;

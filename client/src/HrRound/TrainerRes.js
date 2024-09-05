import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { toast, ToastContainer } from 'react-toastify';

function TrainerRes() {
    const apiurl = process.env.REACT_APP_API;

    const navigate = useNavigate();
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const assignedToInterviewer = async () => {
            try {
                const response = await axios.get(`${apiurl}/users/${userData.id}/trainerfeedbackapplicants`, {
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

    const handleInterviewClick = async (profile) => {

        const payload = {
            applicant_uuid: profile.applicant_uuid,
            action: profile.applicant_status === "Recommended For Hiring" ? profile.applicant_status = "selected at Hr" :"rejected at Hr",
            // Include other data if needed, such as a comment

        };

        console.log("finalllllstatus....", payload);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/updatestatus`, payload);

            if (res.status === 200) {
                // Show success message
                toast.success(res.data.message);

                // Reload the page after a short delay
                setTimeout(() => {
                  window.location.reload();
                }, 1800);
            }
        } catch (error) {
            console.error("Error updating no-show to interview:", error);
            // Show error message
            toast.error("Failed to update no-show status.");
        }


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
                            <th>Trainer Feedback</th>
                            <th>Final Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((profile, index) => (
                            <tr key={profile.id}>
                                <td>{index + 1}</td>
                                <td>{profile.applicant_name}</td>
                                <td>{profile.applicant_uuid}</td>
                                <td>{profile.applicant_status}</td>
                                {/* <td>{profile.time_of_hrinterview}</td> */}

                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleInterviewClick(profile)}
                                    >
                                        Confirm
                                    </button>
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

export default TrainerRes;

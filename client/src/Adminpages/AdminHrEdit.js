import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import { Button } from 'react-bootstrap'; // Using React Bootstrap for dropdown
import { toast, ToastContainer } from 'react-toastify';

function AdminHrEdit() {
    const apiurl = process.env.REACT_APP_API; // Ensure REACT_APP_API is defined
    const navigate = useNavigate();
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]); // Ensure profiles is always an array
    const { setapplicant_uuid } = useContext(MyContext);

    // Fetch the applicants assigned for HR interviews
    useEffect(() => {
        const fetchInterviewApplicants = async () => {
            try {
                console.log("Fetching interview applicants...");

                // Fetching data from API
                const response = await axios.get(`${apiurl}/formDetailsForAllHRs`, {
                    headers: getAuthHeaders(),
                });

                // Logging the full response
                console.log("API response:", response);

                // Validate the response structure
                if (response.status === 200) {
                    if (Array.isArray(response.data.rows)) {
                        setProfiles(response.data.rows);
                        console.log("Profiles fetched:", response.data.rows);
                    } else {
                        console.error("Unexpected data format:", response.data);
                        toast.error("Unexpected data format from server.");
                    }
                } else {
                    console.error("API responded with status:", response.status);
                    toast.error("Failed to fetch profiles. Status: " + response.status);
                }
            } catch (err) {
                // Enhanced error logging
                if (axios.isAxiosError(err)) {
                    console.error("Axios error:", err.message);
                    if (err.response) {
                        console.error("Error response data:", err.response.data);
                        console.error("Error response status:", err.response.status);
                    }
                } else {
                    console.error("Unexpected error:", err);
                }
                toast.error('Failed to load profiles');
            }
        };

        fetchInterviewApplicants();
    }, []);

    const handleEdit = (profile) => {
        setapplicant_uuid(profile.applicant_uuid); // If this is required
        navigate("/edit", { state: { profile } }); // Pass the full profile object in state
    };

    return (
        <div className="container">
            <div className="col-12 container w-80">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Applicant UUID</th>
                            <th>Applicant Name</th>
                            <th>Phone</th>
                            <th>HR Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(profiles) && profiles.length > 0 ? (
                            profiles.map((profile, index) => (
                                <tr key={profile.id}>
                                    <td>{index + 1}</td>
                                    <td>{profile.applicant_id}</td>
                                    <td>{profile.applicant_name}</td>
                                    <td>{profile.applicant_phone}</td>
                                    <td>{profile.hr_name}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => handleEdit(profile)}>
                                            Edit Record
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No profiles found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AdminHrEdit;

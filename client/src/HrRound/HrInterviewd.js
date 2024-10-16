import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import { Button } from 'react-bootstrap'; // Using React Bootstrap for dropdown
import { toast, ToastContainer } from 'react-toastify';

function HrInterviewd() {
    const apiurl = process.env.REACT_APP_API;
    const navigate = useNavigate();
    const userData = decodeToken();
    const [profiles, setProfiles] = useState([]); // Ensure profiles is always an array
    const { setapplicant_uuid } = useContext(MyContext);

    // Fetch the applicants assigned for HR interviews
    useEffect(() => {
        const fetchInterviewApplicants = async () => {
            const id = 42; // Hardcoded for now, replace with actual logic if necessary
            try {
                const response = await axios.get(`${apiurl}/hrevalution/${userData.id}`, {
                    headers: getAuthHeaders(),
                });

                // Check if response.data is an object or an array
                if (response.status === 200 && Array.isArray(response.data.rows)) {
                    // Assuming your array is inside response.data.rows
                    setProfiles(response.data.rows);
                    console.log(response.data.rows)
                } else {
                    console.error("Unexpected response structure:", response.data);
                    toast.error("Unexpected data format from server.");
                }
            } catch (err) {
                console.error(err);
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(profiles) && profiles.length > 0 ? (
                            profiles.map((profile, index) => (
                                <tr key={profile.id} >
                                    <td>{index + 1}</td>
                                 
                                    <td>{profile.applicant_id}</td>
                                    <td>{profile.name}</td>
                                    <td>{profile.phone}</td>
                                  
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

export default HrInterviewd;

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
// import decodeToken from '../decodedDetails';
import { Button,Table } from 'react-bootstrap'; // Using React Bootstrap for dropdown
import { toast, ToastContainer } from 'react-toastify';

function AdminHrEdit() {
    const apiurl = process.env.REACT_APP_API; // Ensure REACT_APP_API is defined
    const navigate = useNavigate();
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
                // console.log("API response:", response);

                // Validate the response structure
                if (response.status === 200) {
                    if (Array.isArray(response.data.rows)) {
                        // Filter out duplicate applicant_uuid entries
                        const uniqueProfiles = response.data.rows.filter((profile, index, self) =>
                            index === self.findIndex((p) => p.applicant_id === profile.applicant_id)
                        );
                        setProfiles(uniqueProfiles);
                        // console.log("Unique profiles fetched:", uniqueProfiles);
                    } else {
                        // console.error("Unexpected data format:", response.data);
                        toast.error("Unexpected data format from server.");
                    }
                } else {
                    // console.error("API responded with status:", response.status);
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
        setapplicant_uuid(profile.applicant_id); // If this is required
        navigate("/edit", { state: { profile } }); // Pass the full profile object in state
    };

    return (
        <div className="container-fluid">
            <div className="col-12 container-fluid w-80">
                <Table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th style={{backgroundColor:"#E10174"}}>S.No</th>
                            <th style={{backgroundColor:"#E10174"}}>Applicant UUID</th>
                            <th style={{backgroundColor:"#E10174"}}>Applicant Name</th>
                            <th style={{backgroundColor:"#E10174"}}>Phone</th>
                            <th style={{backgroundColor:"#E10174"}}>HR Name</th>
                            <th style={{backgroundColor:"#E10174"}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(profiles) && profiles.length > 0 ? (
                            profiles.map((profile, index) => (
                                <tr className='p-2' key={profile.id}>
                                    <td className='p-2'>{index + 1}</td>
                                    <td className='p-2'>{profile.applicant_id}</td>
                                    <td className='p-2'>{profile.applicant_name}</td>
                                    <td className='p-2'>{profile.applicant_phone}</td>
                                    <td className='p-2'>{profile.hr_name}</td>
                                    <td className='p-2'>
                                        <Button style={{backgroundColor:"#E10174"}} className='border-0' onClick={() => handleEdit(profile)}>
                                            Edit Record
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No profiles found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AdminHrEdit;

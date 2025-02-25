import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import { Button,Table } from 'react-bootstrap'; // Using React Bootstrap for dropdown
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
            // const id = 42; // Hardcoded for now, replace with actual logic if necessary
            try {
                const response = await axios.get(`${apiurl}/hrevalution/${userData.id}`, {
                    headers: getAuthHeaders(),
                });

                // Check if response.data is an object or an array
                if (response.status === 200 && Array.isArray(response.data.rows)) {
                    // Assuming your array is inside response.data.rows
                    setProfiles(response.data.rows);
                    // console.log(response.data.rows)
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
        <div className="container-fluid">
            <div className="col-12 container-fluid w-80">
                <Table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th style={{backgroundColor:'#E10174'}}>S.No</th>
                            
                            <th style={{backgroundColor:'#E10174'}}>Applicant UUID</th>
                            <th style={{backgroundColor:'#E10174'}}>Applicant Name</th>
                            <th style={{backgroundColor:'#E10174'}}>Phone</th>
                            <th style={{backgroundColor:'#E10174'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(profiles) && profiles.length > 0 ? (
                            profiles.map((profile, index) => (
                                <tr key={profile.id} >
                                    <td className='p-2'>{index + 1}</td>
                                 
                                    <td className='p-2'>{profile.applicant_id}</td>
                                    <td className='p-2'>{profile.name}</td>
                                    <td className='p-2'>{profile.phone}</td>
                                  
                                    <td className='p-2'>
                                        <Button  style={{backgroundColor:'#E10174'}} className='text-white border-0' onClick={() => handleEdit(profile)}>
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
                </Table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default HrInterviewd;

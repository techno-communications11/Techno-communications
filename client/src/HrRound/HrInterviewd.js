import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../pages/MyContext';
import { Button,Table } from 'react-bootstrap'; // Using React Bootstrap for dropdown
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../utils/Loader';
import TableHead from '../utils/TableHead';

function HrInterviewd() {
    const apiurl = process.env.REACT_APP_API;
    const navigate = useNavigate();
    const {userData} = useContext(MyContext);
    const [profiles, setProfiles] = useState([]); // Ensure profiles is always an array
    const { setapplicant_uuid } = useContext(MyContext);
    const [loading,setLoading]=useState(false);

    // Fetch the applicants assigned for HR interviews
    useEffect(() => {
        const fetchInterviewApplicants = async () => {
            // const id = 42; // Hardcoded for now, replace with actual logic if necessary
            setLoading(true);
            try {
                const response = await axios.get(`${apiurl}/hrevalution/${userData.id}`, {
                    withCredentials:true
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
            }finally{
                setLoading(false)
            }
        };

        fetchInterviewApplicants();
    }, []);

    const handleEdit = (profile) => {
        setapplicant_uuid(profile.applicant_uuid); // If this is required
        navigate("/edit", { state: { profile } }); // Pass the full profile object in state
    };
     if(loading){
        return <Loader/>
     }
     const TableHeaders=["S.No", "Applicant UUID", "Applicant Name", "Phone", "Action"];

    return (
        <div className="container-fluid">
            <div className="col-12 container-fluid w-80">
                <Table className="table table-striped table-sm">
                    <TableHead headData={TableHeaders}/>
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

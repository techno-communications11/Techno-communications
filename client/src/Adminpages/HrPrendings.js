
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import decodeToken from '../decodedDetails';
import {  Dropdown } from 'react-bootstrap'; // Using React Bootstrap for dropdown
import { Assignment } from '@mui/icons-material'; // Assignment icon
import { toast, ToastContainer } from 'react-toastify';
import { TableCell, Box, Avatar, Typography } from '@mui/material';
 import useFetchHrs from '../Hooks/useFetchHrs';

function HrPrendings() {
  const apiurl = process.env.REACT_APP_API;
  const userData = decodeToken();
  const [profiles, setProfiles] = useState([]);
  const [ChangeScrenningMenu, setChangeScrenningMenu] = useState(false); // Show/Hide Dropdown
  const {hrs}=useFetchHrs();

  useEffect(() => {
    const fetchInterviewApplicants = async () => {
      try {
        const response = await axios.get(`${apiurl}/users/allhrinterviewapplicants`, {
          withCredentials:true
        });

        if (response.status === 200) {
          setProfiles(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInterviewApplicants();
  }, [apiurl, userData]);

  

  // Handle assignment of an applicant to selected HR
  const handleSelect = async (selectedHRId, applicant_uuid) => {
    try {
      await axios.post(
        `${apiurl}/newhr`, // Assuming you have an endpoint for assigning HR
        { applicantId: applicant_uuid, newUserId: selectedHRId }, // Payload format
        { withCredentials:true }
      );
      toast.success('Assigned to New HR successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1800);

    } catch (error) {
      console.error('Error assigning HR:', error);
      toast.error('Error assigning New HR:')
    }
  };


  const handleChangeScrenningToggle = (isOpen) => {
    setChangeScrenningMenu(isOpen);
  };

  return (
    <div className="container mt-4">
      <div className="col-12 container w-80">
        <table className="table table-striped">
          <thead>
            <tr>
              {["S.No", "Applicant Details", "Status", "HR", "Assign New HR"].map((header, index) => (
                <th key={index} className="text-center">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={profile.id}>
                <td>{index + 1}</td>
                <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar alt={profile.name} sx={{ backgroundColor: profile.avatarColor || '#3f51b5' }} />
                      <Box ml={2}>
                        
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>{profile.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
                        <Typography variant="body1" color="textSecondary">{profile.phone}</Typography>
                        <Typography variant="body2" color="textSecondary">{profile.applicant_uuid}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <td>{profile.status}</td>
                  <td>{profile.hr}</td>
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
                      <Assignment /> Change Assign To me
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
      </div>
      <ToastContainer />
    </div>
  );
}

export default HrPrendings;

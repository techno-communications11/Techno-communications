import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Dropdown,Table } from "react-bootstrap"; // Using React Bootstrap for dropdown
import { Assignment } from "@mui/icons-material"; // Material-UI Assignment icon
import { toast, ToastContainer } from "react-toastify";
import TableHead from "../utils/TableHead";
import Loader from "../utils/Loader";
import { useContext } from 'react';
import { MyContext } from '.././pages/MyContext';
import API_URL from "../Constants/ApiUrl";
import { Button } from "@mui/material";

const InterViewHome = ({
  setApplicant_uuid,
  setApplicantEmail,
  setApplicantPhone,
}) => {
 
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [filter, setFilter] = useState("");
  const [interviewer, setinterviewer] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); 
  const [loading, setLoading] = useState(false); // Loading state
  const { userData } = useContext(MyContext);

  useEffect(() => {
    const assignedToInterviewer = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${API_URL}/users/${userData.id}/interviewapplicants`,
          {
            withCredentials:true
          }
        );

        if (response.status === 200) {
          const sortedProfiles = response.data.sort(
            (a, b) =>
              new Date(b.time_of_interview) - new Date(a.time_of_interview)
          );
          setProfiles(sortedProfiles);
          setFilteredProfiles(sortedProfiles);
        }
      } catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false); // Stop loading
      }
    };
    assignedToInterviewer();
  }, [API_URL, userData.id]);

  useEffect(() => {
    const fetchinterviewer = async () => {
      try {
        const response = await axios.get(`${API_URL}/interviewer`, {
          withCredentials:true
        });
        setinterviewer(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchinterviewer();
  }, [API_URL]);

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilter(value);
    const filtered = profiles.filter((profile) =>
      profile.applicant_uuid.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProfiles(filtered);
  };

  const handleInterviewClick = (profile) => {
    setApplicant_uuid(profile.applicant_uuid);
    setApplicantEmail(profile.email);
    setApplicantPhone(profile.phone);
    navigate("/interview");
  };

  const handleSelect = async (selectedHRId, applicant_uuid) => {
    try {
      await axios.post(
        `${API_URL}/newinterviewer`,
        { applicantId: applicant_uuid, newUserId: selectedHRId },
        { withCredentials:true }
      );
      toast.success("Assigned to New Interviewer successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch (error) {
      console.error("Error assigning Interviewer:", error);
      toast.error("Error assigning Interviewer:");
    }
  };

  const toggleDropdown = (uuid) => {
    setOpenDropdown((prev) => (prev === uuid ? null : uuid)); // Toggle dropdown visibility
  };

   if(loading) {
    return (
      <Loader/>
    )
  }

   const TableHeader = ["SI.No", "Applicant Name", "Applicant UUID", "Applicant Phone", "Applicant email", "Interview Time", "Resume","Action","Assign New Interviewer"];

  return (
    <div className="container-fluid my-3">
      <div className="d-flex mb-3">
        <h4 className="text-start fw-bolder">{`Interviewer Dashboard`}</h4>
        <h4 className="ms-auto fw-bolder">{userData.name}</h4>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control m-auto w-50 text-center"
          placeholder="Filter by applicant UUID"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <Table className="table table-striped table-hover table-sm">
       <TableHead headData={TableHeader} />
        <tbody>
          {filteredProfiles.map((profile, index) => (
            <tr key={index}>
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{profile.applicant_name}</td>
              <td className="p-2">{profile.applicant_uuid}</td>
              <td className="p-2">{profile.phone}</td>
              <td className="p-2">{profile.email}</td>
              <td className="p-2">
                {format(
                  new Date(profile.time_of_interview),
                  "MM/dd/yyyy hh:mm a"
                )}
              </td>
               <td><Button variant="contained" color="success" onClick={() => navigate(`/resumeview?applicant_uuid=${profile.applicant_uuid}`)}>View resume</Button></td>

              <td className="p-2">
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "14px", whiteSpace: "nowrap" }}
                  onClick={() => handleInterviewClick(profile)}
                >
                  Start Interview
                </button>
              </td>
              <td className="p-2">
                <Dropdown
                  onSelect={(eventKey) =>
                    handleSelect(eventKey, profile.applicant_uuid)
                  }
                  show={openDropdown === profile.applicant_uuid}
                  onToggle={() => toggleDropdown(profile.applicant_uuid)}
                >
                  <Dropdown.Toggle
                    className="w-100 bg-primary text-white border-secondary"
                    id="dropdown-basic"
                  >
                    <Assignment /> Change Assign To
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-auto">
                    {interviewer
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((hr) => (
                        <Dropdown.Item
                          key={hr.id}
                          eventKey={hr.id}
                          className="bg-light text-dark"
                        >
                          {hr.name}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer />
    </div>
  );
};

export default InterViewHome;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import decodeToken from "../decodedDetails";
import axios from "axios";
import { getAuthHeaders } from "../Authrosization/getAuthHeaders";
import { format } from "date-fns";
import { Dropdown,Table } from "react-bootstrap"; // Using React Bootstrap for dropdown
import { Assignment } from "@mui/icons-material"; // Material-UI Assignment icon
import { toast, ToastContainer } from "react-toastify";

const InterViewHome = ({
  setApplicant_uuid,
  setApplicantEmail,
  setApplicantPhone,
}) => {
  const apiurl = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const userData = decodeToken();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [filter, setFilter] = useState("");
  const [hrs, setHrs] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // State to track open dropdown

  useEffect(() => {
    const assignedToInterviewer = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/users/${userData.id}/interviewapplicants`,
          {
            headers: getAuthHeaders(),
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
    };
    assignedToInterviewer();
  }, [apiurl, userData.id]);

  useEffect(() => {
    const fetchHRs = async () => {
      try {
        const response = await axios.get(`${apiurl}/interviewer`, {
          headers: getAuthHeaders(),
        });
        setHrs(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHRs();
  }, [apiurl]);

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
        `${apiurl}/newinterviewer`,
        { applicantId: applicant_uuid, newUserId: selectedHRId },
        { headers: getAuthHeaders() }
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
        <thead className="table-dark">
          <tr>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              SI.No
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Applicant Name
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Applicant UUID
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Applicant Phone
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Applicant email
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Interview Time
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Action
            </th>
            <th style={{ backgroundColor: "#E10174", color: "white" }}>
              Assign New Interviewer
            </th>
          </tr>
        </thead>
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
                    {hrs
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

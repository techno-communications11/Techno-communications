import  { useEffect, useState } from "react";
import axios from "axios";
import {  Dropdown, Table, Container } from "react-bootstrap"; // Using React Bootstrap for modal, dropdown, table, and container
import { Assignment } from "@mui/icons-material"; // Assignment icon
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import Loader from "../utils/Loader";
import TableHead from "../utils/TableHead";
import API_URL from "../Constants/ApiUrl";
import ConfirmationModal from "../utils/ConformationModal";
import useFetchHrs from '../Hooks/useFetchHrs'
const TableHeaders = [
  "S.No",
  "Applicant Name",
  "Applicant UUID",
  "Time Of Interview",
  "HR Name",
  "Assign New HR",
];

function AdminInterviewd() {
  const [profiles, setProfiles] = useState([]);
  const [activeDropdownRow, setActiveDropdownRow] = useState(null); // Track active dropdown row
  const [selectedHR, setSelectedHR] = useState(null); // Track selected HR
  const [selectedProfile, setSelectedProfile] = useState(null); // Track selected profile
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Control confirmation modal visibility
  const [loading, setLoading] = useState(false); // Loading state
  const {hrs}=useFetchHrs();

  useEffect(() => {
    const fetchInterviewApplicants = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await axios.get(
          `${API_URL}/users/getAllApplicationsForHR`,
          {
            withCredentials:true
          }
        );

        if (response.status === 200) {
          setProfiles(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profiles");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchInterviewApplicants();
  }, []);

 

  // Handle assignment of an applicant to selected HR after confirmation
  const handleSelect = async () => {
    try {
      await axios.post(
        `${API_URL}/newhr`, // Assuming you have an endpoint for assigning HR
        {
          applicantId: selectedProfile.applicant_uuid,
          newUserId: selectedHR.id,
        }, // Payload format
        { withCredentials:true }
      );
      toast.success("Assigned to New HR successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch (error) {
      console.error("Error assigning HR:", error);
      toast.error("Error assigning New HR:");
    } finally {
      setShowConfirmModal(false); // Close modal after action
    }
  };

  // Open confirmation modal with selected HR
  const handleHRSelect = (hr, profile) => {
    setSelectedHR(hr.name); // Set selected HR
    setSelectedProfile(profile); // Set selected profile
    setShowConfirmModal(true); // Open confirmation modal
  };

  // Toggle dropdown only for the selected row
  const handleChangeScrenningToggle = (isOpen, index) => {
    if (isOpen) {
      setActiveDropdownRow(index); // Open dropdown for the current row
    } else {
      setActiveDropdownRow(null); // Close all dropdowns
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid className="mt-1">
      <Table responsive striped bordered hover className="text-center ">
        <TableHead headData={TableHeaders} />
        <tbody>
          {profiles.map((profile, index) => (
            <tr key={profile.id}>
              <td className="p-2">{index + 1}</td>
              <td className="p-2 text-capitalize">{profile.applicant_name}</td>
              <td className="p-2">{profile.applicant_uuid}</td>
              <td className="p-2">
                {new Date(profile.time_of_hrinterview).toLocaleString("en-US", {
                  hour12: true,
                })}
              </td>
              <td className="p-2">{profile.hr_name}</td>
              <td className="p-2">
                <Dropdown
                  onSelect={(eventKey) => {
                    const selectedHR = hrs.find(
                      (hr) => hr.id === parseInt(eventKey)
                    );
                    handleHRSelect(selectedHR, profile); // Open confirmation modal
                  }}
                  show={activeDropdownRow === index} // Show dropdown only for the active row
                  onToggle={(isOpen) =>
                    handleChangeScrenningToggle(isOpen, index)
                  } // Track the row's dropdown toggle state
                >
                  <Dropdown.Toggle
                    className=" border-0 text-white"
                    style={{ backgroundColor: "#E10174" }}
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

      <ConfirmationModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        handleSelect={handleSelect}
        selectedProfile={selectedProfile}
        selectedHR={selectedHR}
      />

      <ToastContainer />
    </Container>
  );
}

export default AdminInterviewd;

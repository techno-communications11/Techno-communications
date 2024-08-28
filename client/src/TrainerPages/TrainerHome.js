import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, InputGroup, FormControl } from 'react-bootstrap';
import decodeToken from '../decodedDetails';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { toast, ToastContainer } from 'react-toastify';
import '../pages/loader.css'

function TrainerHome() {
  const apiurl = process.env.REACT_APP_API;
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  let userData = decodeToken();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${apiurl}/users/${1}/applicants`, {
          headers: getAuthHeaders(),
        });
        const sortedProfiles = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setProfiles(sortedProfiles);
      } catch (error) {
        setError('Error fetching profiles.');
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [apiurl]);

  const handleOpenModal = (profile) => {
    setSelectedProfile(profile);
    setComment(profile.comments || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitComment = async () => {
    setShowModal(false)
    toast.success(" Comment Added Successfully!")
    // try {
    //   await axios.put(`${apiurl}/auth/updatecomment/${selectedProfile.id}`, {
    //     comments: comment,
    //   });
    //   setShowModal(false);
    //   setProfiles((prevProfiles) =>
    //     prevProfiles.map((profile) =>
    //       profile.id === selectedProfile.id ? { ...profile, comments: comment } : profile
    //     )
    //   );
    // } catch (error) {
    //   setError('Error submitting comment.');
    //   console.error('Error submitting comment:', error);
    // }
  };

  // Filter profiles based on the search query
  const filteredProfiles = profiles.filter((profile) =>
    profile.applicant_id.toString().includes(searchQuery) ||
    profile.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.applicant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.referred_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.reference_id.toString().includes(searchQuery) ||
    profile.applicant_phone.includes(searchQuery)
  );

  return (
    <div className="container mt-5">
      <div className="d-flex my-4">
        <h2 className="text-start fw-bolder">Trainer Dashboard</h2>
        <h2 className="ms-auto fw-bolder">{userData.name}</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <InputGroup className=" m-auto border-black fw-bolder w-50 my-5">
        <FormControl
          placeholder="filter Profiles..."
          className='text-center'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <div className="loader m-auto">

        </div>
      ) : (
        <Table striped hover responsive>
          <thead style={{ backgroundColor: "#E10174" }}>
            <tr>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>ID</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Name</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Email</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Phone</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Referred By</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Referred ID</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Evolution stats</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Evolution Ends</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Evolution Days</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((profile, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{profile.applicant_name || ""}</td>
                <td>{profile.applicant_email}</td>
                <td>{profile.applicant_phone}</td>
                <td>{profile.referred_by}</td>
                <td>{profile.reference_id}</td>
                <td>09/22/2024</td>
                <td>09/25/2024</td>
                <td>3</td>
                <td>
                  <Button variant="primary" onClick={() => handleOpenModal(profile)}>
                    Add Comment
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment on {selectedProfile?.applicant_name || ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formComment">
              <Form.Label>Comment <sup className="text-danger">*</sup></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitComment}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default TrainerHome;
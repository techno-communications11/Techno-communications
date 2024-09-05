import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, InputGroup, FormControl, Col } from 'react-bootstrap';
import decodeToken from '../decodedDetails';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { toast, ToastContainer } from 'react-toastify';
import '../pages/loader.css';

function TrainerHome() {
  const apiurl = process.env.REACT_APP_API;
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState('');
  const [recommendHiring, setRecommendHiring] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const userData = decodeToken();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${apiurl}/users/${userData.id}/trainerapplicants`, {
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
  }, [apiurl, userData.id]);

  const handleOpenModal = (profile) => {
    setSelectedProfile(profile);
    setComment(profile.comments || '');
    setRecommendHiring('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitComment = async (applicant_uuid) => {
    if (!comment || !recommendHiring) {
      toast.error('Comment and recommendation status are required.');
      return;
    }

    const payload = {
      applicant_uuid,
      action: recommendHiring,
      comment,
    };

    try {
      const res = await axios.post(`${apiurl}/updatestatus`, payload, {
        headers: getAuthHeaders(),
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Failed to submit comment.');
      }
    } catch (error) {
      setError('Error submitting comment.');
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex my-4">
        <h2 className="text-start fw-bolder">Trainer Dashboard</h2>
        <h2 className="ms-auto fw-bolder">{userData.name}</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <InputGroup className="m-auto border-black fw-bolder w-50 my-5">
        <FormControl
          placeholder="Filter Profiles..."
          className="text-center"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <div className="loader m-auto"></div>
      ) : (
        <Table striped hover responsive>
          <thead style={{ backgroundColor: "#E10174" }}>
            <tr>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>S.NO</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Name</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Applicant UUID</th>
              <th style={{ backgroundColor: "#E10174", color: "white" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.filter(profile =>
              profile.applicant_name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((profile, index) => (
              <tr key={profile.applicant_uuid}>
                <td>{index + 1}</td>
                <td>{profile.applicant_name || ""}</td>
                <td>{profile.applicant_uuid}</td>
                <td>
                  <Button variant="primary" onClick={() => handleOpenModal(profile)}>
                    Enter Feedback
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
            <Col sm={6} className="text-start">
              <Form.Check
                type="radio"
                label="Recommended For Hiring"
                name="recommend_hiring"
                value="Recommended For Hiring"
                checked={recommendHiring === 'Recommended For Hiring'}
                onChange={(e) => setRecommendHiring(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Not Recommended For Hiring"
                name="recommend_hiring"
                value="Not Recommended For Hiring"
                checked={recommendHiring === 'Not Recommended For Hiring'}
                onChange={(e) => setRecommendHiring(e.target.value)}
              />
            </Col>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmitComment(selectedProfile?.applicant_uuid)}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default TrainerHome;

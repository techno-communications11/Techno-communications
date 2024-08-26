import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import decodeToken from '../decodedDetails';

function TrainerHome() {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState('');


  let userData = decodeToken();

 
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/getpublicprofile', {
          withCredentials: true,
        });
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const handleOpenModal = (profile) => {
    setSelectedProfile(profile);
    setComment(profile.comments || ''); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitComment = async () => {
    try {
      await axios.put(`http://localhost:3001/api/auth/updatecomment/${selectedProfile.id}`, {
        comments: comment,
      });
      setShowModal(false);
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === selectedProfile.id ? { ...profile, comments: comment } : profile
        )
      );
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  return (
    <div className="container mt-5">
      <div className='d-flex my-4'>
      <h2 className=" text-start fw-bolder" >{`Screening Dahshboard`}</h2>
      <h2 className='ms-auto fw-bolder'>{userData.name}</h2>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Refer By</th>
            <th>Market</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td>{profile.id}</td>
              <td>{profile.name}</td>
              <td>{profile.email}</td>
              <td>{profile.phone}</td>
              <td>{profile.referBy}</td>
              <td>{profile.market}</td>
              <td>
                <Button variant="primary" onClick={() => handleOpenModal(profile)}>
                  Add Comment
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formComment">
              <Form.Label>Comment</Form.Label>
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
            Submit Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TrainerHome;

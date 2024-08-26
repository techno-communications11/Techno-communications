import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import './loader.css'


function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/profile`, {
          headers: getAuthHeaders(), 
        });
        setUserData("tharun");
      
        
      } catch (error) {
        setError('Failed to fetch profile data. Please try again later.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <Container style={{ minHeight: '80vh' }} className="d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col md={6} className="mx-auto  p-4 rounded-5" >
          
          {userData ? (
            
            <div className="p-4 rounded bg-white shadow-lg">
              <h2 className="text-center mb-4 font fw-bolder">Profile</h2>
              <p><strong>ID:</strong> {userData.id}</p>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Market:</strong> {userData.market}</p>
              <p><strong>Calendly Username:</strong> {userData.calendlyUsername}</p>
            </div>
          ) : (
            <div class="loader m-auto"></div> 
          )}
        </Col>
      </Row>

     
    </Container>
  );
}

export default Profile;

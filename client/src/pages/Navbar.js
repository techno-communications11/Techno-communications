import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import axios from 'axios';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import { jwtDecode } from 'jwt-decode';

function AppNavbar() {
  const navigate = useNavigate(); 
  const [error, setError] = useState('');
  const [counts, setCounts] = useState({});
  const token = localStorage.getItem('token');
  let role = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.role;
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
      setError('Logout failed. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // const response = await axios.get('http://localhost:3001/api/auth/newCounts', {
        //   headers: getAuthHeaders(),
        // });
        setCounts("5");
      } catch (error) {
        setError('Failed to fetch counts. Please try again later.');
      }
    };

    fetchCounts(); 
  }, []); 

  return (
    <Navbar expand="lg" className='shadow-sm'>
      <Container fluid>
        <Navbar.Brand className='fw-bolder'>
          <img src="/logo.png" alt="Logo" width="30" height="30" className="d-inline-block align-top" />
          {' '}TECHNO COMMUNICATION LLC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="ms-auto">
            {role === 'screening_manager' && (
              <Nav.Link as={Link} to="/screening" className='fw-bolder text-primary'>
                List Profile
              </Nav.Link>
            )}
            {/* {role === 'Screening Manager' && (
              <Nav.Link as={Link} to="/shedular" className='fw-bolder text-primary'>
                Shedular
              </Nav.Link>
            )} */}
            {role === 'admin' && (
              <Nav.Link as={Link} to="/register" className='fw-bolder text-primary'>
                Register
              </Nav.Link>
            )}
            {role === 'interviewer' && (
              <Nav.Link as={Link} to="/interview" className='fw-bolder text-primary'>
                interview form
              </Nav.Link>
            )}
            {role === 'hr' && (
              <Nav.Link as={Link} to="/hrnew" className='fw-bolder text-primary'>
                HR Interview candidtaes
              </Nav.Link>
            )}


            
            {role === 'screening_manager' && (
              <Nav.Link
                as={Link}
                to="/home"
                className='fw-bolder'
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  background: 'linear-gradient(90deg, rgba(63,94,251,1) 0%, rgba(180,27,148,1) 81%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold',
                }}
              >
                New 
                {counts.totalProfiles > 0 && (
                  <sup className='text-white bg-danger px-1 rounded-circle' style={{ fontSize: '10px' }}>
                    {counts.totalProfiles}
                  </sup>
                )}
              </Nav.Link>)
}
            <Nav.Link as={Link} to="/profile">
              <FaUser className='me-4' />
            </Nav.Link>
            <Button variant="danger"  onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

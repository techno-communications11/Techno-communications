import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';

function AppNavbar() {
  const navigate = useNavigate(); 
  const [error, setError] = useState('');
  const [counts, setCounts] = useState({});
  const token = localStorage.getItem('token');
  let role = '';
  let name = '';

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.role || '';
      name = decodedToken.name || '';
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
        // Uncomment and configure the URL based on your API
        // const response = await axios.get('http://localhost:3001/api/auth/newCounts', {
        //   headers: getAuthHeaders(),
        // });
        // Simulate counts for example
        setCounts({ totalProfiles: 5 });
      } catch (error) {
        setError('Failed to fetch counts. Please try again later.');
      }
    };

    fetchCounts(); 
  }, []); 

  function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1]?.[0] || ''}`,
    };
  }

  return (
    <Navbar expand="lg" className='shadow-sm'>
      <Container fluid>
        <Navbar.Brand className='fw-bolder'>
          <img src="/logo.png" alt="Logo" width="24" height="24" className="d-inline-block align-top" />
          {' '}TECHNO COMMUNICATION LLC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="ms-auto d-flex align-items-center">
            <div className='d-flex gap-3 align-items-center'>
              {role === 'screening_manager' && (
                <Nav.Link as={Link} to="/screening" className='fw-bolder'>
                  List Profile
                </Nav.Link>
              )}
              {role === 'admin' && (
                <Nav.Link as={Link} to="/register" className='fw-bolder'>
                  Register
                </Nav.Link>
              )}
              <Nav.Link
                as={Link}
                to={
                  role === "interviewer" ? "/InterviewerDashboard" :
                  role === "screening_manager" ? "/home" :
                  role === "admin" ? "/adminhome" :
                  role === "trainer" ? "/trainerhome" :
                  role === "hr" ? "/hrhome" : "/"
                }
                className='fw-bolder text-dark'
              >
                Dashboard
              </Nav.Link>
              {role === 'interviewer' && (
                <Nav.Link as={Link} to="/interviewhome" className='fw-bolder'>
                  New
                </Nav.Link>
              )}
              {role === 'hr' && (
                <Nav.Link as={Link} to="/hrnew" className='fw-bolder'
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
                </Nav.Link>
              )}
              {role === 'screening_manager' && (
                <Nav.Link
                  as={Link}
                  to="/tabs"
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
                </Nav.Link>
              )}
              <Nav.Link className='d-flex align-items-center'>
  <Avatar 
    sx={{ bgcolor: deepPurple[600], width: 10, height: 10 }} 
    {...stringAvatar(name)} 
  />
  <div className='ms-2 fw-bolder'>
    <span className='d-block text-start' style={{ fontSize: '0.9rem' }}>{name}</span>
    <span className='d-block text-start' style={{ fontSize: '0.9rem' }}>{role.split('_').join(' ')}</span>
  </div>
</Nav.Link>

              <Button variant="danger" onClick={handleLogout} size="md" className='ms-2'>
                Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
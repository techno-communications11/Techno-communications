import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings'; // Import the Settings icon

function AppNavbar() {
  const apiurl = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const [counts, setCounts] = useState(0);
  const token = localStorage.getItem('token');
  let role = '';
  let name = '';
  let id = '';

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.role || '';
      name = decodedToken.name || '';
      id = decodedToken.id || '';
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
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        let endpoint = '';

        if (role === 'interviewer') {
          endpoint = `/users/${id}/interviewapplicants`;
        } else if (role === 'hr') {
          endpoint = `/users/${id}/hrinterviewapplicants`;
        } else if (role === 'screening_manager') {
          endpoint = `/users/${id}/applicants`;
        }

        if (endpoint) {
          const response = await axios.get(`${apiurl}${endpoint}`);
          if (response.status === 200) {
            setCounts(response.data.length);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCounts();
  }, [role, id, apiurl]);

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
                <Nav.Link as={Link} to="/screening" className='fw-bolder nav-link-custom'>
                  List Profile
                </Nav.Link>
              )}
              {role === 'admin' && (
                <Nav.Link as={Link} to="/register" className='fw-bolder nav-link-custom'>
                  Register
                </Nav.Link>
              )}
              {role !== "trainer" && role !== 'market_manager' &&
                <Nav.Link
                  as={Link}
                  to={
                    role === "interviewer" ? "/InterviewerDashboard" :
                      role === "screening_manager" ? "screeinghome" :
                        role === "admin" ? "/adminhome" :
                          role === "hr" ? "/hrhome" : role !== "market_manager" ? "" : '/'
                  }
                  className='fw-bolder nav-link-custom'
                >
                  Dashboard
                </Nav.Link>
              }

              {(role !== 'admin' && role !== 'trainer' && role !== 'market_manager') && (
                <Nav.Link
                  as={Link}
                  to={role === "interviewer" ? "/interviewhome" : role === "hr" ? "/hrtabs" : role === "screening_manager" ? "/tabs" : ''}
                  className='fw-bolder nav-link-custom'
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
                  {counts > 0 && (
                    <Badge badgeContent={counts} className='mb-4 ms-2' color="error">
                    </Badge>
                  )}
                </Nav.Link>
              )}

              <Nav.Link>
                <IconButton
                  color="primary"
                  onClick={() => navigate('/updatepassword')} // Navigate to UpdatePassword component
                >
                  <SettingsIcon />
                </IconButton>
              </Nav.Link>

              <Nav.Link className='d-flex align-items-center'>
                <Avatar
                  sx={{ bgcolor: deepPurple[600], width: 30, height: 30 }}
                  {...stringAvatar(name)}
                />
                <div className='ms-2 fw-bolder'>
                  <span className='d-block text-start' style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{name}</span>
                  <span className='d-block text-start' style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{role.split('_').join(' ')}</span>
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

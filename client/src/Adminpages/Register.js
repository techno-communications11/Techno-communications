import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeForm, setActiveForm] = useState('register'); // 'register' or 'market'
  const [markets, setMarkets] = useState([]);
  const [roles, setRoles] = useState(['Admin', 'Screening Manager', 'Interviewer', 'HR', 'Trainer']);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [calendlyUsername, setCalendlyUsername] = useState('');
  
  const emailRef = useRef();
  const passwordRef = useRef();
  const marketRef = useRef();
  const nameRef = useRef();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/getmarkets');
        setMarkets(response.data);
      } catch (error) {
        console.error("Error fetching markets:", error);
        setError('Failed to fetch markets. Please try again later.');
      }
    };

    fetchMarkets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    const emailValid = regexEmail.test(email);
    const passwordValid = regexPassword.test(password);

    if (!name || !email || !password || !selectedRole) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!passwordValid) {
      setError('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        email,
        password,
        market: selectedMarket,
        role: selectedRole,
        calendlyUsername
      });
      if (response.status === 201) {
        console.log("User registered successfully");
        emailRef.current.value = "";
        passwordRef.current.value = "";
        nameRef.current.value = "";
        setSelectedMarket("");
        setSelectedRole("");
        setCalendlyUsername("");
      }
    } catch (error) {
      setError('Failed to register user. Please try again later.');
    }
  };

  const handlePasswordShow = () => {
    setShowPassword(!showPassword);
  };

  const handleMarket = async () => {
    const market = marketRef.current.value;

    if (!market) {
      alert('Market is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/market', { market }, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.status === 201) {
        alert('Market registered successfully');
       
        const marketsResponse = await axios.get('http://localhost:3001/api/auth/getmarkets');
        setMarkets(marketsResponse.data);
      }
    } catch (error) {
      alert('Failed to register market. Please try again later.');
    } finally {
      marketRef.current.value = "";
    }
  };

  return (
    <div className='d-flex align-items-center vh-100 justify-content-center m-auto'>
      <div className='vh-100 col-12 col-md-6 d-flex justify-content-center align-items-center'>
  <img src="register.png" alt="register image" className="img-fluid"
   style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
</div>

      <div className='vh-100 col-12 col-md-6 d-flex flex-column justify-content-center align-items-center'>
        <div className='d-flex mb-3 justify-content-center'>
          <Button
            variant={activeForm === 'register' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveForm('register')}
            className='me-2'
          >
            Register User
          </Button>
          <Button
            variant={activeForm === 'market' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveForm('market')}
          >
            Add Market
          </Button>
        </div>

        {activeForm === 'register' && (
          <Form className='shadow-lg p-3 rounded-3' onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
            <h3 className="text-center">Register</h3>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                ref={nameRef}
                className="shadow-none border"
                type="text"
                placeholder="Enter name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                ref={emailRef}
                className="shadow-none border"
                type="email"
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <div className='d-flex border rounded'>
                <Form.Control
                  ref={passwordRef}
                  className="shadow-none border-0"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                />
                <span onClick={handlePasswordShow} role='button' className='mt-1 me-1'>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <span className='text-danger' aria-live="polite">{error}</span>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicRole">
              <Dropdown onSelect={(e) => setSelectedRole(e)}>
                <Dropdown.Toggle className='w-100 bg-transparent text-dark border-secondary' id="dropdown-basic">
                  {selectedRole || "Select Role"}
                </Dropdown.Toggle>
                <Dropdown.Menu className='w-100 overflow-auto'>
                  {roles.map((role, index) => (
                    <Dropdown.Item key={index} eventKey={role}>
                      {role}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Form.Group controlId="formCalendlyUsername" className='my-3'>
              <Form.Control
                type="text"
                placeholder="Enter Calendly username (optional)"
                value={calendlyUsername}
                onChange={(e) => setCalendlyUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicMarket">
              <Dropdown onSelect={(e) => setSelectedMarket(e)}>
                <Dropdown.Toggle className='w-100 bg-transparent text-dark border-secondary' id="dropdown-basic">
                  {selectedMarket || "Select Market"}
                </Dropdown.Toggle>
                <Dropdown.Menu className='w-100 h-50'  style={{ 
                        padding: '10px', 
                        backgroundColor: '#f8f9fa', 
                        color: '#333', 
                        fontWeight: '500',
                        borderBottom: '1px solid #ddd',
                        overflow:'auto'
                      }}
                     >
                  {markets.sort((a, b) => a.market.localeCompare(b.market)).map((market) => (

                    
                    <Dropdown.Item key={market.id} eventKey={market.market}>
                      {market.market}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Button variant="primary" type="submit" className='w-100'>
              Register
            </Button>
          </Form>
        )}

        {activeForm === 'market' && (
          <Form className='shadow-lg p-3 rounded-3' style={{ maxWidth: '400px', width: '100%' }}>
            <h3 className="text-center">Add Market</h3>
            <Form.Group className="mb-3" controlId="formBasicMarket">
              <Form.Control
                ref={marketRef}
                className="shadow-none border"
                type="text"
                placeholder="Enter market"
                required
              />
            </Form.Group>
            <Button className='w-100' onClick={handleMarket}>Add</Button>
          </Form>
        )}
      </div>
    </div>
  );
}

export default Register;

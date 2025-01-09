import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/login`,
        { email, password },
        { withCredentials: true }
      );


      if (response.status === 200) {
        const { token } = response.data;

        localStorage.setItem('token', token);


        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        switch (userRole) {
          case 'admin':
            navigate('/adminhome');
            break;
          case 'hr':
            navigate('/hrhome');
            break;
          case 'trainer':
            navigate('/trainerhome');
            break;
          case 'screening_manager':
            navigate('/screeinghome');
            break;
          case 'interviewer':
            navigate('/interviewerdashboard');
            break;
          case 'market_manager':
            navigate('/markethome');
            break;
            case 'direct_hiring':
              navigate('/directHiring');
              break;
          default:
            navigate('/');
            break;
        }
        // Show success toast
        toast.success('Login successful!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,  // Auto close after 3 seconds
        });
      }
    } catch (error) {
      setError('Login failed. Please check your email and password.', error);
    }
  };

  const handlePasswordShow = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <>
      <Form className='p-4 rounded' onSubmit={handleSubmit}>
        <h3 className='text-center mb-4'>Login</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            ref={emailRef}
            type="email"
            placeholder="Enter email"
            required
            className="shadow-none border"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <div className='d-flex border rounded'>
            <Form.Control
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="shadow-none border-0"
            />
            <span onClick={handlePasswordShow} role='button' className='mt-2 me-2'>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {error && <span className='text-danger d-block mt-2 text-center'>{error}</span>}
        </Form.Group>

        <Button variant="primary" type="submit" className='w-100'>
          Login
        </Button>
      </Form>
      <ToastContainer />
    </>
  );
}

export default Login;

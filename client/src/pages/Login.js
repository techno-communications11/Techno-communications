import React, { useState, useRef, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import { FaEyeSlash, FaEye, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../utils/Button';
import Loader from '../utils/Loader';
import Inputicons from '../utils/Inputicons';
import { MyContext } from './MyContext';
import API_URL from '../Constants/ApiUrl';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserData } = useContext(MyContext);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');


    if (!emailRef.current || !passwordRef.current) {
      setError('Form inputs are not properly initialized.');
      return;
    }

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();


    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const loginResponse = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);


      if (loginResponse.status !== 200) {
        throw new Error('Login failed. Please try again.');
      }

      console.log('Fetching user data...');
      const userRes = await axios.get(`${API_URL}/user/me`, {
        withCredentials: true,
        signal: controller.signal,
      });


      const userData = userRes.data;
      if (!userData?.id || !userData?.role) {
        throw new Error('Invalid user data received.');
      }

      const { id, role, email: userEmail, market, name, ...otherData } = userData;
      setUserData({ id, role, email: userEmail, market, name, ...otherData });
      setIsAuthenticated(true);

      const routeMap = {
        admin: '/adminhome',
        hr: '/hrhome',
        trainer: '/trainerhome',
        screening_manager: '/screeinghome',
        interviewer: '/interviewerdashboard',
        market_manager: '/markethome',
        direct_hiring: '/directHiring',
      };

      navigate(routeMap[role] || '/');
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else if (error.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred. Please try again.'
        );
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Form className="p-4 rounded shadow-sm" onSubmit={handleSubmit}>
      <h3 className="text-center mb-4 fw-bold">Login</h3>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <div className="input-group">
          <Inputicons icon={FaEnvelope} />
          <Form.Control
            ref={emailRef}
            type="email"
            placeholder="Enter email"
            required
            className="shadow-none border"
          />
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <div className="input-group">
          <Inputicons icon={FaLock} />
          <Form.Control
            ref={passwordRef}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            className="shadow-none border"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            role="button"
            className="input-group-text"
          >
            {showPassword ? <Inputicons icon={FaEye} /> : <Inputicons icon={FaEyeSlash} />}
          </span>
        </div>
        {error && (
          <span className="text-danger d-block mt-2 text-center">{error}</span>
        )}
      </Form.Group>

      <Button
        variant=" w-100"
        type="submit"
        code="#E10174"
        label="Login"
        disabled={loading}
      />
    </Form>
  );
}

export default Login;
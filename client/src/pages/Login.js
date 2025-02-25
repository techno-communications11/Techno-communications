import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaEyeSlash, FaEye, FaEnvelope, FaLock } from 'react-icons/fa'; // Added more icons
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './Login.css'; // Optional: Add custom CSS for additional styling

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true during submission

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        // Redirect based on user role
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
        // toast.success('Login successful!', {
        //   // position: toast.POSITION.TOP_CENTER,
        //   autoClose: 3000,
        // });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Login failed. Please check your email and password.'
      );
      // toast.error(error.response?.data?.message || 'Login failed!', {
      //   // position: toast.POSITION.TOP_CENTER,
      //   autoClose: 3000,
      // });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handlePasswordShow = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Form className="p-4 rounded shadow-sm" onSubmit={handleSubmit}>
        <h3 className="text-center mb-4 fw-bold">Login</h3>

        {/* Email Input */}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <div className="input-group">
            <span className="input-group-text">
              <FaEnvelope style={{color:'#e10174'}} />
            </span>
            <Form.Control
              ref={emailRef}
              type="email"
              placeholder="Enter email"
              required
              className="shadow-none border"
            />
          </div>
        </Form.Group>

        {/* Password Input */}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <div className="input-group">
            <span className="input-group-text">
              <FaLock  style={{color:'#e10174'}}/>
            </span>
            <Form.Control
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="shadow-none border"
            />
            <span
              onClick={handlePasswordShow}
              role="button"
              className="input-group-text"
            >
              {showPassword ? <FaEye style={{color:'#e10174'}} /> : <FaEyeSlash style={{color:'#e10174'}} />}
            </span>
          </div>
          {error && (
            <span className="text-danger d-block mt-2 text-center">{error}</span>
          )}
        </Form.Group>

        {/* Submit Button */}
        <Button
          // variant="primary"
          style={{backgroundColor:'#e10174'}}
          type="submit"
          className="w-100 fw-bold border-0"
          disabled={loading} // Disable button during loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>

      {/* Toast Container */}
      {/* <ToastContainer /> */}
    </>
  );
}

export default Login;
import { useState, useRef, useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { FaEyeSlash, FaEye, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../utils/Button";
import Loader from "../utils/Loader";
import Inputicons from "../utils/Inputicons";
import { MyContext } from "../pages/MyContext";
import api, { setSessionExpired, setPreLogin } from "../api/axios";

const routeMap = {
  admin: "/adminhome",
  hr: "/hrhome",
  trainer: "/trainerhome",
  screening_manager: "/screeinghome",
  interviewer: "/interviewerdashboard",
  market_manager: "/markethome",
  direct_hiring: "/directHiring",
};

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserData, isAuthenticated, userData } = useContext(MyContext);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userData?.role) {
      navigate(routeMap[userData.role] || "/", { replace: true });
    }
  }, [isAuthenticated, userData, navigate]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    
    if (!emailRef.current || !passwordRef.current) {
      setError("Form inputs are not properly initialized.");
      return;
    }
    
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Clear any previous session flags
      setSessionExpired(false);
      setPreLogin(true);

      const loginResponse = await api.post(
        "/login",
        { email, password },
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (loginResponse.status !== 200) {
        throw new Error("Login failed. Please try again.");
      }

      // Get user data after successful login
      const userRes = await api.get("/user/me", {
        signal: controller.signal,
      });

      const userData = userRes.data;
      if (!userData?.id || !userData?.role) {
        throw new Error("Invalid user data received.");
      }

      const {
        id,
        role,
        email: userEmail,
        market,
        name,
        ...otherData
      } = userData;
      
      // Update context state
      setUserData({ id, role, email: userEmail, market, name, ...otherData });
      setIsAuthenticated(true);
      setSessionExpired(false);
      setPreLogin(false);

      // Navigate to appropriate page based on role
      const targetRoute = routeMap[role] || "/";
      navigate(targetRoute, { replace: true });
      
    } catch (error) {
      if (error.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.response?.status === 429) {
        setError("Too many login attempts. Please wait a few minutes and try again.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred. Please try again."
        );
      }
      console.error("Login error:", error);
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
            autoComplete="email"
          />
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <div className="input-group">
          <Inputicons icon={FaLock} />
          <Form.Control
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="shadow-none border"
            autoComplete="current-password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            role="button"
            className="input-group-text"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Inputicons icon={FaEye} />
            ) : (
              <Inputicons icon={FaEyeSlash} />
            )}
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
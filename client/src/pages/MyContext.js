import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Loader from "../utils/Loader";
import api, { 
  getSessionExpired, 
  setSessionExpired, 
  getPreLogin, 
  setPreLogin, 
  setContextSetters 
} from "../api/axios";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const navigate = useNavigate();
  const [applicant_uuid, setapplicant_uuid] = useState(null);
  const [captureStatus, setCaptureStatus] = useState(null);
  const [captureDate, setCaptureDate] = useState([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);
  const [markets, setMarkets] = useState([]);
  const [startDate, setStartDateForContext] = useState("");
  const [endDate, setEndDateForContext] = useState("");
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Register context setters with axios interceptor
  useEffect(() => {
    setContextSetters({
      setUserData,
      setIsAuthenticated
    });
  }, []);

  // Initial authentication check
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        setPreLogin(true); // Start in pre-login state
        
        const response = await api.get("/user/me", {
          signal: AbortSignal.timeout(10000)
        });

        if (response.status === 200 && isMounted) {
          const userData = response.data;
          if (!userData?.id || !userData?.role) {
            throw new Error("Invalid user data");
          }
          
          setUserData({
            id: userData.id,
            role: userData.role,
            email: userData.email,
            market: userData.market,
            name: userData.name,
          });
          setIsAuthenticated(true);
          setPreLogin(false); // Transition to post-login
          setSessionExpired(false);
        }
      } catch (err) {
        if (isMounted) {
          console.log("Authentication verification failed:", err.message);
          setUserData(null);
          setIsAuthenticated(false);
          setSessionExpired(false);
          setPreLogin(false);
          navigate("/", { replace: true });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Monitor session expiry
  useEffect(() => {
    if (getSessionExpired() && !loading) {
      console.log("Session expired - clearing user data");
      setUserData(null);
      setIsAuthenticated(false);
      setSessionExpired(false);
      navigate("/", { replace: true });
    }
  }, [loading, navigate]);

  // Set up periodic token validation for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !userData) return;

    const validateToken = async () => {
      try {
        await api.get("/user/me", { timeout: 5000 });
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("Token validation failed - session expired");
          // The axios interceptor will handle the logout automatically
        }
      }
    };

    // Check token validity every 5 minutes
    const interval = setInterval(validateToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, userData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <MyContext.Provider
      value={{
        applicant_uuid,
        userData,
        setUserData,
        isAuthenticated,
        setIsAuthenticated,
        setapplicant_uuid,
        captureStatus,
        setCaptureStatus,
        captureDate,
        setCaptureDate,
        markets,
        setMarkets,
        startDate,
        setStartDateForContext,
        endDate,
        setEndDateForContext,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
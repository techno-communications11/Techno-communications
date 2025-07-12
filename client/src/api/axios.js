import axios from "axios";
import Logout from "../Auth/Logout";

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
});

let isLoggingOut = false;
let navigate = null;
let isSessionExpired = false;
let isPreLogin = true;
let contextSetters = null; // Store context setters for automatic logout

export const setNavigate = (nav) => {
  navigate = nav;
  console.log("Navigate function set:", !!nav);
};

export const setContextSetters = (setters) => {
  contextSetters = setters;
  console.log("Context setters registered:", !!setters);
};

export const setSessionExpired = (value) => {
  isSessionExpired = value;
};

export const getSessionExpired = () => isSessionExpired;

export const setPreLogin = (value) => {
  isPreLogin = value;
  console.log("Pre-login state set to:", value);
};

export const getPreLogin = () => isPreLogin;

// Block requests if session is expired, but allow pre-login requests
api.interceptors.request.use(
  (config) => {
    if (isSessionExpired && !isPreLogin && !["/login", "/logout", "/user/me"].includes(config.url)) {
      console.warn("Request blocked due to expired session:", config.url);
      return Promise.reject(new Error("Session expired. Redirecting."));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 errors (token expired/invalid)
    if (error.response?.status === 401 && !isLoggingOut && !getPreLogin()) {
      console.log("401 error detected - initiating automatic logout");
      isLoggingOut = true;
      setSessionExpired(true);
      
      try {
        // Perform logout and clear state
        await Logout();
        
        // Clear user data using context setters if available
        if (contextSetters) {
          contextSetters.setUserData(null);
          contextSetters.setIsAuthenticated(false);
        }
        
        // Navigate to login page
        if (navigate) {
          navigate("/", { replace: true });
        }
      } catch (logoutErr) {
        console.error("Logout failed:", logoutErr);
        // Still clear state and navigate even if logout API fails
        if (contextSetters) {
          contextSetters.setUserData(null);
          contextSetters.setIsAuthenticated(false);
        }
        if (navigate) {
          navigate("/", { replace: true });
        }
      } finally {
        isLoggingOut = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
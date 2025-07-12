import api from "../api/axios";

const Logout = async (setUserData = null, setIsAuthenticated = null) => {
  try {
    // Always attempt to clear the token on server side
    try {
      await api.post("/logout", {}, { 
        timeout: 5000 // 5 second timeout
      });
    } catch (apiError) {
      console.warn("Logout API call failed:", apiError.message);
      // Continue with client-side cleanup even if server logout fails
    }
    
    // Clear user data and authentication state
    if (setUserData) setUserData(null);
    if (setIsAuthenticated) setIsAuthenticated(false);
    
    // Clear all cookies (more thorough cleanup)
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
      document.cookie = `${name}=; Max-Age=0; path=/;`;
    });
    
    // Clear local storage and session storage (if any)
    localStorage.clear();
    sessionStorage.clear();
    
    console.log("Logout completed successfully");
    return true;
  } catch (error) {
    console.error("Logout failed:", error.message);
    
    // Still clear client-side state even if logout fails
    if (setUserData) setUserData(null);
    if (setIsAuthenticated) setIsAuthenticated(false);
    
    // Clear cookies anyway
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
      document.cookie = `${name}=; Max-Age=0; path=/;`;
    });
    
    return false;
  }
};

export default Logout;
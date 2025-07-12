import { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api, { setNavigate } from "../api/axios";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Button from "../utils/Button";
import { MyContext } from "./MyContext";
import Logout from "../Auth/Logout";
import getDefaultRoute from "../utils/getDefaultRoute";
function AppNavbar() {
  const navigate = useNavigate();
  const { userData, isAuthenticated, setUserData, setIsAuthenticated } =
    useContext(MyContext);
  const [counts, setCounts] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout calls

    setIsLoggingOut(true);

    try {
      // Call logout with context setters
      await Logout(setUserData, setIsAuthenticated);

      // Navigate to home page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear state and navigate
      setUserData(null);
      setIsAuthenticated(false);
      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userData?.id || !userData?.role) return;

    const fetchCounts = async () => {
      let endpoint = "";
      switch (userData.role) {
        case "interviewer":
          endpoint = `/users/${userData.id}/interviewapplicants`;
          break;
        case "hr":
          endpoint = `/users/${userData.id}/hrinterviewapplicants`;
          break;
        case "screening_manager":
          endpoint = `/users/${userData.id}/applicants`;
          break;
        case "direct_hiring":
          endpoint = `/users/${userData.id}/directapplicants`;
          break;
        default:
          return;
      }

      try {
        const res = await api.get(endpoint);
        if (Array.isArray(res.data)) setCounts(res.data.length);
      } catch (err) {
        console.error("Fetch count error:", err.message);
        // If it's a 401 error, the axios interceptor will handle logout
      }
    };

    fetchCounts();
  }, [userData, isAuthenticated]);

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const stringAvatar = (name) => {
    if (!name || typeof name !== "string") {
      return {
        sx: { bgcolor: "#000000", width: 30, height: 30 },
        children: "U",
      };
    }
    const nameParts = name.split(" ");
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 30,
        height: 30,
      },
      children: `${nameParts[0][0]}${nameParts[1]?.[0] || ""}`,
    };
  };

  // Don't render navbar if user is not authenticated or data is missing
  if (!isAuthenticated || !userData || !userData.name || !userData.role) {
    return null;
  }
  const handleClick = () => {
    if (userData?.role) {
      navigate(getDefaultRoute(userData.role));
    } else {
      navigate("/"); // fallback for public
    }
  };

  return (
    <Navbar expand="lg" className="shadow-sm bg-white">
      <Container fluid>
        <Navbar.Brand
          role="button"
          onClick={handleClick}
          className="fw-bold text-capitalize ms-2 d-flex align-items-center"
        >
          <img src="/logo.png" alt="Logo" width="44" height="34" />
          Techno Communications LLC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3 fw-bolder text-dark">
            {userData.role === "admin" && (
              <>
                <Nav.Link as={Link} to="/adminTabs">
                  HR Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
            {userData.role === "market_manager" && (
              <>
                <Nav.Link as={Link} to="/markethome">
                  Job Postings
                </Nav.Link>
                <Nav.Link as={Link} to="/selectedathr">
                  Hired Applicants
                </Nav.Link>
              </>
            )}
            {(userData.role === "screening_manager" ||
              userData.role === "direct_hiring") && (
              <Nav.Link
                as={Link}
                to={
                  userData.role === "screening_manager"
                    ? "/screening"
                    : "/directform"
                }
              >
                List Profile
              </Nav.Link>
            )}
            {userData.role === "direct_hiring" && (
              <Nav.Link as={Link} to="/directtabs">
                Applicants
              </Nav.Link>
            )}
            {[
              "interviewer",
              "hr",
              "screening_manager",
              "direct_hiring",
            ].includes(userData.role) && (
              <Nav.Link
                as={Link}
                to={
                  userData.role === "interviewer"
                    ? "/interviewhome"
                    : userData.role === "hr"
                    ? "/hrtabs"
                    : userData.role === "screening_manager"
                    ? "/tabs"
                    : userData.role === "direct_hiring"
                    ? "/directnew"
                    : "/"
                }
                className="fw-bold"
                style={{
                  position: "relative",
                  background: "linear-gradient(90deg, #3f5efb, #b41b94)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                New
                {counts > 0 && (
                  <Badge badgeContent={counts} color="error" className="ms-2" />
                )}
              </Nav.Link>
            )}
            <IconButton
              onClick={() => navigate("/updatepassword")}
              color="primary"
            >
              <SettingsIcon />
            </IconButton>
            <Nav.Link className="d-flex align-items-center">
              <Avatar {...stringAvatar(userData.name)} />
              <div
                className="ms-2 text-capitalize"
                style={{ fontSize: "0.85rem" }}
              >
                <div>{userData.name}</div>
                <div style={{ fontSize: "0.75rem" }}>
                  {userData.role.replace(/_/g, " ")}
                </div>
              </div>
            </Nav.Link>
            <Button
              variant="btn-danger ms-2"
              label={isLoggingOut ? "Logging out..." : "Logout"}
              size="md"
              onClick={handleLogout}
              disabled={isLoggingOut}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

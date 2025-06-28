import { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Button from "../utils/Button";
import { MyContext } from "./MyContext";

function AppNavbar() {
  const apiurl = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const { userData, setIsAuthenticated } = useContext(MyContext);
  const [counts, setCounts] = useState(0);
  const [error, setError] = useState(null);

  const roleRoutes = {
    interviewer: "/InterviewerDashboard",
    direct_hiring: "/directHiring",
    screening_manager: "/screeinghome",
    admin: "/adminhome",
    hr: "/hrhome",
    market_manager: "/markethome",
    trainer: "/",
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${apiurl}/logout`,
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to log out. Please try again.");
    }
  };


  useEffect(() => {
    const fetchCounts = async () => {
      if (!userData?.id || !userData?.role) {
        console.warn("userData is incomplete:", userData);
        return;
      }

      try {
        let endpoint = "";
        if (userData.role === "interviewer") {
          endpoint = `/users/${userData.id}/interviewapplicants`;
        } else if (userData.role === "hr") {
          endpoint = `/users/${userData.id}/hrinterviewapplicants`;
        } else if (userData.role === "screening_manager") {
          endpoint = `/users/${userData.id}/applicants`;
        }

        if (endpoint) {
          const response = await axios.get(`${apiurl}${endpoint}`, {
            withCredentials: true,
          });
          if (response.status === 200 && Array.isArray(response.data)) {
            setCounts(response.data.length);
          } else {
            console.warn("Unexpected response format:", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
        setError("Failed to fetch applicant counts.");
      }
    };

    fetchCounts();
  }, [userData, apiurl]);

  // Utility functions for avatar
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
    if (!name) return { sx: { bgcolor: deepPurple[600] }, children: "N/A" };
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

  // Return null if userData is not available
  if (!userData || !userData.role || !userData.name) {
    return null; // Or a fallback UI, e.g., <div>Loading...</div>
  }

  return (
    <Navbar expand="lg" className="shadow-sm">
      <Container fluid>
        {/* {userData.role !== "trainer" && userData.role !== "market_manager" && ( */}
          <Navbar.Brand
            as={Link}
            to={roleRoutes[userData.role] || "/"}
            className="fw-bolder text-capitalize ms-2"
          >
            <img
              src="/logo.png"
              alt="Logo"
              width="44"
              height="34"
              className="d-inline-block align-top"
            />
            &nbsp; techno communications LLC
          </Navbar.Brand>
        {/* )} */}

        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="ms-auto d-flex align-items-center">
            <div className="d-flex gap-3 align-items-center">
              {(userData.role === "screening_manager" || userData.role === "direct_hiring") && (
                <Nav.Link
                  as={Link}
                  to={
                    userData.role === "screening_manager"
                      ? "/screening"
                      : "/directform"
                  }
                  className="fw-bolder nav-link-custom"
                >
                  List Profile
                </Nav.Link>
              )}
              {userData.role === "market_manager" && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/markethome"
                    className="fw-bolder nav-link-custom"
                  >
                    Job Posting
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/selectedathr"
                    className="fw-bolder nav-link-custom"
                  >
                    Hired Applicants
                  </Nav.Link>
                </>
              )}
              {userData.role === "admin" && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/adminTabs"
                    className="fw-bolder nav-link-custom"
                  >
                    HR Profile
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    className="fw-bolder nav-link-custom"
                  >
                    Register
                  </Nav.Link>
                </>
              )}
              {userData.role === "direct_hiring" && (
                <Nav.Link
                  as={Link}
                  to="/directtabs"
                  className="fw-bolder nav-link-custom"
                >
                  Applicants
                </Nav.Link>
              )}
              {userData.role !== "admin" &&
                userData.role !== "trainer" &&
                userData.role !== "market_manager" && (
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
                        : ""
                    }
                    className="fw-bolder nav-link-custom"
                    style={{
                      position: "relative",
                      display: "inline-block",
                      background:
                        "linear-gradient(90deg, rgba(63,94,251,1) 0%, rgba(180,27,148,1) 81%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      fontWeight: "bold",
                    }}
                  >
                    New
                    {counts > 0 && (
                      <Badge
                        badgeContent={counts}
                        className="mb-4 ms-2"
                        color="error"
                      />
                    )}
                  </Nav.Link>
                )}
              <Nav.Link>
                <IconButton
                  color="primary"
                  onClick={() => navigate("/updatepassword")}
                >
                  <SettingsIcon />
                </IconButton>
              </Nav.Link>
              <Nav.Link className="d-flex align-items-center">
                <Avatar
                  sx={{ bgcolor: deepPurple[600], width: 30, height: 30 }}
                  {...stringAvatar(userData.name)}
                />
                <div className="ms-2 fw-bolder">
                  <span
                    className="d-block text-start"
                    style={{ fontSize: "0.9rem", textTransform: "capitalize" }}
                  >
                    {userData.name}
                  </span>
                  <span
                    className="d-block text-start"
                    style={{ fontSize: "0.9rem", textTransform: "capitalize" }}
                  >
                    {userData.role.split("_").join(" ")}
                  </span>
                </div>
              </Nav.Link>
              <Button
                variant="btn-danger ms-2"
                onClick={handleLogout}
                size="md"
                label="Logout"
              />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
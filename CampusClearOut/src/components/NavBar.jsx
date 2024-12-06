import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NotificationDropdown } from "../pages/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../pages/Auth";
const API = import.meta.env.VITE_BACKEND_URL;

export function NavBar() {
  const {user, setUser}=useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        //clear user data on logout
        setUser();
        navigate("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    
    // bootstrap Navbar component with expand="lg" to make it responsive at large screens and bg="light" for a light background
    <Navbar expand="lg"className="custom-navbar"> 
      <Container>
        {/* creates clickable brand logo that links to the homepage */}
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          Campus Clearout
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* nav section for navigation links, className="me-auto" adds margin to the right, pushing links to the left */}
          <Nav className="me-auto">
            {/* Nav.Link to homepage, using React Router's Link to handle routing */}
            <Nav.Link as={Link} to="/" className="nav-link">Listings</Nav.Link>
            {user && <Nav.Link as={Link} to="/dashboard" className="nav-link">Dashboard</Nav.Link>}
            </Nav>

            {/* notification dropdown component that shows the user's notifications only if they're logged in*/}
            {user && <NotificationDropdown/>}

            <Nav>
              {/* If the user is logged in, show a dropdown with their username and a Logout option */}
            {user ? (
              <NavDropdown
                title={`Welcome, ${user.username}`}
                id="navbarScrollingDropdown"
                className="user-dropdown"
              >
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="nav-link">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

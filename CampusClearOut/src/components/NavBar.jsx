import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_BACKEND_URL;

export function NavBar({user, setUser}) {
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
    <Navbar expand="lg" bg="light"> 
      <Container>
        
        {/* creates clickable brand logo that links to the homepage */}
        <Navbar.Brand as={Link} to="/">
          Campus Clearout
        </Navbar.Brand>
        
        {/* nav section for navigation links, className="me-auto" adds margin to the right, pushing links to the left */}
        <Nav className="me-auto">
          
          {/* Nav.Link to homepage, using React Router's Link to handle routing */}
          <Nav.Link as={Link} to="/">
            Listings
          </Nav.Link>
          
          {/* Nav.Link to dashboard page, using React Router's Link for navigation */}
          <Nav.Link as={Link} to="/dashboard">
            Dashboard
          </Nav.Link>

          {user? (
            <NavDropdown
              title={`Welcome, ${user.username}`}
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ):
          <Nav>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        </Nav>
          }
        </Nav>
      </Container>
    </Navbar>
  );
}

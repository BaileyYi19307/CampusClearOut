import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export function NavBar() {
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
          <Nav>
          <Nav.Link as={Link} to="/register">Register</Nav.Link>
        </Nav>
        </Nav>
      </Container>
    </Navbar>
  );
}

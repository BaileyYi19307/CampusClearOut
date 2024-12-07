import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaListAlt, FaClipboardList } from "react-icons/fa";



export function Dashboard() {
  return (
    
    <Container className="mt-5">
      <header className="text-center mb-4">
        <h1 className="text-primary">Dashboard</h1>
        <p className="text-muted">Welcome to your dashboard. Manage your listings and requests here</p>
      </header>
      <main>
        <Row className="g-4">
          {/* manage listings */}
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                <FaListAlt size={40} className="mb-3 text-success" />
                <Card.Title>My Listings</Card.Title>
                <Card.Text>
                  View and manage all your active listings
                </Card.Text>
                <Button
                  as={Link}
                  to="/dashboard/mylistings"
                  variant="primary"
                  className="w-75"
                >
                  Go to Listings
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* manage requests */}
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                <FaClipboardList size={40} className="mb-3 text-warning" />
                <Card.Title>My Requests</Card.Title>
                <Card.Text>
                  Track the status of your requests and take action
                </Card.Text>
                <Button
                  as={Link}
                  to="/dashboard/myrequests"
                  variant="primary"
                  className="w-75"
                >
                  Go to Requests
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </main>
    </Container>
  );
}

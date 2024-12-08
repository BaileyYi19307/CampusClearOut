import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge, Button } from "react-bootstrap";

function Listing({ seller, title, description, price, image, status, link }) {
  const placeholderImage = "https://via.placeholder.com/150?text=No+Image";

  //what badge type? determine based on status
  const badgeVariant =
  status === "Available" ? "success" :
  status === "On Hold" ? "warning" :
  "secondary";

  return (
    <Card className="listing-card shadow-sm mb-4">
      <Card.Body className="pb-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">{title}</Card.Title>
          <Badge bg={badgeVariant}>{status}</Badge>
        </div>
      </Card.Body>
      <Card.Img
        variant="top"
        src={image || placeholderImage}
        alt={title || "Listing Image"}
        className="listing-image"
      />

      <Card.Body>
        <Card.Text>
          <strong>Posted by:</strong> {seller}
        </Card.Text>
        <Card.Text>{description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-success fw-bold">${price}</span>
          <Button
            as={Link}
            to={status === "Available" ? link : "#"}
            variant={status === "Available" ? "primary" : "secondary"}
            disabled={status !== "Available"}
          >
            {status === "Available" ? "View Listing" : "Unavailable"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Listing;

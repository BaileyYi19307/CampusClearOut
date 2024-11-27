import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

const API = import.meta.env.VITE_BACKEND_URL;

export function Listings() {
  const [listings, setListings] = useState([]);

  //retrive all the listings
  useEffect(() => {
    const response = fetch(`${API}/api/listings`)
      .then((response) => response.json())
      .then((listingData) => {
        setListings(listingData);
        console.log("This is the listing data", listingData);
      })
      .catch((error) => console.error("error fetching listings:", error));
  }, []);

  return (
    <div>
      <Container>
        <h2 className="text-center my-4">Available Listings</h2>
        <Row className="listing-grid">
          {listings.map((listing) => (
            <Col
              key={listing._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex align-items-stretch"
            >
              <div
                className="listing-card"
                style={{
                  width: "100%",
                  margin: "1rem",
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <p>
                  <strong>Price:</strong> ${listing.price}
                </p>

                <Button
                  variant="primary"
                  as={Link}
                  to={`/listings/${listing._id}`}
                >
                  View Details
                </Button>
              </div>
            </Col>
          ))}
          ;
        </Row>
      </Container>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Listing from "../components/Listing";

const API = import.meta.env.VITE_BACKEND_URL;

export function Listings() {
  const [listings, setListings] = useState([]);
  // retrieve the location state for success messages
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );

  // fetch all listings from the API
  useEffect(() => {
    const response = fetch(`${API}/api/listings`)
      .then((response) => response.json())
      .then((listingData) => {
        setListings(listingData);
        console.log("This is the listing data", listingData);
      })
      .catch((error) => console.error("error fetching listings:", error));
  }, []);

  // hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer); // cleanup on component unmount
    }
  }, [successMessage]);

  return (
    <div>
      <Container>

        {/* display success message */}
        {successMessage && (
          <Alert
            variant="success"
            onClose={() => setSuccessMessage("")}
            dismissible
          >
            {successMessage}
          </Alert>
        )}

        {/* header section */}
        <header className="text-center py-4 mb-4 mt-5 bg-light shadow-sm rounded">
          <h1 className="text-primary display-4">Welcome to CampusClearOut</h1>
          <p className="text-muted lead">
            A marketplace for students to buy, sell, and trade essentials as the
            semester wraps up
          </p>
        </header>

        {/* display listings */}
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
              <Listing
                seller={listing.seller.username}
                title={listing.title}
                description={listing.description}
                price={listing.price}
                image={
                  listing.images && listing.images.length > 0
                    ? listing.images[0]
                    : null
                }
                status={listing.status} 
                link={`/listings/${listing._id}`}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

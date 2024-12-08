import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Listing from "../components/Listing";

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
      <header className="text-center py-4 mb-4 mt-5 bg-light shadow-sm rounded">
        <h1 className="text-primary display-4">Welcome to CampusClearOut</h1>
        <p className="text-muted lead">A marketplace for students to buy, sell, and trade essentials as the semester wraps up</p>
      </header>        
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
                image={listing.images && listing.images.length > 0 ? listing.images[0] : null}
                status={listing.status} // Pass status to Listing component
                link={`/listings/${listing._id}`}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

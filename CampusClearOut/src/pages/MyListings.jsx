import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

const API = import.meta.env.VITE_BACKEND_URL;

export function MyListings() {
  const [myListings, setMyListings] = useState([]);
  const [searchParams] = useSearchParams();
  const isCreated = searchParams.get('created') === 'true';

  // retrieve all my listings
  useEffect(() => {
    fetch(`${API}/api/listings`)
      .then(response => response.json())
      .then(listingData => {
        setMyListings(listingData);
        console.log("This is the listing data", listingData);
      })
      .catch(error => console.error("Error fetching listings:", error));
  }, []);

  // handle deleting a listing
  const handleDelete = async (listingId) => {
    try {
      const response = await fetch(`${API}/api/listings/${listingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // filter out deleted listing
        setMyListings(myListings.filter(listing => listing._id !== listingId));
        console.log('Listing deleted successfully');
      } else {
        console.error("Failed to delete listing");
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  return (
    <div>
      {isCreated && (
        <Alert variant="success">
          Listing created successfully!
        </Alert>
      )}
      <Button variant="primary" as={Link} to={"/dashboard/mylistings/create"}>
        Create New Listing
      </Button>
      <Container>
        <h2 className="text-center my-4">My Listings</h2>
        <Row className="listing-grid">
          {myListings.map(listing => (
            <Col key={listing._id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
              <div className="listing-card" style={{ width: '100%', margin: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>Title: {listing.title}</h3>
                <p>Description: {listing.description}</p>
                <p><strong>Price:</strong> ${listing.price}</p>
                
                {/* link button to listings detail page */}
                <Button variant="primary" as={Link} to={`/listings/${listing._id}`}>View Details</Button>
                <Button variant="danger" onClick={() => handleDelete(listing._id)}>Delete</Button>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

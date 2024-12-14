import React from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { useAuth } from "./Auth";
import { MakeRequest } from "../components/MakeRequest";

const API = import.meta.env.VITE_BACKEND_URL;

export function ListingDetails() {
  //extract postId parameter from URL
  const { user, setUser } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();

  //manage listing data and form visibility state
  const [listing, setListing] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);

  //fetch listing details when component mounts or postId changes
  useEffect(() => {
    async function getListingDetails() {
      try {
        let response = await fetch(`${API}/api/listings/${postId}`);

        if (response.ok) {
          let data = await response.json();
          setListing(data);
        } else {
          console.error("failed to fetch listing details");
        }
      } catch (error) {
        console.error("error fetching specific listing:", error);
      }
    }
    getListingDetails();
  }, [postId]);

  //check if the user is the seller
  const isSelfRequest = user?.id === listing?.seller?._id;

  // show the request form or navigate to login if the user is not logged in
  const handleRequestItem = () => {
    setShowRequestForm(true);
    if (!user) {
      navigate("/login");
    }
  };

  //cancel the request form
  const handleCancelRequest = () => {
    setShowRequestForm(false);
  };

  return (
    <Container className="mt-4">

      {/* breadcrumb navigation */}
      <Breadcrumb>
        <Breadcrumb.Item href="/">Listings</Breadcrumb.Item>
        <Breadcrumb.Item active>
          {listing.title || "Listing Details"}
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* conditionally render the request form */}
      {showRequestForm ? (
        <MakeRequest
          seller={listing.seller}
          sellerName={listing.seller?.username || "Anonymous"}
          buyer={user.id}
          listing={postId}
          listingName={listing.title}
          onCancel={handleCancelRequest}
        />
      ) : (
        <>
          {/* listing details */}
          <Row>
            <Col lg={8} className="mx-auto">
              <Card className="p-3 mb-5 bg-white rounded">
                <Row className="g-0">
                  <Col md={6}>
                    <Card.Img
                      variant="top"
                      src={
                        listing.images && listing.images.length > 0
                          ? listing.images[0]
                          : "https://via.placeholder.com/600x400?text=No+Image+Available"
                      }
                      alt={listing.title}
                      className="rounded-start"
                    />
                  </Col>

                  <Col md={6}>
                    <Card.Body>
                      <h2 className="text-primary mb-3">{listing.title}</h2>
                      <p className="text-muted">
                        <strong>Seller:</strong>{" "}
                        {listing.seller?.username || "Anonymous"}
                      </p>
                      <p className="mb-4">
                        <strong>Description:</strong> {listing.description}
                      </p>
                      <p>
                        <strong>Price:</strong>{" "}
                        <span className="text-success">${listing.price}</span>
                      </p>

                      {/* only render request item if buyer is not same as seller */}
                      {!isSelfRequest && (
                        <div className="mt-4">
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={handleRequestItem}
                          >
                            Request Item
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

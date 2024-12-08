import React from "react";
import { useParams, useNavigate,Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col} from "react-bootstrap";
import { useAuth } from "./Auth";
import { MakeRequest } from "../components/MakeRequest";

const API = import.meta.env.VITE_BACKEND_URL;

export function ListingDetails() {
  //extract postId parameter from URL
  const { user, setUser } = useAuth();
  const { postId } = useParams();
  const [listing, setListing] = useState([]);
  const navigate = useNavigate();
  const [showRequestForm, setShowRequestForm] = useState(false);


  //fetch listing details
  useEffect(() => {
    fetch(`${API}/api/listings/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("This is data", data);
        setListing(data);
      })
      .catch((error) =>
        console.error("error fetching specific listing:", error)
      );
  }, [postId]);

  //check if the buyer is the seller
  const isSelfRequest = user?.id === listing?.seller?._id;


  const handleRequestItem = () => {
    setShowRequestForm(true); 
    if (!user) {
      navigate('/login');
    }
  };
  const handleCancelRequest = () => {
    setShowRequestForm(false);
  };


  return (
    <Container className="mt-4">
      {showRequestForm ? (
        // conditionally render makerequest component
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
                        <strong>Seller:</strong> {listing.seller?.username || "Anonymous"}
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
import React from "react";
import { useParams, useNavigate,Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "./Auth";

const API = import.meta.env.VITE_BACKEND_URL;

export function ListingDetails() {
  //extract postId parameter from URL
  const { user, setUser } = useAuth();
  const { postId } = useParams();
  const [listing, setListing] = useState([]);
  const navigate = useNavigate();

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

  //navigate to make request page if event triggered
  const handleRequestItem = () => {
    //navigate to make request, passing state too
    navigate(`/listings/${listing._id}/make-request`, {
      state: {
        seller: listing.seller,
        buyer: user.id,
        listing: postId,
      },
    });
  };

  return (
    <div>
      <h1>Post ID: {postId}</h1>
      <h2>Title:{listing.title}</h2>
      <p>Description:{listing.description}</p>
      <p>Price: {listing.price}</p>
      <Button variant="primary" onClick={handleRequestItem}>
        Request Item
      </Button>
      <Outlet />

    </div>
  );
}

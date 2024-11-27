import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
const API = import.meta.env.VITE_BACKEND_URL;

export function ListingDetails() {
  //extract postId parameter from URL
  const { postId } = useParams();
  const [listing, setListing] = useState([]);

  useEffect(() => {
    //fetch specific post data from backend
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

  return (
    <div>
      <h1>Post ID: {postId}</h1>
      <h2>Title:{listing.title}</h2>
      <p>Description:{listing.description}</p>
      <p>Price: {listing.price}</p>
    </div>
  );
}

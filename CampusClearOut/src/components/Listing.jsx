import React from "react";
import { Link } from "react-router-dom";

function Listing({ seller,title, description, price, image, link }) {
  const placeholderImage = "https://via.placeholder.com/150?text=No+Image";

  return (
    <div className="listing-card">
      <div className="listing-header">
      <h3 className="listing-title">{title}</h3>
      </div>
      <div className="listing-image-container">
        <img
          src={image || placeholderImage}
          alt={title || "Listing Image"}
          className="listing-image"
        />
      </div>
      <div className="listing-content">
      <p className="listing-seller">Posted by: {seller}</p>
        <p className="listing-description">{description}</p>
        <div className="listing-footer">
          <p className="listing-price">${price}</p>
          <Link to={link} className="listing-button">
            View Listing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Listing;

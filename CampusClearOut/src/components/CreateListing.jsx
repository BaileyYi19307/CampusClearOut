import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

export function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  //handle submitting a listing
  const handleSubmit = async (e) => {
    e.preventDefault();

    const listingData = { title, description, price };
    //post the data to backend
    try {
      const response = await fetch(`${API}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      if (response.ok) {
        console.log("Listing submitted successfully");
        // reset form fields
        setTitle("");
        setDescription("");
        setPrice("");
        // navigate back to "My Listings" page
        navigate("/dashboard/mylistings?created=true");
      } else {
        console.log("Failed to submit listing");
      }
    } catch (error) {
      console.error("Error submitting listing:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle" className="mb-3">
        <Form.Label>Title:</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter the title"
        />
      </Form.Group>

      <Form.Group controlId="formDescription" className="mb-3">
        <Form.Label>Description:</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Enter the description"
        />
      </Form.Group>

      <Form.Group controlId="formPrice" className="mb-3">
        <Form.Label>Price:</Form.Label>
        <Form.Control
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="Enter the price"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit Listing
      </Button>
    </Form>
  );
}

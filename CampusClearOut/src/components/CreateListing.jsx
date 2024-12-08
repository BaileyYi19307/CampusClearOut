import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_BACKEND_URL;

//component for sellers to create a listing with
export function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  //handle submitting a listing
  const handleSubmit = async (e) => {
    //create FormData object to handle both text/file inputs
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    //is there an image, attach to data
    if (image) {
      formData.append("image", image);
    }

    //post the data to backend
    try {
      const response = await fetch(`${API}/api/create-listing`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      //if listing sucessfully saved to database
      if (response.ok) {
        // reset form fields
        setTitle("");
        setDescription("");
        setPrice("");
        setImage(null);

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
    <Container className="mt-5 d-flex justify-content-center">
      <Form onSubmit={handleSubmit}>
        {/* Title Input */}
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

        {/* Description Input */}
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

        {/* Price Input */}
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

        {/* Image Input */}
        <Form.Group controlId="formImage" className="mb-3">
          <Form.Label>Upload Image:</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </Form.Group>

        {/* Button for submitting */}
        <Button variant="primary" onClick={handleSubmit}>
          Submit Listing
        </Button>
      </Form>
    </Container>
  );
}

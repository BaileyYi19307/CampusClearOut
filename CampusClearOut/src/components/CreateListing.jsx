import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

export function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image,setImage]=useState(null);
  const navigate = useNavigate();

  //handle submitting a listing
  const handleSubmit = async (e) => {
    e.preventDefault();

    //create FormData object to handle both text/file inputs
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    //is there an image, attach to data 
    if (image){
      formData.append("image",image);
    }


    //post the data to backend
    try {
      const response = await fetch(`${API}/api/create-listing`, {
        method: "POST",
        body: formData,
        credentials: "include", 
      });

      if (response.ok) {
        console.log("Listing submitted successfully");
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

      <Form.Group controlId="formImage" className="mb-3">
        <Form.Label>Upload Image:</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*" 
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit Listing
      </Button>
    </Form>
  );
}

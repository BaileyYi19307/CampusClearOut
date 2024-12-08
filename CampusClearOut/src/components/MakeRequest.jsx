import React from "react";
import {useRef} from "react";
import { Form, Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_BACKEND_URL;


export function MakeRequest({seller,sellerName,buyer,listing,listingName,onCancel}){
    const meetingDate = useRef();
    const meetingTime = useRef(); 
    const meetingLocation = useRef();
    const navigate = useNavigate();

    //handle form submission 
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const data = {
            listing,
            buyer,
            seller,
            scheduledDate: `${meetingDate.current.value}T${meetingTime.current.value}:00`,
            location: meetingLocation.current.value, 
          };

        try{
            const response = await fetch(`${API}/api/make-request`,{
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(data),
                credentials:"include",
            });
            if (response.ok) {
                console.log("Request successfully made!");
                navigate("/", { state: { message: "Request submitted successfully!" } });
              } else {
                console.error("Failed to submit request:", err);
            }
        }
        catch (error) {
            console.error("Error submitting request:", error);
          }
    };


//make a form 
return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Make a Request</h2>
      <p><strong>Seller:</strong> {sellerName}</p>
      <p><strong>Listing Item:</strong> {listingName}</p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Date of Meetup</Form.Label>
          <Form.Control
            type="date"
            ref={meetingDate}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Time of Meetup</Form.Label>
          <Form.Control type="time" ref={meetingTime} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meetup location"
            ref={meetingLocation}
            required
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        <Button variant="primary" type="submit">
          Submit Request
        </Button>
        </div>
      </Form>
    </div>
  );
}

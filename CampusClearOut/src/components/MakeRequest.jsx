import React from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { useAuth } from "../pages/Auth";
import {useRef} from "react";
import { Form, Button } from "react-bootstrap";
const API = import.meta.env.VITE_BACKEND_URL;


export function MakeRequest(){
    //get state passed via navigate
    const {user, setUser}=useAuth();
    const {state} = useLocation(); 
    const {seller,buyer,listing} = state;
    const navigate=useNavigate();

    const meetingDate = useRef();
    const meetingLocation = useRef();


    //handle form submission 

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const data = {
            listing,
            buyer,
            seller,
            scheduledDate: meetingDate .current.value, 
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
                navigate(`/listings/${listing}`);
              } else {
                console.error("Failed to submit request:", err);
            }
        }
        catch (err) {
            console.error("Error submitting request:", err);
          }
    };


//make a form 
return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Make a Request</h2>
      <p><strong>Seller:</strong> {seller}</p>
      <p><strong>Buyer:</strong> {buyer}</p>
      <p><strong>Listing Item:</strong> {listing}</p>

      {/* Form to input additional required fields */}
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
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meetup location"
            ref={meetingLocation}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Request
        </Button>
      </Form>
    </div>
  );
}

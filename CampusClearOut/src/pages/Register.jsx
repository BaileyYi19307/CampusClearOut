import React, { useState, useEffect } from "react";
import { Form, Button, Alert,InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

export function Register() {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage,setErrorMessage]=useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate=useNavigate();

  //validate the input
  const validateForm = () => {
    if (!username || !emailAddress || !password) {
      setErrorMessage("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setErrorMessage("Invalid email format");
      return false;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return false;
    }
    //clear previous errors
    setErrorMessage("");
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    //check if the form is valid first
    if(!validateForm()){
      return;
    }

    const registrationData = { username, emailAddress, password };
    //send registration data to the backend
    try {
      const response = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
        credentials:"include",
      });

      if (response.ok) {
        navigate("/email-verification", {
          state: { email: emailAddress },
        });
 
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Registration failed. Please try again.");
        console.log("Failed to register:", errorData);
      }
    } catch (error) {
      console.error("Error registering:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="registration-container">
      <h2 className="my-4 text-center">Register</h2>
      {successMessage && (
        <Alert variant="success" className="mt-3">
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your name"
            className="mb-3"
          />
        </Form.Group>

        <Form.Group controlId="emailAddress">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
            placeholder="Enter your email address"
            className="mb-3"
          />
        </Form.Group>

       
        {/* Password input */}
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <InputGroup classname="mb-3">
          <Form.Control
            type={showPassword ? "text" : "password"} //toggle password visibility
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <InputGroup.Text onClick={() => setShowPassword((prev) => !prev)} style={{ cursor: "pointer" }}>
            {showPassword ? "Hide" : "Show"}
          </InputGroup.Text>
          </InputGroup>
        </Form.Group>


        <Button variant="primary" type="submit" className="w-100 mt-4">
          Register
        </Button>
      </Form>
    </div>
  );
}
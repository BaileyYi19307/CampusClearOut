import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

export function Register() {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [users, setUsers] = useState([]);
  const navigate=useNavigate();
   
// fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}/api/users`);
      const userData = await response.json();
      setUsers(userData); // set the fetched users
      console.log("Fetched users:", userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const registrationData = { username, emailAddress, password };

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
        console.log("Successfully registered");
        setShowSuccessMessage("Successfully registered!");
        
        // reset form fields
        setUsername("");
        setEmailAddress("");
        setPassword("");

        //fetch users
        fetchUsers();
        navigate("/login");
 
      } else {
        console.log("Failed to submit registration data");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div>
      {showSuccessMessage && (
        <Alert variant="success" className="mt-3">
          You have successfully registered! Here are the other users:
        </Alert>
      )}

      <h3>Currently Registered Users:</h3>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              Username:{user.username} Email: {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </Form.Group>

        <Form.Group controlId="emailAddress">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            type="text"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
            placeholder="Enter your email address"
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
}
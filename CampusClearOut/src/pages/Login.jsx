import React, { useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./Auth";

const API = import.meta.env.VITE_BACKEND_URL;

export function Login() {
  // access auth context to update user state
  const { user, setUser } = useAuth();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //clear previous error messages
    setErrorMessage(null);

    const loginData = { email: emailAddress, password };

    try {
      // send login request to API
      const response = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        //update auth state with logged-in user
        setUser(data.user);
        
        // navigate to homepage
        navigate("/");
      } else {
        // handle login errors
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("error during login:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="my-4 text-center">Login</h2>

      {/* display error message if login fails */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* email address input */}
        <Form.Group controlId="emailAddress">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
            placeholder="Enter your email"
            className="mb-3"
          />
        </Form.Group>

        {/* password input field */}
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type={showPassword ? "text" : "password"} //toggle password visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <InputGroup.Text
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "Hide" : "Show"}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        {/* submit button */}
        <Button variant="primary" type="submit" className="w-100 mt-4">
          Submit
        </Button>
      </Form>

      {/* registration link */}
      <nav className="mt-3">
        Don't have an account? Register <Link to="/register">here</Link>
      </nav>
    </div>
  );
}

import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Container, Card } from "react-bootstrap";


export function EmailVerificationResult() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  const getMessage = () => {
    switch (status) {
      case "success":
        return {
          message:"Your email has been verified successfully! You can now log in.",
          variant: "success",
        }
      case "alreadyverified":
        return {
          message: "Your email is already verified. Please log in.",
          variant:"info",
        }
      case "notfound":
        return {
          message: "User not found. Please try registering again.",
          variant: "warning",
        }
      case "error":
        return {
          message: "Invalid or expired verification link. Please request a new one.",
          variant:" danger",
        }
      default:
        return {
          message: "An unexpected error occurred.",
          variant:"secondary",
        }
    }
  };

  const { message, variant } = getMessage();

  return (
    <Container className="d-flex justify-content-center mt-5">
    <Card className={`text-center shadow p-4 border border-${variant}`}>
      <Card.Body>
        <Card.Title as="h2" className={`text-${variant} mb-3`}>
          Email Verification
        </Card.Title>
        <Card.Text className="mb-4">{message}</Card.Text>
        <Button
          variant={variant}
          onClick={() => navigate(status === "success" ||"alreadyverified"? "/login" : "/")}
        >
          {status === "success"||"alreadyverified" ? "Go to Login" : "Go to Home"}
        </Button>
      </Card.Body>
    </Card>
  </Container>
);

}

import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export function EmailVerificationResult() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  const getMessage = () => {
    switch (status) {
      case "success":
        return "Your email has been verified successfully! You can now log in.";
      case "alreadyverified":
        return "Your email is already verified. Please log in.";
      case "notfound":
        return "User not found. Please try registering again.";
      case "error":
        return "Invalid or expired verification link. Please request a new one.";
      default:
        return "An unexpected error occurred.";
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{getMessage()}</p>
      <button onClick={() => navigate(status === "success" ? "/login" : "/")}>
        {status === "success" ? "Go to Login" : "Go to Home"}
      </button>
    </div>
  );
}

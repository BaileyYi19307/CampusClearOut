import React from "react";
import { Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export function EmailVerification() {
  const location = useLocation();

  // retrieve the email from the location state, default to "your email" if not provided
  const email = location.state?.email || "your email";

  return (
    <div className="email-verification">
      {/* informational alert to guide the user to verify their email */}
      <Alert variant="info" className="mt-3">
        <h4>Check Your Email</h4>
        <p>
          A verification link has been sent to <strong>{email}</strong>. Please
          check your inbox and click the link to verify your email.
        </p>
        <p>
          If you didn’t receive the email, check your spam folder.
        </p>
      </Alert>
    </div>
  );
}

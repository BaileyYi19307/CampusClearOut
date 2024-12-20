import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Listings } from "./pages/Listings";
import { MyListings } from "./pages/MyListings";
import { MyRequests } from "./pages/MyRequests";
import { CreateListing } from "./components/CreateListing";
import { Register } from "./pages/Register";
import { ListingDetails } from "./pages/ListingDetails";
import { Login } from "./pages/Login";
import { MakeRequest } from "./components/MakeRequest";
import { EmailVerification } from "./pages/EmailVerification";
import { EmailVerificationResult } from "./pages/EmailVerificationResult";
import { Notifications } from "./pages/Notifications";
import MainLayout from "./MainLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./pages/Auth";
import "./App.css";

const API = import.meta.env.VITE_BACKEND_URL;

function App() {
  const { user, setUser } = useAuth();

  return (
    // Router is the root component that enables client-side routing in the app
    <Router>
      {/* mainLayout is a layout wrapper that contains the NavBar and other shared UI elements*/}
      <MainLayout user={user} setUser={setUser}>
        <Routes>
          {/* route for the main Listings page, available at the root path "/" */}
          <Route path="/" element={<Listings />} />

          {/* nested route for accessing a specific listing */}
          <Route path="/listings/:postId" element={<ListingDetails />}>
            <Route path="make-request" element={<MakeRequest />} />
          </Route>

          {/*route for user registration */}
          <Route path="/register" element={<Register />} />

          {/* route for email verification notification and result*/}
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route
            path="/email-verification-result"
            element={<EmailVerificationResult />}
          />

          {/* route to display user notifications */}
          <Route path="/notifications" element={<Notifications />} />

          {/* route for the login page */}
          <Route path="/login" element={<Login />} />

          {/* route for the Dashboard page, accessible at "/dashboard" */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* route for the "My Listings" page, accessible at "/dashboard/mylistings" */}
          <Route path="/dashboard/mylistings" element={<MyListings />} />

          {/* route for creating a new listing, accessible at "/dashboard/mylistings/create" */}
          <Route
            path="/dashboard/mylistings/create"
            element={<CreateListing />}
          />

          {/* route for viewing "My Requests", accessible at "/dashboard/myrequests" */}
          <Route path="/dashboard/myrequests" element={<MyRequests />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth";
import {Table,Button,Tabs,Tab,Container,Breadcrumb} from "react-bootstrap";

const API = import.meta.env.VITE_BACKEND_URL;

export function MyRequests() {
  const { user, setUser } = useAuth();
  const [requests, setRequests] = useState([]);

  //count number of requests with status (i.e. approved, etc)
  const getRequestCount = (status) =>
    requests.filter((request) => request.status === status).length;

  //also want this to rerender if the status of a request changes
  useEffect(() => {
    //check if any user is logged in; if not, return without running
    if (!user) return;

    async function getRequests() {
      try {
        //fetch the requests for the user
        const response = await fetch(`${API}/api/my-requests`, {
          credentials: "include",
        });
        console.log("This is the response", response);
        if (response.ok) {
          const data = await response.json();
          //set state with fetched requests
          setRequests(data);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (err) {
        console.error("Error retrieving requests:", err);
      }
    }
    getRequests();
  }, [user]);

  //handle cancelling a request
  const handleCancelRequest = async (requestId) => {
    console.log("the request id to cancel is", requestId);
    try {
      const response = await fetch(`${API}/api/delete-request/${requestId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Request deleted successfully:", data);

        // update state to remove deleted request
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      } else {
        console.error("Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", err);
    }
  };

  return (
    <Container className="mt-3">
      {/* breadcrumb navigation */}
      <Breadcrumb>
        <Breadcrumb.Item
          className="mt-3"
          linkAs={Link}
          linkProps={{ to: "/dashboard" }}
        >
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item className="mt-3" active>
          My Listings
        </Breadcrumb.Item>
      </Breadcrumb>
      <h2 className="mb-4">My Requests</h2>

      {/* tabs for organizing requests by their status */}
      <Tabs defaultActiveKey="pending" id="request-tabs" className="mb-3">
        {["Pending", "Approved", "Denied"].map((status) => (
          <Tab
            eventKey={status.toLowerCase()}
            title={`${status} Requests (${getRequestCount(status)})`}
            key={status}
          >
            {/* table displaying requests for the current status */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests
                  .filter((request) => request.status === status) //filter request by status
                  .map((request, index) => (
                    <tr key={request._id}>
                      <td>{index + 1}</td>
                      <td>{request.listing.title}</td>
                      <td>
                        {new Date(request.scheduledDate).toLocaleString()}
                      </td>
                      <td>{request.location}</td>
                      <td>
                        {status === "Pending" && (
                          <>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleCancelRequest(request._id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {["Approved", "Denied"].includes(status) && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCancelRequest(request._id)}
                          >
                            Erase Request
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Button, Tabs, Tab, Table} from "react-bootstrap";

const API = import.meta.env.VITE_BACKEND_URL;

export function MyListings() {
  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("listings");
  const [searchParams] = useSearchParams();
  const [approvedRequests,setApprovedRequests]=useState([]);
  const isCreated = searchParams.get("created") === "true";

  // retrieve all my listings
  useEffect(() => {
    fetch(`${API}/api/my-listings`, {
      credentials: "include", 
    })
      .then((response) => response.json())
      .then((listingData) => {
        setMyListings(listingData);
        console.log("This is the listing data", listingData);
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, []);


  // retrieve incoming requests
  useEffect(() => {
    fetch(`${API}/api/incoming-requests`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("These are the incoming requests",data);
        
      // filter out approved requests
      const filteredData = data.filter((request) => request.status !== "Approved");

      const formattedData = filteredData.map((request) => ({
        id: request._id,
        listing: request.listing.title,
        location: request.location,
        scheduledDate: request.scheduledDate,
        status: request.status,
        buyer: request.buyer.username,
        sellerUsername: request.seller.username,
        createdAt: request.createdAt,
      }));
        setIncomingRequests(formattedData)})
      .catch((error) => console.error("Error fetching requests:", error));
  }, [approvedRequests]);


  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const response = await fetch(`${API}/api/approved-requests`, {
          credentials: "include",
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("fetching all approved requests....",data);
          const formattedData = data.map((request) => ({
            id: request._id,
            listing: request.listing.title,
            location: request.location,
            scheduledDate: request.scheduledDate,
            status: request.status,
            buyer: request.buyer.username,
            sellerUsername: request.seller.username,
            createdAt: request.createdAt,
          }));
          setApprovedRequests(formattedData);
        } else {
          console.error("Failed to fetch approved requests");
        }
      } catch (error) {
        console.error("Error fetching approved requests:", error);
      }
    };
  
    fetchApprovedRequests(); 
  }, []);
  

  // handle deleting a listing
  const handleDelete = async (listingId) => {
    try {
      const response = await fetch(`${API}/api/listings/${listingId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // filter out deleted listing
        setMyListings(
          myListings.filter((listing) => listing._id !== listingId)
        );
        console.log("Listing deleted successfully");
      } else {
        console.error("Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  // //approve a request
  // useEffect();
  const approveRequest = async (requestId) =>{
    try{
      const response = await fetch(`${API}/api/approve-request/${requestId}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });
      if (response.ok){
        const data = await response.json();
        console.log("here is the data for approving the request",data);
        setApprovedRequests((prev) => [...prev, data]);
      }
    }
    catch(error){

    };
  };

  // //deny a request
  // useEffect();

  const denyRequest = async(requestId)=>{
    try{
      const response = await fetch(`${API}/api/delete-request/${requestId}`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });
      if (response.ok){
        console.log("This is the response");
        // remove the denied request from the state
        setIncomingRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      }
    }
    catch(error){
    }
  }



  return (
    <Container>
      <h2 className="my-4 text-center">My Listings & Requests</h2>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="listings" title={`My Active Listings (${myListings.length})`}>
          <Button variant="primary" as={Link} to={"/dashboard/mylistings/create"}>
            Create New Listing
          </Button>
          <Row className="listing-grid mt-3">
            {myListings.length > 0 ? (
              myListings.map((listing) => (
                <Col key={listing._id} sm={6} md={4} lg={3} className="mb-4">
                  <div className="listing-card p-3 border rounded">
                    <h4>{listing.title}</h4>
                    <p>{listing.description}</p>
                    <p>
                      <strong>Price:</strong> ${listing.price}
                    </p>
                    <Button
                      variant="primary"
                      as={Link}
                      to={`/listings/${listing._id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(listing._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Col>
              ))
            ) : (
              <p>You have no listings yet.</p>
            )}
          </Row>
        </Tab>
        <Tab eventKey="requests" title={`Pending Requests to Review (${incomingRequests.length})`}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Requestor</th>
                <th>Listing</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomingRequests.length > 0 ? (
                incomingRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{index + 1}</td>
                    <td>{request.buyer}</td>
                    <td>{request.listing}</td>
                    <td>{request.scheduledDate}</td>
                    <td>{request.status}</td>
                    <td>
                      <Button onClick={()=>approveRequest(request.id)} variant="success" size="sm">
                        Approve
                      </Button>
                      <Button onClick={()=> denyRequest(request.id)} variant="danger" size="sm" className="ms-2">
                        Decline
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No incoming requests.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Tab>

      <Tab eventKey="approved" title={`Requests I've Approved (${approvedRequests.length})`}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Requestor</th>
              <th>Listing</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.length > 0 ? (
              approvedRequests.map((approvedRequest, index) => (
                <tr key={approvedRequest.id}>
                  <td>{approvedRequest + 1}</td>
                  <td>{approvedRequest.buyer}</td>
                  <td>{approvedRequest.listing}</td>
                  <td>{approvedRequest.scheduledDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No approved requests.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Tab>
    </Tabs>
    </Container>
  );
}
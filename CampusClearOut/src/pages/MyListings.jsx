import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Button, Tabs, Tab, Table, Breadcrumb} from "react-bootstrap";

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
      const filteredData = data.filter((request) => request.status === "Pending");

      const formattedData = filteredData.map((request) => ({
        id: request._id,
        listing: request.listing,
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
            listing: request.listing,
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
        
        // update listing's status to "On Hold" for my active listings tab
        setMyListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === data.listing._id ? { ...listing, status: "On Hold" } : listing
          )
        );
      }
    }
    catch(error){

    };
  };

  //deny a request
  const denyRequest = async(requestId)=>{
    console.log("This is the requestId",requestId);
    try{
      const response = await fetch(`${API}/api/deny-request/${requestId}`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });
      if (response.ok){
        const data = await response.json();
        console.log("This is the response",data);

      // remove the denied request from both states
      setIncomingRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );

        setApprovedRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );

        // update the listing's status back to "Available"
        setMyListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === data.listing._id ? { ...listing, status: "Available" } : listing
          )
        );
      }
    }
    catch(error){
    }
  }




  return (
    <Container className="mt-3">
       <Breadcrumb>
        <Breadcrumb.Item className="mt-3" linkAs={Link} linkProps={{ to: "/dashboard" }}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item className="mt-3" active>My Listings</Breadcrumb.Item>
      </Breadcrumb>
      <h2 className="my-4">My Listings</h2>
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
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4>{listing.title}</h4>
                        <span className={`badge ${
                          listing.status === "Available" ? "bg-success" : "bg-warning"
                        }`}>
                          {listing.status}
                        </span>
                    </div>
                  <img
                      src={
                        listing.images && listing.images.length > 0
                          ? listing.images[0]
                          : "https://via.placeholder.com/600x400?text=No+Image+Available"
                      }
                      alt={listing.title}
                      className="img-fluid mb-3 rounded"
                    />
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
                    <td>{request.listing.title}</td>
                    <td>{new Date(request.scheduledDate).toLocaleString()}</td>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.length > 0 ? (
              approvedRequests.map((approvedRequest, index) => (
                <tr key={approvedRequest.id}>
                  <td>{index+1}</td>
                  <td>{approvedRequest.buyer}</td>
                  <td>{approvedRequest.listing.title}</td>
                  <td>{new Date(approvedRequest.scheduledDate).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => denyRequest(approvedRequest.id)}
                    >
                      Cancel
                    </Button>
                  </td>
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
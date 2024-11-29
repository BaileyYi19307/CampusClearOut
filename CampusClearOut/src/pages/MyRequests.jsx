import React from "react";
import { useEffect,useState } from "react";
import { useAuth } from "./Auth";
import { Table, Button, Card, Container, Row, Col } from "react-bootstrap";

const API = import.meta.env.VITE_BACKEND_URL;


export function MyRequests() {
  const {user,setUser} = useAuth();
  const [requests, setRequests] = useState([]);


  //also want this to re render if the status of a request changes
  useEffect(()=>{
    //check if any user is logged in; if not, return without running
    if (!user) return; 

    async function getRequests(){
      try{
        //fetch the requests for the user
        const response = await fetch(`${API}/api/my-requests`,{
          credentials: "include",
        });
        console.log("This is the response", response)
        if (response.ok){
          const data = await response.json();
          console.log("This is the data",data);
          setRequests(data);
        }
        else{
          console.error("Failed to fetch requests");
        }
      }
      catch(err){
        console.error("Error retrieving requests:", err);
      }
    }
    getRequests();
  },[user])

  //who's the user? 
  //Fetch the buyer's requests in the My Requests Page and display their status.
  



  return (
    <Container className="mt-5">
      <h2 className="mb-4">My Requests</h2>
      {requests.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{request.listing}</td>
                  <td>{request.scheduledDate}</td>
                  <td>{request.location}</td>
                  <td>{request.status}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(request.id, "Completed")
                      }
                    >
                      Mark Completed
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="mt-4">
            {requests.map((request) => (
              <Col key={request.id} sm={12} md={6} lg={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{request.itemName}</Card.Title>
                    <Card.Text>
                      <strong>Date:</strong> {request.scheduledDate}
                      <br />
                      <strong>Location:</strong> {request.location}
                      <br />
                      <strong>Status:</strong> {request.status}
                    </Card.Text>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(request.id, "Cancelled")
                      }
                    >
                      Cancel Request
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <p>No requests found</p>
      )}
    </Container>
  );
}


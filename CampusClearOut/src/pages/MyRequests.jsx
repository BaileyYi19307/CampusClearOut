import React from "react";
import { useEffect,useState } from "react";
import { useAuth } from "./Auth";
import { Table, Button,Tabs,Tab, Container} from "react-bootstrap";

const API = import.meta.env.VITE_BACKEND_URL;


export function MyRequests() {
  const {user,setUser} = useAuth();
  const [requests, setRequests] = useState([]);

  //count number of requests with status (i.e. approved, etc)
  const getRequestCount = (status) =>
    requests.filter((request) => request.status === status).length;


  //also want this to rerender if the status of a request changes
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
  

  return (
    <Container className="mt-5">
      <h2 className="mb-4">My Requests</h2>
      <Tabs defaultActiveKey="pending" id="request-tabs" className="mb-3">
        {["Pending", "Approved", "Denied"].map((status) => (
          <Tab eventKey={status.toLowerCase()}title={`${status} Requests (${getRequestCount(status)})`}
          key={status}>
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
                  .filter((request) => request.status === status)
                  .map((request, index) => (
                    <tr key={request.id}>
                      <td>{index + 1}</td>
                      <td>{request.listing.title}</td>
                      <td>{new Date(request.scheduledDate).toLocaleString()}</td>
                      <td>{request.location}</td>
                      <td>
                        {status === "Pending" && (
                          <>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(request.id, "Cancelled")
                              }
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {status === "Approved" && (
                          <Button variant="info" size="sm">
                            View Details
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


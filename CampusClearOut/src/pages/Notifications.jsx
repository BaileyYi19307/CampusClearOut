import React, { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button, ListGroup, Container, Card } from "react-bootstrap";

const API = import.meta.env.VITE_BACKEND_URL;

export const Notifications = () => {
  const { user, socket } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // fetch notifications on initial mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          console.log("THE USER ID HERE IS",user.id);
          const response = await fetch(`${API}/api/notifications?userId=${user.id}`);
          const data = await response.json();

          // update state with fetched notifications
          setNotifications(data);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  // handle real-time notifications
  useEffect(() => {
    if (socket) {
      //listen for notification event - update notifications with new one
      socket.on("notification", (data) => {
        setNotifications((prev) => [data, ...prev]);
      });

      return () => {
        // cleanup socket listener on unmount
        socket.off("notification");
      };
    }
  }, [socket]);

  return (
    <Container className="mt-5">
      {/* card to display notifications */}
      <Card>
        <Card.Header as="h4" className="text-primary">
          Notifications
        </Card.Header>
        <ListGroup variant="flush">
          {/* if there are no notifications, show a placeholder message */}
          {notifications.length === 0 ? (
            <ListGroup.Item>No new notifications</ListGroup.Item>
          ) : (

            /* iterate over notifications and display each one */
            notifications.map((notif, index) => (
              <ListGroup.Item key={index}>
                <span className="text-muted small">
                  {notif.timestamp || "Just now"}
                </span>
                <p className="mb-0">{notif.message}</p>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
        <Card.Footer></Card.Footer>
      </Card>
    </Container>
  );
};

// notification dropdown component
export const NotificationDropdown = () => {
  const { user, socket } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await fetch(`${API}/api/notifications?userId=${user.id}`);
          const data = await response.json();

          // update state with fetched notifications
          setNotifications(data);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  // handle real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on("notification", (data) => {
        // prepend new notification
        setNotifications((prev) => [data, ...prev]);
      });

      return () => {
        // cleanup socket listener on unmount
        socket.off("notification");
      };
    }
  }, [socket]);

  // navigate to the notifications page
  const handleShowAll = () => {
    navigate("/notifications");
  };

  return (
    <Dropdown align="end">
      {/* dropdown toggle button for accessing notifications */}
      <Dropdown.Toggle variant="primary" id="dropdown-notifications">
        Notifications
      </Dropdown.Toggle>

      {/* dropdown menu to display notifications */}
      <Dropdown.Menu
        style={{ minWidth: "300px", maxHeight: "400px", overflowY: "auto" }}
      >
        {notifications.length === 0 ? (
          <Dropdown.Item disabled>No new notifications</Dropdown.Item>
        ) : (
          /* display the latest 7 notifications */
          notifications.slice(0, 7).map((notif) => (
            <Dropdown.Item key={notif._id}>
              <p>{notif.message}</p>
            </Dropdown.Item>
          ))
        )}

        {/* divider and button to navigate to the full notifications page */}
        <Dropdown.Divider />
        <Button variant="link" onClick={handleShowAll} className="w-100">
          Show All
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  );
};

import React, { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button } from "react-bootstrap";

export const Notifications = () => {
  const { user, socket } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // fetch notifications on initial mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/notifications?userId=${user.id}`);
          const data = await response.json();
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
        socket.off("notification");
      };
    }
  }, [socket]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
};
export const NotificationDropdown = () => {
    const { user, socket } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchNotifications = async () => {
        if (user) {
          try {
            const response = await fetch(`/api/notifications?userId=${user.id}`);
            const data = await response.json();
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
          setNotifications((prev) => [data, ...prev]);  
        });
  
        return () => {
          socket.off("notification");
        };
      }
    }, [socket]);
  
    const handleShowAll = () => {
      navigate("/notifications");
    };
  
    return (
      <Dropdown align="end">
        <Dropdown.Toggle variant="primary" id="dropdown-notifications">
          Notifications
        </Dropdown.Toggle>
  
        <Dropdown.Menu style={{ minWidth: "300px", maxHeight: "400px", overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Dropdown.Item disabled>No new notifications</Dropdown.Item>
          ) : (
            notifications.slice(0, 7).map((notif) => (
              <Dropdown.Item key={notif._id}>
                <p>{notif.message}</p>
              </Dropdown.Item>
            ))
          )}
          <Dropdown.Divider />
          <Button variant="link" onClick={handleShowAll} className="w-100">
            Show All
          </Button>
        </Dropdown.Menu>
      </Dropdown>
    );
  };
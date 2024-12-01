import React, { useState, useEffect } from "react";
import { useAuth } from "./Auth";


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

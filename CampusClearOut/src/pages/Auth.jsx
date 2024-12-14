import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const API = import.meta.env.VITE_BACKEND_URL;

//create global state shared between multiple components
const AuthContext = createContext();

//hook to access AuthContext easily
export const useAuth = () => {
  return useContext(AuthContext);
};

// component to wrap the app and provide global state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  //fetch and print current user session
  useEffect(() => {
    const fetchCurrentUser = async () => {
      console.log("fetchCurrentUser called");
      try {
        // fetch current user session from the backend
        const response = await fetch(`${API}/api/current-user`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          //update state with user info
          setUser(data.user);
        } else {
          //clear user state if session is invalid
          setUser(null);
          console.log("User not logged in or session expired.");
        }
      } catch (err) {
        //clear user state on error
        setUser(null);
        console.error("Error fetching current user:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  // initialize Socket.IO connection when user logs in
  useEffect(() => {
    if (user) {
      // only connect the socket when user exists
      const newSocket = io(API);
      console.log("Socket initialized for user:", user.id);

      // link user with the backend via socket
      newSocket.emit("connectUser", user.id);
      setSocket(newSocket);

      // cleanup socket on logout or unmount
      return () => {
        console.log("Socket disconnected for user:", user.id);
        newSocket.disconnect();
      };
    }
  }, [user]);

  //provide global state to child components
  return (
    <AuthContext.Provider value={{ user, setUser, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

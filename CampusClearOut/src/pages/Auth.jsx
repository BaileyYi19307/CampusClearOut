import React, { createContext, useContext, useState, useEffect } from "react";
const API = import.meta.env.VITE_BACKEND_URL;

//create global state shared between multiple components
const AuthContext = createContext();

//hook to access AuthContext easily

export const useAuth = () => {
    return useContext(AuthContext);
}

// component to wrap the app and provide global state
export const AuthProvider = ({children}) =>{
    const [user,setUser]=useState(null);

  //fetch and print current user session 
  useEffect(() => {
    console.log("useEffect running in App"); 
    const fetchCurrentUser = async () => {
      console.log("fetchCurrentUser called");
      try {
        const response = await fetch(`${API}/api/current-user`, {
          credentials: "include", 
        });

      console.log("Raw response:", response);

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          console.log("Fetched current user:", data.user); 
          setUser(data.user);
        } else {
          
        console.log("Raw response:", response);
        setUser(null); 

          console.log("User not logged in or session expired.");
        }
      } catch (err) {
        setUser(null); 

        console.error("Error fetching current user:", err); 
      }
    };

    fetchCurrentUser();
  }, []);


  return <AuthContext.Provider value={{user,setUser}}>{children}</AuthContext.Provider>
}
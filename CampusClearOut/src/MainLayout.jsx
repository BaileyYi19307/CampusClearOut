import React from "react";
import { NavBar } from "./components/NavBar";

const MainLayout = ({ children,user,setUser}) => {
  return (
    <>
      <NavBar/>
      <div>{children}</div>
    </>
  );
};

export default MainLayout;

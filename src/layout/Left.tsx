import React from "react";
import Navbar from "../components/navbar/Navbar";

interface LeftProps {}

const Left: React.FC<LeftProps> = ({ children }) => {
  return (
    <div className="container_grid container_grid_left">
      <Navbar />
      {children}
    </div>
  );
};

export default Left;

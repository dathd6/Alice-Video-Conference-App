import React from "react";
import SideNavbar from "../components/navbar/SideNavbar";

interface RightProps {}

const Right: React.FC<RightProps> = ({ children }) => {
  return (
    <div className="container_grid container_grid_right">
      <SideNavbar />
      {children}
    </div>
  );
};

export default Right;

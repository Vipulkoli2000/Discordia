import React from "react";
import { Outlet } from "react-router-dom";

const LayoutWrapper = () => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Outlet />
    </div>
  );
};

export default LayoutWrapper;

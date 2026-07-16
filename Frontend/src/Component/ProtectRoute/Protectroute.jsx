import React from "react";
import { Navigate } from "react-router-dom";

/** Admin-only guard. Students keep using /dashboard. */
const ProtectRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/adminlogin" replace />;
  }

  // If a student token is present without admin role, send them to student portal
  if (role && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectRoute;

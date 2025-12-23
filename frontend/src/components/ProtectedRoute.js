import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const workerToken = localStorage.getItem("workerToken");
  const employerToken = localStorage.getItem("employerToken");

  // Worker trying to access worker pages
  if (role === "worker") {
    if (!workerToken) return <Navigate to="/worker-login" />;
    return children;
  }

  // Employer trying to access employer pages
  if (role === "employer") {
    if (!employerToken) return <Navigate to="/employer-login" />;
    return children;
  }

  // Default fallback
  return <Navigate to="/" />;
}

export default ProtectedRoute;


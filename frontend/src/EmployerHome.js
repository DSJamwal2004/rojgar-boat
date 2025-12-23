import React from "react";
import { Link } from "react-router-dom";

function EmployerHome() {
  const token = localStorage.getItem("employerToken");

  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold mb-4">Employer Portal</h2>

      {!token ? (
        <div className="space-y-4 max-w-xs mx-auto">
          <Link to="/employer-login" className="block bg-green-600 text-white py-2 rounded">
            Login
          </Link>

          <Link to="/employer-register" className="block bg-gray-200 text-gray-800 py-2 rounded">
            Register
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-xs mx-auto">
          <Link to="/employer" className="block bg-blue-600 text-white py-2 rounded">
            Go to Employer Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default EmployerHome;






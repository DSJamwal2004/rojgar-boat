import React from "react";
import { Link } from "react-router-dom";

function WorkerHome() {
  const token = localStorage.getItem("workerToken");

  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold mb-4">Worker Portal</h2>

      {!token ? (
        <div className="space-y-4 max-w-xs mx-auto">
          <Link to="/worker-login" className="block bg-blue-600 text-white py-2 rounded">
            Login
          </Link>

          <Link to="/worker-register" className="block bg-gray-200 text-gray-800 py-2 rounded">
            Register
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-xs mx-auto">
          <Link to="/worker" className="block bg-green-600 text-white py-2 rounded">
            Go to Worker Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default WorkerHome;






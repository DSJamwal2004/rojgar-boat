import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";
import { apiFetch } from "./api";

function WorkerLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("workerToken")) {
      navigate("/worker");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setMessage("");

    try {
      const data = await apiFetch("/api/auth/worker/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      });

      localStorage.setItem("workerToken", data.token);
      localStorage.setItem("workerId", data.workerId);

      navigate("/worker");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-3xl px-8 py-10 border">
        <h2 className="text-3xl font-extrabold text-center mb-2">
          Worker Login
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Enter your phone number and password to access your dashboard.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-right">
            <Link
              to="/worker/forgot-password"
              className="text-sm text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>

          {message && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          <p className="mt-6 text-center text-gray-700 text-sm">
            New user?{" "}
            <Link
              to="/worker-register"
              className="text-blue-700 font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </OceanLayout>
  );
}

export default WorkerLogin;










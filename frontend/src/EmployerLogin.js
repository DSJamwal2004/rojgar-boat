import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";

function EmployerLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("employerToken")) {
      navigate("/employer");
    }
  }, [navigate]);

  const handleLogin = async () => {
    const res = await fetch("/api/auth/employer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });

    const data = await res.json();

    if (data.error) {
      setMessage(data.error);
      return;
    }

    localStorage.setItem("employerToken", data.token);
    localStorage.setItem("employerId", data.employerId);

    navigate("/employer");
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-3xl px-8 py-10 border">
        <h2 className="text-3xl font-extrabold text-center mb-2">
          Employer Login
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Login to post jobs and manage your applications.
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
              placeholder="Enter phone number"
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
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
              placeholder="Enter password"
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 🔐 Forgot password link */}
          <div className="text-right">
            <Link
              to="/employer/forgot-password"
              className="text-sm text-green-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>

          {message && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          <p className="mt-6 text-center text-gray-700 text-sm">
            New employer?{" "}
            <Link
              to="/employer-register"
              className="text-green-700 font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </OceanLayout>
  );
}

export default EmployerLogin;








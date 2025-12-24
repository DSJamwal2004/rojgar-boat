import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";
import { apiFetch } from "./api";

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
    setMessage("");

    try {
      const data = await apiFetch("/api/auth/employer/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      });

      localStorage.setItem("employerToken", data.token);
      localStorage.setItem("employerId", data.employerId);

      navigate("/employer");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-3xl px-8 py-10 border">
        <h2 className="text-3xl font-extrabold text-center mb-2">
          Employer Login
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Login to post jobs and manage applications.
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
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="text-right">
            <Link
              to="/employer/forgot-password"
              className="text-sm text-green-600 hover:underline"
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
              className="text-green-600 font-semibold hover:underline"
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









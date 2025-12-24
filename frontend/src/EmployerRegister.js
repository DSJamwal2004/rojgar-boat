import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";
import API_BASE from "./api"; // ✅ backend base URL

function EmployerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.password || form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      organization: form.organization,
      location: form.location,
      password: form.password,
    };

    try {
      const res = await fetch(`${API_BASE}/api/employers/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Registration failed");
      }

      setMessage("Registration successful! You can now log in.");
      setTimeout(() => navigate("/employer-login"), 800);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md shadow-xl rounded-3xl px-8 py-10 border">
        <h2 className="text-3xl font-extrabold text-center mb-2">
          Employer Registration
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Register to post jobs and manage your applicants.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Shop / Organization
            </label>
            <input
              name="organization"
              value={form.organization}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Location (village / area)
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Register
            </button>
          </div>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-red-500">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-700 text-sm">
          Already registered?{" "}
          <Link
            to="/employer-login"
            className="text-green-700 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </OceanLayout>
  );
}

export default EmployerRegister;








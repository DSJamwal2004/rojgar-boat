import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";

/* ✅ ADD THIS (safe for local + Vercel) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function WorkerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    skills: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ type: "Point", coordinates: [longitude, latitude] });
        setMessage("Location captured successfully!");
      },
      () => setMessage("Failed to get location.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!coords) {
      setMessage("Please click 'Use My Location' to capture GPS coordinates.");
      return;
    }

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
      age: form.age,
      gender: form.gender,
      skills: form.skills,
      phone: form.phone,
      location: form.location,
      locationCoords: coords,
      password: form.password,
    };

    try {
      /* ✅ ONLY THIS LINE IS CHANGED */
      const res = await fetch(`${API_BASE}/api/workers/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registration failed");
      }

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        return;
      }

      setMessage("Registration successful! You can now log in.");
      setTimeout(() => navigate("/worker-login"), 800);
    } catch (err) {
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md shadow-xl rounded-3xl px-8 py-10 border">
        <h2 className="text-3xl font-extrabold text-center mb-2">
          Worker Registration
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Create your profile so nearby employers can find you.
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
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Skills */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Skills (comma separated)
            </label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Electrician, Shop helper, Sweeper..."
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
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleUseLocation}
              className="mt-3 inline-flex items-center px-4 py-1.5 text-sm rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
            >
              Use My Location
            </button>
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
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
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
            to="/worker-login"
            className="text-blue-700 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </OceanLayout>
  );
}

export default WorkerRegister;












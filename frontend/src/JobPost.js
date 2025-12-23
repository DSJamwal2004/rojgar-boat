import React, { useState, useEffect } from "react";
import OceanLayout from "./components/OceanLayout";

function JobPost() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    salary: "",
    location: "",
  });

  const [posting, setPosting] = useState(false);

  // 🔐 Check employer login
  useEffect(() => {
    const token = localStorage.getItem("employerToken");
    if (!token) {
      alert("You must log in as Employer before posting a job.");
      window.location.href = "/employer-login";
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📤 Submit Job (GPS fetched LIVE here)
  const handleSubmit = async () => {
    const token = localStorage.getItem("employerToken");
    if (!token) {
      alert("You must login first!");
      return;
    }

    if (posting) return;
    setPosting(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const payload = {
            ...form,
            skillsRequired: form.skillsRequired
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          const res = await fetch("/api/jobs/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          const data = await res.json();

          if (data.error) {
            alert(data.error);
          } else {
            alert("Job posted successfully!");
            setForm({
              title: "",
              description: "",
              skillsRequired: "",
              salary: "",
              location: "",
            });
          }
        } catch (err) {
          alert("Failed to post job.");
        } finally {
          setPosting(false);
        }
      },
      () => {
        alert("Please allow location access to post a job.");
        setPosting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-900">
          Post a Job
        </h2>

        <p className="text-center text-gray-600 mb-8 text-sm">
          Create a job post so nearby workers can apply instantly.
        </p>

        <div className="space-y-4">
          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500 h-28"
          />

          <input
            name="skillsRequired"
            placeholder="Skills Required (comma separated)"
            value={form.skillsRequired}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
          />

          <input
            name="salary"
            placeholder="Salary (₹)"
            value={form.salary}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
          />

          <input
            name="location"
            placeholder="Job Location (City)"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={handleSubmit}
            disabled={posting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {posting ? "Posting job..." : "Submit Job"}
          </button>
        </div>
      </div>
    </OceanLayout>
  );
}

export default JobPost;











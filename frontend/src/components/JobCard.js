import React from "react";

/* ✅ BACKEND BASE (Render) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function JobCard({ job }) {
  const token = localStorage.getItem("workerToken");

  const handleApply = async () => {
    if (!token) {
      alert("Please login as a worker before applying.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/applications/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ jobId: job._id }),
      });

      const text = await res.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to apply for job");
      }

      alert(data?.message || "Applied successfully!");
    } catch (err) {
      alert(err.message || "Something went wrong while applying.");
    }
  };

  return (
    <div className="border rounded-2xl shadow-sm hover:shadow-md transition bg-white p-6">
      <h3 className="text-xl font-extrabold text-gray-900 mb-1">
        {job.title}
      </h3>

      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
        {job.description}
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
        <p>
          <span className="font-semibold">📍 Location:</span>{" "}
          {job.location}
        </p>
        <p>
          <span className="font-semibold">💰 Salary:</span> ₹{job.salary}
        </p>
      </div>

      {job.skillsRequired?.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold">🛠 Skills:</span>{" "}
          {job.skillsRequired.join(", ")}
        </p>
      )}

      {/* ✅ Distance display (meters → km) */}
      {typeof job.distance === "number" && (
        <p className="mt-2 text-sm text-blue-600 font-medium">
          <strong>Distance:</strong>{" "}
          {(job.distance / 1000).toFixed(1)} km away
        </p>
      )}

      <button
        onClick={handleApply}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition"
      >
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;






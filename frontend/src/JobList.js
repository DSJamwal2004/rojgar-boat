import React, { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import OceanLayout from "./components/OceanLayout";
import BoatLoader from "./components/BoatLoader";

/* ✅ BACKEND BASE (Render) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs`);

        const text = await res.text();
        let data = null;

        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch jobs");
        }

        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        setMessage(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* 🕒 Job freshness helper */
  const getFreshness = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 5) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)} hours ago`;
    if (mins < 2880) return "Yesterday";
    return `${Math.floor(mins / 1440)} days ago`;
  };

  /* 🔀 Sorting logic */
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "salary") {
      return (b.salary || 0) - (a.salary || 0);
    }
    return 0;
  });

  return (
    <OceanLayout>
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold text-center md:text-left">
            All Jobs
          </h2>

          {/* 🔀 Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-4 md:mt-0 border rounded-xl px-4 py-2 text-sm font-semibold bg-white shadow-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="salary">Highest salary</option>
          </select>
        </div>

        {loading && <BoatLoader label="Fetching jobs..." />}

        {!loading && message && (
          <p className="text-center text-red-500">{message}</p>
        )}

        {!loading && !message && sortedJobs.length === 0 && (
          <p className="text-center text-gray-500">
            No jobs available at the moment.
          </p>
        )}

        {!loading && sortedJobs.length > 0 && (
          <div className="grid gap-8">
            {sortedJobs.map((job) => (
              <div key={job._id}>
                {/* 🕒 Posted time */}
                <div className="flex justify-end text-sm text-gray-500 mb-2">
                  <span>🕒 {getFreshness(job.createdAt)}</span>
                </div>

                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </OceanLayout>
  );
}

export default JobList;









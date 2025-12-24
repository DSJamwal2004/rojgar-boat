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

  /* 🕒 Job freshness helper (same as GPS) */
  const getFreshness = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 5) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)} hours ago`;
    if (mins < 2880) return "Yesterday";
    return `${Math.floor(mins / 1440)} days ago`;
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          All Jobs
        </h2>

        {loading && <BoatLoader label="Fetching jobs..." />}

        {!loading && message && (
          <p className="text-center text-red-500">{message}</p>
        )}

        {!loading && !message && jobs.length === 0 && (
          <p className="text-center text-gray-500">
            No jobs available at the moment.
          </p>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid gap-8">
            {jobs.map((job) => (
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








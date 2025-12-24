import React, { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import OceanLayout from "./components/OceanLayout";
import BoatLoader from "./components/BoatLoader";

/* ✅ BACKEND BASE (Render) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function AIRecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("ai");

  useEffect(() => {
    // 🔒 Reset AI match count on page load
    localStorage.setItem("aiMatchesCount", "0");

    const token = localStorage.getItem("workerToken");
    if (!token) {
      setMessage("You must login first.");
      setLoading(false);
      return;
    }

    const fetchAIJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/recommend/ai`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const text = await res.text();
        let data = null;

        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          throw new Error(
            data?.error || data?.message || "Failed to fetch AI jobs"
          );
        }

        if (Array.isArray(data)) {
          setJobs(data);
          localStorage.setItem("aiMatchesCount", String(data.length));
        } else {
          setMessage(data?.error || data?.message || "No AI recommendations.");
          localStorage.setItem("aiMatchesCount", "0");
        }
      } catch (err) {
        setMessage(err.message || "Failed to fetch AI recommended jobs.");
        localStorage.setItem("aiMatchesCount", "0");
      } finally {
        setLoading(false);
      }
    };

    fetchAIJobs();
  }, []);

  /* 🧠 AI explanation */
  const getAIExplanation = (job) => {
    if (job.matchedSkills && job.matchedSkills.length > 0) {
      return `Matched skills: ${job.matchedSkills.join(", ")}`;
    }
    if (job.skillsRequired && job.skillsRequired.length > 0) {
      return `Relevant to your skills: ${job.skillsRequired
        .slice(0, 3)
        .join(", ")}`;
    }
    return "Matched based on your profile and experience";
  };

  /* 🧠 AI strength label */
  const getAIStrength = (score = 0) => {
    if (score >= 80) return "Excellent match";
    if (score >= 60) return "Good match";
    if (score >= 40) return "Fair match";
    return "Low match";
  };

  /* 🕒 Job freshness */
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
    if (sortBy === "ai") {
      return (b.aiScore || 0) - (a.aiScore || 0);
    }
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-center md:text-left text-gray-900">
            AI Recommended Jobs
          </h2>

          {/* 🔀 Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-4 md:mt-0 border rounded-xl px-4 py-2 text-sm font-semibold bg-white shadow-sm"
          >
            <option value="ai">Best AI match</option>
            <option value="newest">Newest first</option>
            <option value="salary">Highest salary</option>
          </select>
        </div>

        <p className="text-center text-gray-600 mb-8 text-sm">
          Jobs matched using your skills, experience, and profile.
        </p>

        {loading && <BoatLoader label="AI is matching jobs for you..." />}

        {!loading && message && (
          <p className="text-center text-red-500 mb-6">{message}</p>
        )}

        {!loading && sortedJobs.length === 0 && !message && (
          <p className="text-center text-gray-500">
            No AI recommendations available yet.
          </p>
        )}

        {!loading && sortedJobs.length > 0 && (
          <div className="grid gap-8">
            {sortedJobs.map((job) => (
              <div key={job._id}>
                {/* 🕒 Posted time */}
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>🕒 {getFreshness(job.createdAt)}</span>
                </div>

                {/* 🤖 AI Meta */}
                <div className="mb-3 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-200">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <p className="text-sm font-semibold text-indigo-700">
                      🤖 AI Recommendation
                    </p>

                    {typeof job.aiScore === "number" && (
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-600 text-white">
                        {job.aiScore}% · {getAIStrength(job.aiScore)}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-indigo-600">
                    {getAIExplanation(job)}
                  </p>
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

export default AIRecommendedJobs;
























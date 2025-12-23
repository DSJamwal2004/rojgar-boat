import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";
import BoatLoader from "./components/BoatLoader";

function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("employerToken");

  const fetchJobs = () => {
    setLoading(true);

    fetch("/api/jobs/my", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setJobs(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load jobs");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!token) {
      setMessage("You must login as an employer.");
      setLoading(false);
      return;
    }
    fetchJobs();
  }, [token]);

  // 🗑️ DELETE JOB HANDLER
  const handleDeleteJob = async (jobId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this job?\n\nAll related applications will also be removed."
    );

    if (!confirm) return;

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert("Job deleted successfully.");
        fetchJobs(); // 🔄 refresh list
      }
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-center text-gray-900">
          My Posted Jobs
        </h2>

        <p className="text-center text-gray-600 mb-8 text-sm">
          Manage your job postings and view worker applications.
        </p>

        {/* Loader */}
        {loading && <BoatLoader label="Loading your jobs..." />}

        {/* Error / Message */}
        {!loading && message && (
          <p className="text-red-500 text-center mb-6">{message}</p>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && !message && (
          <p className="text-center text-gray-500">
            You have not posted any jobs yet.
          </p>
        )}

        {/* Job List */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {job.title}
                </h3>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {job.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                  <p>
                    <span className="font-semibold">🛠 Skills:</span>{" "}
                    {job.skillsRequired.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold">💰 Salary:</span> ₹
                    {job.salary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">📍 Location:</span>{" "}
                    {job.location}
                  </p>
                  <p>
                    <span className="font-semibold">🗓 Posted:</span>{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-4 mt-5">
                  <Link
                    to={`/employer/applications/${job._id}`}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
                  >
                    View Applications
                  </Link>

                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OceanLayout>
  );
}

export default EmployerJobs;






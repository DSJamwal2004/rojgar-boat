import React, { useEffect, useState } from "react";
import OceanLayout from "./components/OceanLayout";
import BoatLoader from "./components/BoatLoader";

function WorkerApplications() {
  const [apps, setApps] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest"); // 🔹 NEW

  const token = localStorage.getItem("workerToken");

  useEffect(() => {
    if (!token) {
      setMessage("You must be logged in as a worker.");
      setLoading(false);
      return;
    }

    fetch("/api/applications/worker/all", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setMessage(data.error);
        else setApps(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load applications.");
        setLoading(false);
      });
  }, [token]);

  // 🔹 SORTED APPLICATIONS
  const sortedApps = [...apps].sort((a, b) => {
    const dateA = new Date(a.appliedAt);
    const dateB = new Date(b.appliedAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const renderStatus = (status) => {
    let color =
      status === "Accepted"
        ? "text-green-700 bg-green-100 border-green-300"
        : status === "Rejected"
        ? "text-red-700 bg-red-100 border-red-300"
        : "text-yellow-700 bg-yellow-100 border-yellow-300";

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${color}`}
      >
        {status}
      </span>
    );
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold text-center md:text-left">
            My Job Applications
          </h2>

          {/* 🔹 SORT DROPDOWN */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-4 md:mt-0 px-4 py-2 rounded-xl border text-sm font-semibold bg-white shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Loader */}
        {loading && <BoatLoader label="Loading your applications..." />}

        {/* Message */}
        {!loading && message && (
          <p className="text-center text-red-500">{message}</p>
        )}

        {/* Empty State */}
        {!loading && sortedApps.length === 0 && !message && (
          <p className="text-center text-gray-500">
            You have not applied to any jobs.
          </p>
        )}

        {/* Applications */}
        {!loading && sortedApps.length > 0 && (
          <div className="space-y-6">
            {sortedApps.map((app) => (
              <div
                key={app._id}
                className="border rounded-2xl shadow-sm hover:shadow-md transition bg-white p-6"
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-bold">
                    {app.jobId?.title || "Job Removed"}
                  </h3>
                  {renderStatus(app.status)}
                </div>

                {/* JOB INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <strong>📍 Location:</strong> {app.jobId?.location || "N/A"}
                  </p>
                  <p>
                    <strong>💰 Salary:</strong> ₹{app.jobId?.salary || "N/A"}
                  </p>
                  <p>
                    <strong>🗓 Applied On:</strong>{" "}
                    {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* EMPLOYER DETAILS */}
                {app.jobId?.employerId && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border">
                    <h4 className="font-semibold mb-2 text-gray-800">
                      Employer Details
                    </h4>

                    <p>
                      <strong>Name:</strong>{" "}
                      {app.jobId.employerId.name}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {app.jobId.employerId.phone}
                    </p>
                    <p>
                      <strong>Organization:</strong>{" "}
                      {app.jobId.employerId.organization || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </OceanLayout>
  );
}

export default WorkerApplications;






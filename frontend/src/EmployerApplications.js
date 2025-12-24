import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";
import BoatLoader from "./components/BoatLoader";

/* ✅ BACKEND BASE (Render) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function EmployerApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("employerToken");

  /* ---------------- FETCH APPLICATIONS ---------------- */
  const fetchApplications = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${API_BASE}/api/applications/employer/job/${jobId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      const text = await res.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to load applications");
      }

      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setMessage("You must login as employer.");
      setLoading(false);
      return;
    }

    if (!jobId) {
      setMessage("Missing job id in URL.");
      setLoading(false);
      return;
    }

    fetchApplications();
  }, [token, jobId]);

  /* ---------------- ACCEPT ---------------- */
  const handleAccept = async (appId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/applications/${appId}/accept`,
        {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
        }
      );

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(data?.error || "Failed to accept application");
      }

      fetchApplications();
    } catch (err) {
      setMessage(err.message);
    }
  };

  /* ---------------- REJECT ---------------- */
  const handleReject = async (appId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/applications/${appId}/reject`,
        {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
        }
      );

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(data?.error || "Failed to reject application");
      }

      fetchApplications();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Applications for Job
        </h2>

        {loading && <BoatLoader label="Loading applications..." />}

        {!loading && message && (
          <p className="text-center text-red-500">{message}</p>
        )}

        {!loading && (
          <div className="space-y-4 mt-6">
            {apps.map((app) => (
              <div
                key={app._id}
                className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white"
              >
                {/* WORKER PROFILE */}
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={
                      app.workerId?.profilePhotoUrl ||
                      "https://via.placeholder.com/80"
                    }
                    alt="Worker"
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500 shadow"
                  />

                  <div>
                    <p className="font-semibold text-lg">
                      {app.workerId?.name} ({app.workerId?.phone})
                    </p>

                    <p className="text-sm text-gray-700">
                      <strong>Gender:</strong>{" "}
                      {app.workerId?.gender || "N/A"}
                    </p>

                    <p className="text-sm text-gray-700">
                      <strong>Location:</strong>{" "}
                      {app.workerId?.location || "N/A"}
                    </p>

                    <p className="text-sm text-gray-700">
                      <strong>Experience:</strong>{" "}
                      {app.workerId?.experienceYears || 0} yrs
                    </p>

                    <p className="text-sm text-gray-700">
                      <strong>Skills:</strong>{" "}
                      {app.workerId?.skills?.join(", ") || "N/A"}
                    </p>

                    <p className="text-sm text-gray-700">
                      <strong>Rating:</strong>{" "}
                      {app.workerId?.rating?.toFixed
                        ? app.workerId.rating.toFixed(1)
                        : app.workerId?.rating || 0} ⭐
                    </p>
                  </div>
                </div>

                {/* APPLICATION INFO */}
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Applied On:</strong>{" "}
                  {new Date(app.appliedAt).toLocaleString("en-IN")}
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                      app.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </p>

                {/* ACTIONS */}
                {app.status === "Applied" && (
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleAccept(app._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(app._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* ⭐ RATE WORKER */}
                {app.status === "Accepted" && (
                  <div className="mt-4">
                    <button
                      onClick={() =>
                        navigate(`/rate-worker/${app.workerId?._id}`)
                      }
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      ⭐ Rate Worker
                    </button>
                  </div>
                )}
              </div>
            ))}

            {apps.length === 0 && !message && (
              <p className="text-center text-gray-500">
                No applications yet for this job.
              </p>
            )}
          </div>
        )}
      </div>
    </OceanLayout>
  );
}

export default EmployerApplications;







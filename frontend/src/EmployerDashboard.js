import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";
import {
  ClipboardList,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

/* ✅ BACKEND BASE (Render) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function EmployerDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("employerToken");

  const [stats, setStats] = useState({
    jobsPosted: 0,
    totalApplications: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
  });

  /* ---------------------------------
     Fetch employer stats (SAFE)
  ---------------------------------- */
  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/employers/stats`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (!res.ok) return;

        const data = await res.json();

        if (!data?.error) {
          setStats({
            jobsPosted: data.jobsPosted ?? 0,
            totalApplications: data.totalApplications ?? 0,
            accepted: data.accepted ?? 0,
            pending: data.pending ?? 0,
            rejected: data.rejected ?? 0,
          });
        }
      } catch (err) {
        console.log("Employer stats fetch failed");
      }
    };

    fetchStats();
  }, [token]);

  return (
    <OceanLayout>
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-6 py-10 mx-auto">
        <h1 className="text-4xl font-extrabold mb-3 text-center text-gray-900">
          Employer Dashboard
        </h1>

        <p className="text-gray-600 mb-10 text-center">
          Track your job posts and manage your applicants.
        </p>

        {/* 📊 Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <Stat
            icon={<ClipboardList size={32} />}
            value={stats.jobsPosted}
            label="Jobs Posted"
            color="purple"
          />
          <Stat
            icon={<Users size={32} />}
            value={stats.totalApplications}
            label="Applications"
            color="blue"
          />
          <Stat
            icon={<CheckCircle size={32} />}
            value={stats.accepted}
            label="Accepted"
            color="green"
          />
          <Stat
            icon={<Clock size={32} />}
            value={stats.pending}
            label="Pending"
            color="yellow"
          />
          <Stat
            icon={<XCircle size={32} />}
            value={stats.rejected}
            label="Rejected"
            color="red"
            span
          />
        </div>

        {/* 🔘 Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/employer/profile")}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-purple-600 to-purple-700
              hover:from-purple-700 hover:to-purple-800 transition">
            👤 My Profile
          </button>

          <button
            onClick={() => navigate("/job-post")}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-blue-600 to-cyan-600
              hover:from-blue-700 hover:to-cyan-700 transition">
            ➕ Post a Job
          </button>

          <button
            onClick={() => navigate("/my-jobs")}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-slate-600 to-slate-700
              hover:from-slate-700 hover:to-slate-800 transition">
            📋 View Posted Jobs
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("employerToken");
              navigate("/employer-login");
            }}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-red-600 to-red-700
              hover:from-red-700 hover:to-red-800 transition">
            🚪 Logout
          </button>
        </div>
      </div>
    </OceanLayout>
  );
}

/* 🔢 Stat Card */
function Stat({ icon, value, label, color, span }) {
  const colors = {
    purple: "bg-purple-100 border-purple-200 text-purple-700",
    blue: "bg-blue-100 border-blue-200 text-blue-700",
    green: "bg-green-100 border-green-200 text-green-700",
    yellow: "bg-yellow-100 border-yellow-200 text-yellow-700",
    red: "bg-red-100 border-red-200 text-red-700",
  };

  return (
    <div
      className={`p-6 border rounded-xl shadow hover:shadow-lg transition ${
        colors[color]
      } ${span ? "col-span-2 md:col-span-1" : ""}`}
    >
      <div className="mx-auto mb-2 text-center">{icon}</div>
      <p className="text-3xl font-bold text-center">{value}</p>
      <p className="text-center font-medium text-sm">{label}</p>
    </div>
  );
}

export default EmployerDashboard;
















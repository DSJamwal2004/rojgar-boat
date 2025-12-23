import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Sparkles,
  MapPin,
} from "lucide-react";

function WorkerDashboard() {
  const workerId = localStorage.getItem("workerId");
  const token = localStorage.getItem("workerToken");

  // 🔒 Lock AI matches ONCE from localStorage
  const initialAIMatches =
    Number(localStorage.getItem("aiMatchesCount")) || 0;

  const [stats, setStats] = useState({
    totalApplied: 0,
    accepted: 0,
    rejected: 0,
    aiMatches: initialAIMatches,
    gpsMatches: 0,
  });

  // ---------------------------------
  // Fetch worker application stats
  // ---------------------------------
  useEffect(() => {
    if (!workerId || !token) return;

    fetch("/api/workers/stats", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.error) {
          setStats((prev) => ({
            ...prev,
            totalApplied: data.totalApplied,
            accepted: data.accepted,
            rejected: data.rejected,
            gpsMatches: data.gpsMatches,
            // ❌ DO NOT touch aiMatches here
          }));
        }
      })
      .catch(() => console.log("Stats fetch failed"));
  }, [workerId, token]);

  return (
    <OceanLayout>
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-6 py-10 mx-auto">
        <h1 className="text-4xl font-extrabold mb-3 text-center text-gray-900">
          Worker Dashboard
        </h1>

        <p className="text-gray-600 mb-10 text-center">
          Your personalized job statistics and quick actions.
        </p>

        {/* 📊 Stats */}
        {workerId && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            <Stat
              icon={<Briefcase size={32} />}
              value={stats.totalApplied}
              label="Jobs Applied"
              bg="purple"
            />
            <Stat
              icon={<CheckCircle size={32} />}
              value={stats.accepted}
              label="Accepted"
              bg="green"
            />
            <Stat
              icon={<XCircle size={32} />}
              value={stats.rejected}
              label="Rejected"
              bg="red"
            />
            <Stat
              icon={<Sparkles size={32} />}
              value={stats.aiMatches}
              label="AI Matches"
              bg="indigo"
            />
            <Stat
              icon={<MapPin size={32} />}
              value={stats.gpsMatches}
              label="GPS Matches"
              bg="blue"
              span
            />
          </div>
        )}

        {/* 🔘 Actions */}
        <div className="space-y-4">

          <Link to="/worker/profile">  
            <button className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-purple-600 to-purple-700
              hover:from-purple-700 hover:to-purple-800 transition">
              👤 My Profile
            </button>
          </Link>

          <Link to="/worker/applications">
            <button className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-amber-500 to-yellow-600
              hover:from-amber-600 hover:to-yellow-700 transition">
              📄 My Job Applications
            </button>
          </Link>

          <Link to="/job-list">
            <button className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-slate-600 to-slate-700
              hover:from-slate-700 hover:to-slate-800 transition">
              🔍 View All Jobs
            </button>
          </Link>

          <Link to="/ai-recommended">
            <button className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-violet-700
              hover:from-indigo-700 hover:to-violet-800 transition">
              ✨ AI Recommended Jobs
            </button>
          </Link>

          <Link to="/gps-recommended">
            <button className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-emerald-600 to-teal-600
              hover:from-emerald-700 hover:to-teal-700 transition">
              📍 GPS Recommended Jobs
            </button>
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("workerToken");
              localStorage.removeItem("workerId");
              localStorage.removeItem("aiMatchesCount");
              window.location.reload();
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

function Stat({ icon, value, label, bg, span }) {
  const colors = {
    purple: "bg-purple-100 border-purple-200 text-purple-700",
    green: "bg-green-100 border-green-200 text-green-700",
    red: "bg-red-100 border-red-200 text-red-700",
    indigo: "bg-indigo-100 border-indigo-200 text-indigo-700",
    blue: "bg-blue-100 border-blue-200 text-blue-700",
  };

  return (
    <div
      className={`p-6 border rounded-xl shadow hover:shadow-lg transition ${
        colors[bg]
      } ${span ? "col-span-2 md:col-span-1" : ""}`}
    >
      <div className="mx-auto mb-2 text-center">{icon}</div>
      <p className="text-3xl font-bold text-center">{value}</p>
      <p className="text-center font-medium text-sm">{label}</p>
    </div>
  );
}

export default WorkerDashboard;
















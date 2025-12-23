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

  // Fetch stats
  useEffect(() => {
    if (!token) return;

    fetch("/api/employers/stats", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => console.log("Employer stats failed"));
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

        {/* Jobs Posted */}
        <div className="p-6 bg-purple-100 border border-purple-200 rounded-xl shadow hover:shadow-lg transition">
          <ClipboardList size={32} className="text-purple-700 mx-auto mb-2" />
          <p className="text-3xl font-bold text-purple-900 text-center">
            {stats.jobsPosted}
          </p>
          <p className="text-center text-purple-700 font-medium text-sm">
            Jobs Posted
          </p>
        </div>

        {/* Applications */}
        <div className="p-6 bg-blue-100 border border-blue-200 rounded-xl shadow hover:shadow-lg transition">
          <Users size={32} className="text-blue-700 mx-auto mb-2" />
          <p className="text-3xl font-bold text-blue-900 text-center">
            {stats.totalApplications}
          </p>
          <p className="text-center text-blue-700 font-medium text-sm">
            Applications
          </p>
        </div>

        {/* Accepted */}
        <div className="p-6 bg-green-100 border border-green-200 rounded-xl shadow hover:shadow-lg transition">
          <CheckCircle size={32} className="text-green-700 mx-auto mb-2" />
          <p className="text-3xl font-bold text-green-900 text-center">
            {stats.accepted}
          </p>
          <p className="text-center text-green-700 font-medium text-sm">
            Accepted
          </p>
        </div>

        {/* Pending */}
        <div className="p-6 bg-yellow-100 border border-yellow-200 rounded-xl shadow hover:shadow-lg transition">
          <Clock size={32} className="text-yellow-700 mx-auto mb-2" />
          <p className="text-3xl font-bold text-yellow-900 text-center">
            {stats.pending}
          </p>
          <p className="text-center text-yellow-700 font-medium text-sm">
            Pending
          </p>
        </div>

        {/* Rejected */}
        <div className="p-6 bg-red-100 border border-red-200 rounded-xl shadow hover:shadow-lg transition col-span-2 md:col-span-1">
          <XCircle size={32} className="text-red-700 mx-auto mb-2" />
          <p className="text-3xl font-bold text-red-900 text-center">
            {stats.rejected}
          </p>
          <p className="text-center text-red-700 font-medium text-sm">
            Rejected
          </p>
        </div>
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

export default EmployerDashboard;















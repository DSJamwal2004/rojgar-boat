// frontend/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WorkerRegister from "./WorkerRegister";
import EmployerRegister from "./EmployerRegister";

import JobPost from "./JobPost";
import JobList from "./JobList";
import RateWorker from "./RateWorker";
import WorkerList from "./WorkerList";

import AIRecommendedJobs from "./AIRecommendedJobs";
import GPSRecommendedJobs from "./GPSRecommendedJobs";

import WorkerDashboard from "./WorkerDashboard";
import EmployerDashboard from "./EmployerDashboard";

import Navbar from "./components/Navbar";

import WorkerLogin from "./WorkerLogin";
import EmployerLogin from "./EmployerLogin";

import WorkerForgotPassword from "./WorkerForgotPassword";
import EmployerForgotPassword from "./EmployerForgotPassword";

import WorkerHome from "./WorkerHome";
import EmployerHome from "./EmployerHome";

import ProtectedRoute from "./components/ProtectedRoute";

import EmployerApplications from "./EmployerApplications";
import EmployerJobs from "./EmployerJobs";

import HomePage from "./HomePage";

import WorkerProfile from "./WorkerProfile";
import EmployerProfile from "./EmployerProfile";

// Worker applications
import WorkerApplications from "./WorkerApplications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* ROLE HOME SCREENS */}
        <Route path="/worker-home" element={<WorkerHome />} />
        <Route path="/employer-home" element={<EmployerHome />} />

        {/* AUTH ROUTES */}
        <Route path="/worker-login" element={<WorkerLogin />} />
        <Route path="/worker-register" element={<WorkerRegister />} />
        <Route path="/employer-login" element={<EmployerLogin />} />
        <Route path="/employer-register" element={<EmployerRegister />} />

        {/* FORGOT PASSWORD – WORKER AND EMPLOYER */}
        <Route
          path="/worker/forgot-password"
          element={<WorkerForgotPassword />}
        />
        <Route
          path="/employer/forgot-password"
          element={<EmployerForgotPassword />}
        />

        {/* WORKER PROTECTED ROUTES */}
        <Route
          path="/worker"
          element={
            <ProtectedRoute role="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-list"
          element={
            <ProtectedRoute role="worker">
              <JobList />
            </ProtectedRoute>
          }
        />

        {/* ✅ SINGLE SOURCE OF AI TRUTH */}
        <Route
          path="/ai-recommended"
          element={
            <ProtectedRoute role="worker">
              <AIRecommendedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gps-recommended"
          element={
            <ProtectedRoute role="worker">
              <GPSRecommendedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker/applications"
          element={
            <ProtectedRoute role="worker">
              <WorkerApplications />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYER PROTECTED ROUTES */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/applications/:jobId"
          element={
            <ProtectedRoute role="employer">
              <EmployerApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-post"
          element={
            <ProtectedRoute role="employer">
              <JobPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute role="employer">
              <EmployerJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workers"
          element={
            <ProtectedRoute role="employer">
              <WorkerList />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED: Rate Worker route WITH PARAM */}
        <Route
          path="/rate-worker/:workerId"
          element={
            <ProtectedRoute role="employer">
              <RateWorker />
            </ProtectedRoute>
          }
        />

        {/* PROFILES */}
        <Route
          path="/worker/profile"
          element={
            <ProtectedRoute role="worker">
              <WorkerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/profile"
          element={
            <ProtectedRoute role="employer">
              <EmployerProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;












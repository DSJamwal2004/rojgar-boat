// backend/routes/applicationRoutes.js
const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getWorkerApplications,
  getEmployerApplicationsForJob,
  acceptApplication, 
  rejectApplication
} = require("../controllers/applicationController");

const { requireAuth } = require("../middlewares/authMiddleware");

// Worker applies to a job
router.post("/apply", requireAuth, applyToJob);

// Worker: view my applications  (ORIGINAL)
router.get("/worker/my", requireAuth, getWorkerApplications);

// Worker: alias endpoint to match your frontend request  ✅ NEW
router.get("/worker/all", requireAuth, getWorkerApplications);

// Employer: view applications for a specific job
router.get(
  "/employer/job/:jobId",
  requireAuth,
  getEmployerApplicationsForJob
);

// Employer accepts an application
router.post("/:id/accept", requireAuth, acceptApplication);

// Employer rejects an application
router.post("/:id/reject", requireAuth, rejectApplication);

module.exports = router;




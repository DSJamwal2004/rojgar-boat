const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createEmployer,
  getAllEmployers,
  getMyEmployerProfile,
  updateMyEmployerProfile,
  uploadEmployerPhoto,
  getEmployerStats,
  getEmployerNotifications,
  markEmployerNotificationsRead,
  clearEmployerNotifications,
} = require("../controllers/employerController");

const { requireAuth } = require("../middlewares/authMiddleware");

// --- Notifications ---
router.get("/notifications", requireAuth, getEmployerNotifications);
router.put("/notifications/read", requireAuth, markEmployerNotificationsRead);
router.delete("/notifications/clear", requireAuth, clearEmployerNotifications);

// Create employer (public)
router.post("/create", createEmployer);

// View all employers (public)
router.get("/", getAllEmployers);

// Get employer profile (protected)
router.get("/me", requireAuth, getMyEmployerProfile);

// Update employer profile
router.put("/me", requireAuth, updateMyEmployerProfile);

// Upload employer photo
router.post(
  "/upload-photo",
  requireAuth,
  upload.single("photo"),
  uploadEmployerPhoto
);

// Dashboard Stats
router.get("/stats", requireAuth, getEmployerStats);

module.exports = router;






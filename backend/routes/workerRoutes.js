const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createWorker,
  getAllWorkers,
  findWorkerByPhone,
  rateWorker,
  getMyProfile,
  updateMyProfile,
  uploadWorkerPhoto,
  getWorkerStats,
  getWorkerNotifications,
  markWorkerNotificationsRead,
  clearWorkerNotifications,
  updateMyLocation,
} = require("../controllers/workerController");

const { requireAuth } = require("../middlewares/authMiddleware");

// --- Notifications ---
router.get("/notifications", requireAuth, getWorkerNotifications);
router.put("/notifications/read", requireAuth, markWorkerNotificationsRead);
router.delete("/notifications/clear", requireAuth, clearWorkerNotifications);

// Create worker (public)
router.post("/create", createWorker);

// Get all workers (public)
router.get("/", getAllWorkers);

// Find worker by phone
router.get("/find/:phone", requireAuth, findWorkerByPhone);

// Rate worker
router.post("/rate/:workerId", requireAuth, rateWorker);

// Get logged-in worker profile
router.get("/me", requireAuth, getMyProfile);

// Update profile
router.put("/me", requireAuth, updateMyProfile);

// Upload profile photo
router.post(
  "/upload-photo",
  requireAuth,
  upload.single("photo"),
  uploadWorkerPhoto
);

// Update worker live GPS location
router.put("/location", requireAuth, updateMyLocation);

// Dashboard Stats
router.get("/stats", requireAuth, getWorkerStats);

module.exports = router;










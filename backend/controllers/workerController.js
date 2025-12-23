// backend/controllers/workerController.js
const mongoose = require("mongoose");
const Worker = require("../models/Worker");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Application = require("../models/Application");
const Job = require("../models/Job");
const bcrypt = require("bcryptjs"); // 🔐 add this

// CREATE WORKER (accept GeoJSON from frontend)
exports.createWorker = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      skills,
      phone,
      location,
      locationCoords, // from frontend
      password,       // 🔐 NEW
    } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // basic uniqueness check on phone
    const existing = await Worker.findOne({ phone });
    if (existing) {
      return res
        .status(400)
        .json({ error: "A worker with this phone already exists." });
    }

    if (
      !locationCoords ||
      !locationCoords.coordinates ||
      isNaN(locationCoords.coordinates[0]) ||
      isNaN(locationCoords.coordinates[1])
    ) {
      return res.status(400).json({
        error: "Invalid GPS coordinates — please click 'Use My Location'.",
      });
    }

    const skillArray = Array.isArray(skills)
      ? skills
      : String(skills || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = new Worker({
      name,
      age,
      gender,
      skills: skillArray,
      phone,
      location,
      rating: 0,
      ratingCount: 0,
      locationCoords,
      password: hashedPassword, // 🔐 store hash
    });

    await worker.save();

    res.json({ message: "Worker created successfully!", worker });
  } catch (err) {
    console.log("❌ Worker creation error:", err);
    res.status(500).json({ error: "Failed to create worker" });
  }
};

// =======================================
// GET ALL WORKERS
// =======================================
exports.getAllWorkers = async (req, res) => {
  const workers = await Worker.find();
  res.json(workers);
};

// =======================================
// FIND WORKER BY PHONE
// =======================================
exports.findWorkerByPhone = async (req, res) => {
  try {
    const worker = await Worker.findOne({ phone: req.params.phone });
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: "Error finding worker" });
  }
};

// =======================================
// RATE A WORKER
// =======================================
exports.rateWorker = async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be between 1 and 5" });
    }

    const worker = await Worker.findById(req.params.workerId);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    worker.rating =
      (worker.rating * worker.ratingCount + rating) /
      (worker.ratingCount + 1);

    worker.ratingCount += 1;

    await worker.save();

    res.json({ message: "Rating added successfully", worker });
  } catch (err) {
    res.status(500).json({ error: "Failed to rate worker" });
  }
};

// =======================================
// 🆕 GET MY PROFILE (LOGGED-IN WORKER)
// =======================================
exports.getMyProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "worker") {
      return res.status(403).json({ error: "Workers only." });
    }

    const worker = await Worker.findById(req.user.id);
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    res.json(worker);
  } catch (err) {
    console.error("❌ getMyProfile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// =======================================
// 🆕 UPDATE MY PROFILE (WORKER EDITS)
// =======================================
exports.updateMyProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "worker") {
      return res.status(403).json({ error: "Workers only." });
    }

    const allowedFields = [
      "name",
      "gender",
      "location",
      "bio",
      "experienceYears",
      "skills",
      "profilePhotoUrl",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "experienceYears") {
          updates[field] = Number(req.body[field]) || 0;
        } else if (field === "skills") {
          updates.skills = Array.isArray(req.body.skills)
            ? req.body.skills
            : String(req.body.skills)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    const worker = await Worker.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    res.json({ message: "Profile updated successfully", worker });
  } catch (err) {
    console.error("❌ updateMyProfile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// 🆕 UPLOAD WORKER PROFILE PHOTO
exports.uploadWorkerPhoto = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "worker") {
      return res.status(403).json({ error: "Workers only." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No photo uploaded." });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "rojgar-worker-profiles",
      transformation: [{ width: 400, height: 400, crop: "fill" }],
    });

    // Delete local temp file
    fs.unlinkSync(req.file.path);

    // Save URL in worker profile
    const worker = await Worker.findByIdAndUpdate(
      req.user.id,
      { profilePhotoUrl: result.secure_url },
      { new: true }
    );

    res.json({
      message: "Photo uploaded successfully.",
      url: result.secure_url,
      worker,
    });
  } catch (err) {
    console.error("❌ uploadWorkerPhoto error:", err);
    res.status(500).json({ error: "Failed to upload photo." });
  }
};

// =======================================
// WORKER STATS FOR DASHBOARD
// GET /api/worker/stats
// =======================================
exports.getWorkerStats = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "worker") {
      return res.status(403).json({ error: "Workers only." });
    }

    const workerId = req.user.id;

    // 1) Get all applications for this worker
    const applications = await Application.find({ workerId });

    const totalApplied = applications.length;
    const accepted = applications.filter(
      (app) => app.status === "Accepted"
    ).length;
    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    // 2) AI matches = jobs that match at least one skill
    let aiMatches = 0;
    let gpsMatches = 0;

    const worker = await Worker.findById(workerId);

    if (worker && Array.isArray(worker.skills) && worker.skills.length > 0) {
      aiMatches = await Job.countDocuments({
        skillsRequired: { $in: worker.skills },
      });
    }

    // 3) GPS matches = jobs within ~5km of worker location
    if (
      worker &&
      worker.locationCoords &&
      Array.isArray(worker.locationCoords.coordinates)
    ) {
      const nearJobs = await Job.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: worker.locationCoords.coordinates,
            },
            distanceField: "distance",
            maxDistance: 5000, // 5km
            spherical: true,
          },
        },
      ]);
      gpsMatches = nearJobs.length;
    }

    return res.json({
      totalApplied,
      accepted,
      rejected,
      aiMatches,
      gpsMatches,
    });
  } catch (err) {
    console.error("❌ getWorkerStats error:", err);
    return res.status(500).json({ error: "Failed to fetch worker stats." });
  }
};

exports.getWorkerNotifications = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    res.json(worker.notifications);
  } catch {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markWorkerNotificationsRead = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    worker.notifications.forEach((n) => (n.isRead = true));
    await worker.save();

    res.json({ message: "Notifications marked as read" });
  } catch {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

// MARK WORKER NOTIFICATIONS AS READ
exports.markWorkerNotificationsRead = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    worker.notifications.forEach(n => n.isRead = true);
    await worker.save();

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    console.error("❌ markWorkerNotificationsRead error:", err);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

// CLEAR ALL WORKER NOTIFICATIONS
exports.clearWorkerNotifications = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    worker.notifications = [];
    await worker.save();

    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear notifications" });
  }
};

// =======================================
// 🆕 UPDATE WORKER LIVE GPS LOCATION
// =======================================
exports.updateMyLocation = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "worker") {
      return res.status(403).json({ error: "Workers only." });
    }

    const { latitude, longitude } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      return res.status(400).json({
        error: "Valid GPS coordinates are required",
      });
    }

    const worker = await Worker.findByIdAndUpdate(
      req.user.id,
      {
        locationCoords: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)],
        },
      },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    res.json({ message: "Location updated successfully", worker });
  } catch (err) {
    console.error("❌ updateMyLocation error:", err);
    res.status(500).json({ error: "Failed to update location" });
  }
};

const mongoose = require("mongoose");
const Employer = require("../models/Employer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Job = require("../models/Job");
const Application = require("../models/Application");
const bcrypt = require("bcryptjs"); // 🔐 add this

// POST /api/employers/create
exports.createEmployer = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    const existing = await Employer.findOne({ phone });
    if (existing) {
      return res
        .status(400)
        .json({ error: "An employer with this phone already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employer = new Employer({
      ...req.body,
      password: hashedPassword, // 🔐 override plain password
    });

    await employer.save();

    res.json({ message: "Employer registered successfully", employer });
  } catch (err) {
    console.error("❌ Employer creation error:", err);
    res.status(500).json({ error: "Failed to create employer" });
  }
};

// VIEW ALL EMPLOYERS
exports.getAllEmployers = async (req, res) => {
  const employers = await Employer.find();
  res.json(employers);
};

// ======================================================
// GET MY EMPLOYER PROFILE
// ======================================================
exports.getMyEmployerProfile = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const employer = await Employer.findById(req.user.id);
    res.json(employer);
  } catch (err) {
    console.error("❌ getMyEmployerProfile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// ======================================================
// UPDATE MY EMPLOYER PROFILE
// ======================================================
exports.updateMyEmployerProfile = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const employer = await Employer.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });

    res.json({ message: "Profile updated successfully", employer });
  } catch (err) {
    console.error("❌ updateMyEmployerProfile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// ======================================================
// UPLOAD EMPLOYER PHOTO (CLOUDINARY)
// ======================================================
exports.uploadEmployerPhoto = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "rojgar-employer-profiles",
      transformation: [{ width: 400, height: 400, crop: "fill" }],
    });

    // Remove local file
    fs.unlinkSync(req.file.path);

    const employer = await Employer.findByIdAndUpdate(
      req.user.id,
      { profilePhotoUrl: upload.secure_url },
      { new: true }
    );

    res.json({ message: "Photo uploaded", url: upload.secure_url, employer });
  } catch (err) {
    console.error("❌ Upload employer photo error:", err);
    res.status(500).json({ error: "Failed to upload photo" });
  }
};

// ======================================================
// EMPLOYER STATS FOR DASHBOARD
// GET /api/employer/stats
// ======================================================
exports.getEmployerStats = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const employerId = req.user.id;

    // 1) Jobs posted by this employer
    const jobs = await Job.find({ employerId }).select("_id");
    const jobsPosted = jobs.length;
    const jobIds = jobs.map((j) => j._id);

    // 2) Applications for these jobs
    let totalApplications = 0;
    let accepted = 0;
    let rejected = 0;
    let pending = 0;

    if (jobIds.length > 0) {
      const applications = await Application.find({
        jobId: { $in: jobIds },
      });

      totalApplications = applications.length;
      accepted = applications.filter(
        (app) => app.status === "Accepted"
      ).length;
      rejected = applications.filter(
        (app) => app.status === "Rejected"
      ).length;
      pending = applications.filter(
        (app) => app.status === "Applied"
      ).length;
    }

    return res.json({
      jobsPosted,
      totalApplications,
      accepted,
      pending,
      rejected,
    });
  } catch (err) {
    console.error("❌ getEmployerStats error:", err);
    return res.status(500).json({ error: "Failed to fetch employer stats." });
  }
};

exports.getEmployerNotifications = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    if (!employer) return res.status(404).json({ error: "Employer not found" });

    res.json(employer.notifications);
  } catch {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markEmployerNotificationsRead = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    if (!employer) return res.status(404).json({ error: "Employer not found" });

    employer.notifications.forEach((n) => (n.isRead = true));
    await employer.save();

    res.json({ message: "Notifications marked as read" });
  } catch {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

// ======================================================
// CLEAR ALL EMPLOYER NOTIFICATIONS
// ======================================================
exports.clearEmployerNotifications = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    // Delete ALL notifications
    employer.notifications = [];
    await employer.save();

    return res.json({ message: "All notifications cleared" });
  } catch (err) {
    console.error("❌ clearEmployerNotifications error:", err);
    return res.status(500).json({ error: "Failed to clear notifications" });
  }
};




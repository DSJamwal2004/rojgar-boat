const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Worker = require("../models/Worker");
const Employer = require("../models/Employer");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// =======================
// Worker login
// =======================
exports.workerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password are required" });
    }

    const worker = await Worker.findOne({ phone }).select("+password");
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const isMatch = await bcrypt.compare(password, worker.password || "");
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid phone or password" });
    }

    const token = signToken({ id: worker._id, role: "worker" });

    const safeWorker = worker.toObject();
    delete safeWorker.password;

    res.json({
      message: "Worker login successful",
      token,
      workerId: worker._id,
      worker: safeWorker,
    });
  } catch (err) {
    console.error("❌ Worker login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// =======================
// Employer login
// =======================
exports.employerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password are required" });
    }

    const employer = await Employer.findOne({ phone }).select("+password");
    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    const isMatch = await bcrypt.compare(password, employer.password || "");
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid phone or password" });
    }

    const token = signToken({ id: employer._id, role: "employer" });

    const safeEmployer = employer.toObject();
    delete safeEmployer.password;

    res.json({
      message: "Employer login successful",
      token,
      employerId: employer._id,
      employer: safeEmployer,
    });
  } catch (err) {
    console.error("❌ Employer login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// =======================
// REQUEST OTP (Worker + Employer)
// =======================
exports.requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const isWorker = req.path.includes("worker");
    const Model = isWorker ? Worker : Employer;

    const user = await Model.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    user.resetOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetOtpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save({ validateBeforeSave: false });

    // DEV MODE: log OTP (replace with SMS later)
    console.log(
      `🔐 PASSWORD RESET OTP for ${isWorker ? "WORKER" : "EMPLOYER"} (${phone}):`,
      otp
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Request OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// =======================
// RESET PASSWORD WITH OTP
// =======================
exports.resetWithOtp = async (req, res) => {
  try {
    const { phone, otp, password } = req.body;
    const isWorker = req.path.includes("worker");
    const Model = isWorker ? Worker : Employer;

    if (!otp || !password || password.length < 6) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await Model.findOne({
      phone,
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset with OTP error:", err);
    res.status(500).json({ error: "Password reset failed" });
  }
};





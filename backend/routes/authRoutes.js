const express = require("express");
const router = express.Router();

const {
  workerLogin,
  employerLogin,
  requestOtp,
  resetWithOtp,
} = require("../controllers/authController");

// =======================
// Worker auth
// =======================
router.post("/worker/login", workerLogin);
router.post("/worker/request-otp", requestOtp);
router.post("/worker/reset-with-otp", resetWithOtp);

// =======================
// Employer auth
// =======================
router.post("/employer/login", employerLogin);
router.post("/employer/request-otp", requestOtp);
router.post("/employer/reset-with-otp", resetWithOtp);

module.exports = router;



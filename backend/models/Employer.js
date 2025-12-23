const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 🔐 Hashed password
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // 🔢 OTP-based password reset
    resetOtp: {
      type: String, // hashed OTP
      select: false,
    },
    resetOtpExpire: Date,

    email: { type: String, default: "" },
    organization: { type: String, default: "" },

    location: { type: String, default: "" },
    profilePhotoUrl: { type: String, default: "" },

    notifications: [
      {
        message: String,
        type: { type: String, default: "info" },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);





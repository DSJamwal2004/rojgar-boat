const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: Number,
    gender: String,

    skills: {
      type: [String],
      default: [],
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 🔐 Hashed password (never returned by default)
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

    location: String,

    locationCoords: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        index: "2dsphere",
      },
    },

    bio: { type: String, default: "" },
    experienceYears: { type: Number, default: 0 },
    profilePhotoUrl: { type: String, default: "" },

    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

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

module.exports = mongoose.model("Worker", workerSchema);






const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    salary: {
      type: Number,
      default: 0,
    },

    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },

    // Human-readable city/area (for AI + UI)
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ STRICT GeoJSON — no defaults, no fake coords
    jobCoords: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: function (v) {
            return (
              Array.isArray(v) &&
              v.length === 2 &&
              !isNaN(v[0]) &&
              !isNaN(v[1])
            );
          },
          message: "Valid GPS coordinates are required",
        },
      },
    },
  },
  { timestamps: true }
);

// Required for $geoNear
jobSchema.index({ jobCoords: "2dsphere" });

module.exports = mongoose.model("Job", jobSchema);









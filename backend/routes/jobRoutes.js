// backend/routes/jobRoutes.js
const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const Worker = require("../models/Worker");
const Application = require("../models/Application");

const { requireAuth } = require("../middlewares/authMiddleware");

// ===============================
// CREATE JOB (Employer only)
// ===============================
router.post("/create", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(403)
        .json({ error: "Only employers can post jobs." });
    }

    const {
      title,
      description,
      skillsRequired,
      salary,
      location,
      latitude,
      longitude,
    } = req.body;

    // ✅ HARD GPS VALIDATION
    if (
      latitude === undefined ||
      longitude === undefined ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      return res.status(400).json({
        error: "Please allow location access to post a job.",
      });
    }

    const job = new Job({
      title,
      description,
      skillsRequired,
      salary,
      employerId: req.user.id,
      location,
      jobCoords: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });

    await job.save();

    res.json({ message: "Job posted successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to post job" });
  }
});

// ===============================
// GET ALL JOBS
// ===============================
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ===============================
// GET JOBS POSTED BY LOGGED-IN EMPLOYER
// ===============================
router.get("/my", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Employers only." });
    }

    const jobs = await Job.find({ employerId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    console.error("Error in /api/jobs/my:", err);
    res.status(500).json({ error: "Failed to fetch employer jobs" });
  }
});

// ===============================
// 🗑️ DELETE JOB (Employer only)
// ===============================
router.delete("/:jobId", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Employers only." });
    }

    const { jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      employerId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        error: "Job not found or you do not own this job.",
      });
    }

    // 🔥 Delete all applications related to this job
    await Application.deleteMany({ jobId });

    // 🔥 Delete the job
    await job.deleteOne();

    res.json({
      message: "Job and all related applications deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Delete job error:", err);
    res.status(500).json({ error: "Failed to delete job." });
  }
});

// ===============================
// BASIC SKILL MATCHING
// ===============================
router.get("/recommend/basic", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({ error: "Workers only." });
    }

    const worker = await Worker.findById(req.user.id);
    const jobs = await Job.find();

    const scoredJobs = jobs.map((job) => {
      let score = 0;
      worker.skills.forEach((skill) => {
        if (job.skillsRequired.includes(skill)) score++;
      });

      return { ...job._doc, score };
    });

    scoredJobs.sort((a, b) => b.score - a.score);

    res.json(scoredJobs);
  } catch (err) {
    res.status(500).json({ error: "Error computing basic recommendations" });
  }
});

// ===============================
// AI MATCHING (TF-IDF + Cosine)
// ===============================
router.get("/recommend/ai", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({ error: "Workers only." });
    }

    const natural = require("natural");
    const TfIdf = natural.TfIdf;

    const worker = await Worker.findById(req.user.id);
    const workerText = worker.skills.join(" ");
    const ratingScore = worker.rating ? worker.rating / 5 : 0;

    const jobs = await Job.find();
    let results = [];

    for (let job of jobs) {
      const jobText = `${job.title} ${job.description} ${job.skillsRequired.join(
        " "
      )}`;

      const tfidf = new TfIdf();
      tfidf.addDocument(workerText);
      tfidf.addDocument(jobText);

      let workerVector = [];
      let jobVector = [];

      tfidf.listTerms(0).forEach((item) => {
        workerVector.push(tfidf.tfidf(item.term, 0));
        jobVector.push(tfidf.tfidf(item.term, 1));
      });

      const dot = workerVector.reduce(
        (sum, val, idx) => sum + val * jobVector[idx],
        0
      );
      const magA = Math.sqrt(workerVector.reduce((s, v) => s + v * v, 0));
      const magB = Math.sqrt(jobVector.reduce((s, v) => s + v * v, 0));

      const aiScore = magA && magB ? dot / (magA * magB) : 0;

      const locationScore =
        job.location.toLowerCase() === worker.location.toLowerCase() ? 1 : 0;

      const finalScore = aiScore * 0.6 + ratingScore * 0.2 + locationScore * 0.2;

      results.push({
        ...job._doc,
        aiScore,
        locationScore,
        ratingScore,
        finalScore,
      });
    }

    results.sort((a, b) => b.finalScore - a.finalScore);

    res.json(results);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI matching failed" });
  }
});

// ===============================
// GPS NEAREST JOBS
// ===============================
router.get("/recommend/gps", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({ error: "Workers only." });
    }

    const worker = await Worker.findById(req.user.id);

    if (!worker.locationCoords || !worker.locationCoords.coordinates) {
      return res.status(400).json({ error: "Worker location missing" });
    }

    const jobs = await Job.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: worker.locationCoords.coordinates,
          },
          distanceField: "distance",
          spherical: true,
        },
      },
    ]);

    res.json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "GPS matching failed" });
  }
});

module.exports = router;




const Application = require("../models/Application");
const Job = require("../models/Job");
const Worker = require("../models/Worker");
const Employer = require("../models/Employer");

// =========================
// Worker applies to a job
// POST /api/applications/apply
// =========================
exports.applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({ error: "Only workers can apply for jobs." });
    }

    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    const existing = await Application.findOne({
      jobId,
      workerId: req.user.id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job." });
    }

    const application = await Application.create({
      jobId,
      workerId: req.user.id,
    });

    // ⭐ Notify Employer
    const employer = await Employer.findById(job.employerId);
    if (employer) {
      employer.notifications.push({
        message: `New application received for your job: ${job.title}`,
      });
      await employer.save();
    }

    res.json({
      message: "Application submitted successfully.",
      application,
    });
  } catch (err) {
    console.error("❌ applyToJob error:", err);
    res.status(500).json({ error: "Failed to apply for job." });
  }
};

// =========================
// Worker view their applications WITH employer details
// =========================
exports.getWorkerApplications = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({ error: "Only workers can view their applications." });
    }

    const applications = await Application.find({ workerId: req.user.id })
      .populate({
        path: "jobId",
        populate: { path: "employerId" }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("❌ getWorkerApplications error:", err);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};

// EMPLOYER: view applications for one job
exports.getEmployerApplicationsForJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Only employers can view job applications." });
    }

    const { jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      employerId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found or not owned by this employer." });
    }

    const applications = await Application.find({ jobId })
      .populate("workerId")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("❌ getEmployerApplicationsForJob error:", err);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};

// EMPLOYER ACCEPT AN APPLICATION
exports.acceptApplication = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Only employers can accept applications." });
    }

    const applicationId = req.params.id;

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) return res.status(404).json({ error: "Application not found." });

    if (String(application.jobId.employerId) !== String(req.user.id)) {
      return res.status(403).json({ error: "You do not own this job." });
    }

    application.status = "Accepted";
    await application.save();

    // ⭐ Notify Worker
    const worker = await Worker.findById(application.workerId);
    if (worker) {
      worker.notifications.push({
        message: `Your application for "${application.jobId.title}" was accepted!`,
      });
      await worker.save();
    }

    res.json({ message: "Application accepted!", application });
  } catch (err) {
    console.error("❌ acceptApplication error:", err);
    res.status(500).json({ error: "Failed to accept application." });
  }
};

// EMPLOYER REJECT AN APPLICATION
exports.rejectApplication = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Only employers can reject applications." });
    }

    const applicationId = req.params.id;

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) return res.status(404).json({ error: "Application not found." });

    if (String(application.jobId.employerId) !== String(req.user.id)) {
      return res.status(403).json({ error: "You do not own this job." });
    }

    application.status = "Rejected";
    await application.save();

    // ⭐ Notify Worker
    const worker = await Worker.findById(application.workerId);
    if (worker) {
      worker.notifications.push({
        message: `Your application for "${application.jobId.title}" was rejected.`,
      });
      await worker.save();
    }

    res.json({ message: "Application rejected!", application });
  } catch (err) {
    console.error("❌ rejectApplication error:", err);
    res.status(500).json({ error: "Failed to reject application." });
  }
};

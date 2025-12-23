// backend/server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// 🔥 CORS FIX (important for API calls + deployment)
const corsOptions = {
  origin: "*",  // allow all for now – tighten during deployment
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

app.use(express.json());

// Connect DB
connectDB();

// Test
app.get("/", (req, res) => {
  res.send("Backend running ✔");
});

// Routes
app.use("/api/workers", require("./routes/workerRoutes"));
app.use("/api/employers", require("./routes/employerRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


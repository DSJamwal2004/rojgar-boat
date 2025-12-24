// backend/server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

/* ============================
   ✅ CORS CONFIG (FIXED)
   ============================ */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://rojgar-boat.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ VERY IMPORTANT: handle preflight requests
app.options("*", cors());

/* ============================
   MIDDLEWARE
   ============================ */
app.use(express.json());

/* ============================
   DATABASE
   ============================ */
connectDB();

/* ============================
   TEST ROUTE
   ============================ */
app.get("/", (req, res) => {
  res.send("Backend running ✔");
});

/* ============================
   ROUTES
   ============================ */
app.use("/api/workers", require("./routes/workerRoutes"));
app.use("/api/employers", require("./routes/employerRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

/* ============================
   SERVER
   ============================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



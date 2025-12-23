// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully ✔");

    // ⭐ ADD THESE LINES
    console.log("Connected DB Name:", mongoose.connection.name);
    console.log("Connected Host:", mongoose.connection.host);

  } catch (err) {
    console.error("MongoDB connection error ❌", err);
  }
};

module.exports = connectDB;



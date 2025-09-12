// next-gallery-backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Import middleware & routes
const corsMiddleware = require("./middlewares/corsMiddleware");
const errorHandler = require("./middlewares/errorMiddleware");
const photoRoutes = require("./routes/photoRoute");
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", photoRoutes);
app.use("/api", authRoutes); // <-- mount login/register routes under /api

// Error handler middleware (after all routes, but before listen)
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/photoDrop")
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server ONLY after DB connection is ready
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

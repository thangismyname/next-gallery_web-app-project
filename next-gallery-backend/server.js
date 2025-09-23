const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");

// Load .env first
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
// Serve static uploads (if cannot access to S3)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Passport strategies
require("./config/passport");
app.use(passport.initialize());

// Health check
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// 🔥 Routes
const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", photoRoutes); // <-- added photo routes

// Connect Mongo + Start server
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));

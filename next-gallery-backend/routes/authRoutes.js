// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Login route
router.post("/login", login);
// Registration
router.post("/register", register);
// Forgot Password
router.post("/forgot-password", forgotPassword);
// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;

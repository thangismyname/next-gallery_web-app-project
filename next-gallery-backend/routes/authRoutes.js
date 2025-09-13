// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Registration
router.post("/register", register);

// Login route
router.post("/login", login);

module.exports = router;

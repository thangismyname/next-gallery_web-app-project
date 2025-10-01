// routes/userRoutes.js
const express = require("express");
const { updateUser, me } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// User Profile routes (JWT protected)
router.get("/me", authMiddleware, me); // Get current user
router.put("/me", authMiddleware, updateUser); // Update current user

module.exports = router;

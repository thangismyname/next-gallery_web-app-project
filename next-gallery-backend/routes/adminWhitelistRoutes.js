// routes/adminWhitelistRoutes.js
const express = require("express");
const {
  addWhitelistEntry,
  getWhitelist,
} = require("../controllers/adminWhitelistController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Only Admins can manage the whitelist
router.post("/add", protect, requireRole("Admin"), addWhitelistEntry);
router.get("/", protect, requireRole("Admin"), getWhitelist);

module.exports = router;

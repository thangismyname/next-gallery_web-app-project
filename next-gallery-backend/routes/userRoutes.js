// routes/userRoutes.js
const express = require("express");
const {
  updateUser,
  me,
  changePassword,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// User Profile routes (JWT protected)
router.get("/me", authMiddleware, me);
router.put("/me", authMiddleware, updateUser);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;

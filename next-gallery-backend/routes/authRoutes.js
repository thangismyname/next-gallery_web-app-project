const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
} = require("../controllers/authController");

const router = express.Router();

// -------- Normal Auth (API) --------
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", me);

// helper for generating tokens
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// -------- Google OAuth --------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // frontend route
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    // don’t send firstName/status here — frontend will fetch /me
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

// -------- Discord OAuth --------
router.get(
  "/discord",
  passport.authenticate("discord", { scope: ["identify", "email"] })
);

router.get(
  "/discord/callback",
  passport.authenticate("discord", {
    failureRedirect: "/login", // frontend route
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

module.exports = router;

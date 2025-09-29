const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
  linkProvider,
} = require("../controllers/authController");

const router = express.Router();

// -------- Normal Auth (API) --------
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", me);
router.post("/link-provider", linkProvider);

// Helper for generating tokens
function generateToken(user) {
  console.log("Generating token for user:", {
    id: user._id,
    email: user.email,
    role: user.role,
  });
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// -------- Google OAuth --------
router.get("/google", (req, res, next) => {
  console.log("Google: Initiating OAuth, link:", req.query.link);
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    try {
      console.log("Google Callback: User authenticated:", {
        id: req.user._id,
        email: req.user.email,
        providers: req.user.providers,
      });

      if (req.query.link === "true") {
        // Handle linking
        console.log(
          "Google Callback: Linking Google for user:",
          req.user.email
        );
        const googleProvider = req.user.providers.find(
          (p) => p.provider === "google"
        );
        await linkProvider(
          {
            body: {
              email: req.user.email,
              provider: "google",
              providerId: googleProvider.providerId,
            },
          },
          {
            json: (data) =>
              console.log("Google Callback: Link response:", data),
          }
        );
        res.redirect(
          `${process.env.FRONTEND_URL}/link-provider?message=Google%20linked%20successfully`
        );
      } else {
        // Handle login
        const token = generateToken(req.user);
        console.log("Google Callback: Generated token:", token);
        res.redirect(
          `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
        );
      }
    } catch (error) {
      console.error("Google Callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

// -------- Discord OAuth --------
router.get("/discord", (req, res, next) => {
  console.log("Discord: Initiating OAuth, link:", req.query.link);
  passport.authenticate("discord", { scope: ["identify", "email"] })(
    req,
    res,
    next
  );
});

router.get(
  "/discord/callback",
  passport.authenticate("discord", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    try {
      console.log("Discord Callback: User authenticated:", {
        id: req.user._id,
        email: req.user.email,
        providers: req.user.providers,
      });

      if (req.query.link === "true") {
        // Handle linking
        console.log(
          "Discord Callback: Linking Discord for user:",
          req.user.email
        );
        const discordProvider = req.user.providers.find(
          (p) => p.provider === "discord"
        );
        await linkProvider(
          {
            body: {
              email: req.user.email,
              provider: "discord",
              providerId: discordProvider.providerId,
            },
          },
          {
            json: (data) =>
              console.log("Discord Callback: Link response:", data),
          }
        );
        res.redirect(
          `${process.env.FRONTEND_URL}/link-provider?message=Discord%20linked%20successfully`
        );
      } else {
        // Handle login
        const token = generateToken(req.user);
        console.log("Discord Callback: Generated token:", token);
        res.redirect(
          `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
        );
      }
    } catch (error) {
      console.error("Discord Callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

module.exports = router;

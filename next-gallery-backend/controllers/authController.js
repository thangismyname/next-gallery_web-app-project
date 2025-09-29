const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const { OAuth2Client } = require("google-auth-library");

// Initialize Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: format user object with UTC+7 timestamps
const formatUser = (user) => {
  const obj = user.toObject();
  return {
    id: obj._id,
    email: obj.email,
    firstName: obj.firstName || "",
    lastName: obj.lastName || "",
    avatar: obj.avatar || "",
    role: obj.role,
    providers: obj.providers || [],
    createdAt: moment(obj.createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment(obj.updatedAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ss"),
  };
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------- Register --------
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, studentId } =
      req.body;

    if (!email || !password) {
      console.log("Register: Missing email or password");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (role === "Admin" && !studentId) {
      console.log("Register: Student ID required for Admin role");
      return res
        .status(400)
        .json({ message: "Student ID is required for Admins" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("Register: Email already registered:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      studentId,
      providers: [{ provider: "local" }],
    });

    const token = generateToken(user._id);
    console.log("Register: User created:", formatUser(user));

    res.status(201).json({
      message: "Registration successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Login --------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Login: Missing email or password");
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    console.log("Login: User retrieved:", {
      _id: user?._id,
      email: user?.email,
      providers: user?.providers,
      hasPassword: !!user?.password,
    });

    if (!user) {
      console.log("Login: User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Ensure providers array exists
    if (!Array.isArray(user.providers)) {
      console.log("Login: Initializing providers array for user:", email);
      user.providers = user.password ? [{ provider: "local" }] : [];
      await user.save();
    }

    if (!user.providers.some((p) => p.provider === "local")) {
      console.log("Login: No local provider for user:", email, user.providers);
      return res.status(400).json({
        message:
          "This account does not have a password set. Log in with Google or Discord, or link a password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Login: Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    console.log("Login: Successful login for user:", email);

    res.json({ token, user: formatUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Google Sign-In --------
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      console.log("Google Login: Missing ID token");
      return res.status(400).json({ message: "Google ID token is required" });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      console.log("Google Login: Invalid Google token");
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { sub: googleId, email, given_name, family_name, picture } = payload;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("Google Login: Creating new user for email:", email);
      user = await User.create({
        email: email.toLowerCase(),
        firstName: given_name || "",
        lastName: family_name || "",
        avatar: picture || "",
        providers: [{ provider: "google", providerId: googleId }],
        role: "User",
      });
    } else if (!user.providers.some((p) => p.provider === "google")) {
      console.log("Google Login: Adding Google provider for user:", email);
      if (!Array.isArray(user.providers)) {
        user.providers = [];
      }
      user.providers.push({ provider: "google", providerId: googleId });
      user.firstName = user.firstName || given_name || "";
      user.lastName = user.lastName || family_name || "";
      user.avatar = user.avatar || picture || "";
      await user.save();
    }

    const token = generateToken(user._id);
    console.log("Google Login: Successful login for user:", email);

    res.json({
      message: "Google login successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Google Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Link Provider --------
exports.linkProvider = async (req, res) => {
  try {
    const { email, provider, providerId, password } = req.body;

    if (!email || (!provider && !password)) {
      console.log("Link Provider: Missing required fields");
      return res.status(400).json({
        message: "Email and either provider or password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      console.log("Link Provider: User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure providers array exists
    if (!Array.isArray(user.providers)) {
      console.log(
        "Link Provider: Initializing providers array for user:",
        email
      );
      user.providers = user.password ? [{ provider: "local" }] : [];
    }

    if (provider && providerId) {
      if (user.providers.some((p) => p.provider === provider)) {
        console.log("Link Provider: Provider already linked:", provider, email);
        return res
          .status(400)
          .json({ message: `${provider} is already linked to this account` });
      }
      console.log("Link Provider: Adding provider:", provider, email);
      user.providers.push({ provider, providerId });
    }

    if (password) {
      if (user.providers.some((p) => p.provider === "local")) {
        console.log("Link Provider: Local provider already exists:", email);
        return res
          .status(400)
          .json({ message: "A password is already set for this account" });
      }
      console.log("Link Provider: Setting password for user:", email);
      user.providers.push({ provider: "local" });
      user.password = password; // Will be hashed by pre-save hook
    }

    await user.save();
    console.log("Link Provider: Successfully updated user:", email);

    res.json({
      message: "Provider linked successfully",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Link Provider error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Forgot Password --------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      console.log("Forgot Password: User not found:", email);
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Ensure providers array exists
    if (!Array.isArray(user.providers)) {
      console.log(
        "Forgot Password: Initializing providers array for user:",
        email
      );
      user.providers = user.password ? [{ provider: "local" }] : [];
      await user.save();
    }

    if (!user.providers.some((p) => p.provider === "local")) {
      console.log(
        "Forgot Password: No local provider for user:",
        email,
        user.providers
      );
      return res.status(400).json({
        message:
          "This account does not have a password set. Log in with Google or Discord.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Photo App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.firstName || "user"},</p>
        <p>You requested a password reset. Please click below:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire at <b>${moment(user.resetPasswordExpire)
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DD HH:mm:ss")} (UTC+7)</b>.</p>
      `,
    });

    console.log("Forgot Password: Reset link sent to:", email);
    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot Password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Reset Password --------
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      console.log("Reset Password: Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Ensure providers array exists
    if (!Array.isArray(user.providers)) {
      console.log(
        "Reset Password: Initializing providers array for user:",
        user.email
      );
      user.providers = user.password ? [{ provider: "local" }] : [];
    }

    if (!user.providers.some((p) => p.provider === "local")) {
      user.providers.push({ provider: "local" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    console.log("Reset Password: Successful for user:", user.email);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Get Authenticated User Info --------
exports.me = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Me: No token provided");
      return res.status(401).json({ code: "NO_TOKEN_PROVIDED" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("Me: User not found for ID:", decoded.id);
      return res.status(404).json({ code: "USER_NOT_FOUND" });
    }

    // Ensure providers array exists
    if (!Array.isArray(user.providers)) {
      console.log("Me: Initializing providers array for user:", user.email);
      user.providers = user.password ? [{ provider: "local" }] : [];
      await user.save();
    }

    console.log("Me: User fetched:", user.email);
    res.json({ user: formatUser(user) });
  } catch (error) {
    console.error("Me error:", error);
    res.status(401).json({ code: "INVALID_OR_EXPIRED_TOKEN" });
  }
};

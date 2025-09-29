// controllers/authController.js
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const { OAuth2Client } = require("google-auth-library");

// Initialize Google OAuth2 client with your Client ID
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
    provider: obj.provider,
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

    if (role === "Admin" && !studentId) {
      return res
        .status(400)
        .json({ message: "Student ID is required for Admins" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      studentId,
      provider: "local",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Login --------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.provider !== "local") {
      return res.status(400).json({
        message: `This account was registered with ${user.provider}. Please log in using ${user.provider}.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Forgot Password --------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

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

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
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
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Get Authenticated User Info --------
exports.me = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ code: "NO_TOKEN_PROVIDED" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ code: "USER_NOT_FOUND" });
    }

    res.json({ user: formatUser(user) });
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(401).json({ code: "INVALID_OR_EXPIRED_TOKEN" });
  }
};

// -------- Google Sign-In --------
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Google ID token is required" });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { sub: googleId, email, given_name, family_name, picture } = payload;

    // Find or create user
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { providerId: googleId }],
    });

    if (!user) {
      user = await User.create({
        email: email.toLowerCase(),
        firstName: given_name || "",
        lastName: family_name || "",
        avatar: picture || "",
        provider: "google",
        providerId: googleId,
        role: "User",
      });
    } else if (user.provider !== "google") {
      return res.status(400).json({
        message: `This email is already registered with ${user.provider}. Please use that method to log in.`,
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Google login successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

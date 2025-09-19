// controllers/authController.js
const AdminWhitelist = require("../models/adminWhitelistModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ code: "MISSING_FIELDS" });
    }

    // Find user (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

// Register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, studentId } =
      req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ code: "MISSING_FIELDS" });
    }

    // ✅ Password validation
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ code: "PASSWORD_TOO_WEAK" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ code: "EMAIL_ALREADY_REGISTERED" });
    }

    // ✅ Special rule for Admin
    if (role === "Admin") {
      if (!studentId) {
        return res.status(400).json({ code: "STUDENT_ID_REQUIRED" });
      }

      const fullName = `${firstName} ${lastName}`.trim();
      const whitelistEntry = await AdminWhitelist.findOne({ studentId });

      if (!whitelistEntry || whitelistEntry.fullName !== fullName) {
        return res.status(403).json({ code: "ADMIN_NOT_WHITELISTED" });
      }
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      studentId: role === "Admin" ? studentId : undefined,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

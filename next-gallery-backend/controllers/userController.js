// controllers/userController.js
const moment = require("moment-timezone");
const User = require("../models/userModel");

// Helper
const formatUser = (user) => {
  const obj = user.toObject();
  return {
    id: obj._id,
    email: obj.email,
    firstName: obj.firstName || "",
    lastName: obj.lastName || "",
    avatar: obj.avatar || "",
    phone: obj.phone || "",
    role: obj.role,
    studentId: obj.studentId || "",
    providers: obj.providers || [],
    createdAt: moment(obj.createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment(obj.updatedAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ss"),
  };
};

// -------- Get Current User --------
exports.me = async (req, res) => {
  try {
    res.json({ user: formatUser(req.user) });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------- Update Current User --------
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Track changes
    let hasChanges = false;

    if (firstName !== undefined && firstName !== user.firstName) {
      user.firstName = firstName;
      hasChanges = true;
    }
    if (lastName !== undefined && lastName !== user.lastName) {
      user.lastName = lastName;
      hasChanges = true;
    }
    if (phone !== undefined && phone !== user.phone) {
      user.phone = phone;
      hasChanges = true;
    }
    if (avatar !== undefined && avatar !== user.avatar) {
      user.avatar = avatar;
      hasChanges = true;
    }

    // If no data provided or no changes detected
    if (!hasChanges) {
      return res.status(400).json({
        message: "No changes detected. Please update at least one field.",
      });
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---- Change Password (logged in) ----
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

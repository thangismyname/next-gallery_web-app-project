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

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

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

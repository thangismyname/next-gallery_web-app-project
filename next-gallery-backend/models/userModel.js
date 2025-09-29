// models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: true }, // only local users need this
    provider: {
      type: String,
      enum: ["local", "google", "discord"],
      default: "local",
    },
    providerId: String,
    avatar: String,
    role: {
      type: String,
      enum: ["Admin", "Photographer", "User"],
      default: "User",
    },
    studentId: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);

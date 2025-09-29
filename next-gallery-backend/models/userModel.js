// models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, select: false }, // Only for local users, hidden by default
    providers: {
      type: [
        {
          provider: {
            type: String,
            enum: ["local", "google", "discord"],
            required: true,
          },
          providerId: { type: String }, // Only for google/discord
        },
      ],
      default: [], // Ensure providers is always an array
    },
    avatar: { type: String, trim: true },
    role: {
      type: String,
      enum: ["Admin", "Photographer", "User"],
      default: "User",
    },
    studentId: { type: String, trim: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("userModel: Hashed password for user:", this.email);
  } catch (error) {
    console.error("userModel: Password hashing error:", error);
    return next(error);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

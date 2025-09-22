const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false }, // make optional for OAuth
    lastName: { type: String, required: false }, // make optional
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: false }, // allow OAuth users without password
    role: {
      type: String,
      enum: ["Admin", "Photographer", "User"],
      default: "User",
    },
    studentId: { type: String }, // Only required if Admin
    provider: {
      type: String,
      enum: ["local", "google", "discord"],
      default: "local",
    },
    providerId: { type: String }, // Google/Discord user ID
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save (only if it exists & modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);

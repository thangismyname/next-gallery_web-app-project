// models/adminWhitelistModel.js
const mongoose = require("mongoose");

const adminWhitelistSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true }, // compare to firstName + lastName
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who added this ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminWhitelist", adminWhitelistSchema);

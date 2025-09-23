// next-gallery-backend/models/Photo.js
const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String }, // for local storage
  url: { type: String }, // for S3 storage public URL
  mimetype: { type: String },
  size: { type: Number },
  storage: { type: String, enum: ["local", "s3"], default: "local" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Photo", photoSchema);

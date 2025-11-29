// next-gallery-backend/models/Photo.js
const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  originalName: { type: String },

  // Local storage fields
  originalFile: { type: String }, // original file stored in uploads/
  originalUrl: { type: String }, // /uploads/xxxx.heic or .jpg

  previewFile: { type: String }, // converted preview (jpg/png/webp)
  previewUrl: { type: String }, // /uploads/xxxx.jpg
  previewMimetype: { type: String },

  // S3 storage fields
  filename: { type: String }, // S3 key
  url: { type: String }, // S3 URL

  mimetype: { type: String }, // original file type (heic/png/etc.)
  size: { type: Number },

  storage: { type: String, enum: ["local", "s3"], default: "local" },

  category: { type: String, default: "Uncategorized" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Photo", photoSchema);

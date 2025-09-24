// next-gallery-backend/controllers/photoController.js
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const Photo = require("../models/Photo");

// --- Helpers ---
function toUrlPath(p) {
  return p.split(path.sep).join("/"); // ensures forward slashes
}

function getLocalFilePath(storedPath) {
  if (path.isAbsolute(storedPath)) return storedPath;
  return path.resolve(__dirname, "..", storedPath);
}

// --- Upload photo ---
exports.uploadPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    let photoData = {
      originalName: file.originalname,
      category: "Uncategorized",
    };

    if (process.env.USE_S3 === "true") {
      // S3 upload
      photoData.filename = file.key;
      photoData.url = file.location;
      photoData.mimetype = file.mimetype;
      photoData.size = file.size;
      photoData.storage = "s3";
    } else {
      // Local storage
      photoData.filename = file.filename;
      photoData.path = toUrlPath(path.join("uploads", file.filename));
      photoData.mimetype = file.mimetype;
      photoData.size = file.size;
      photoData.storage = "local";
    }

    const photo = new Photo(photoData);
    await photo.save();

    res.status(201).json(photo);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- Get all photos ---
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Get photo by ID ---
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Delete photo ---
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    if (photo.storage === "local" && photo.path) {
      const filePath = getLocalFilePath(photo.path);

      try {
        await fs.promises.unlink(filePath);
        console.log("🗑️ Deleted local file:", filePath);
      } catch (err) {
        console.warn("⚠️ Failed to delete local file:", err.message);
      }
    }

    await Photo.deleteOne({ _id: req.params.id });
    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- AWS S3 Setup ---
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// --- Download photo ---
exports.downloadPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    if (photo.storage === "local") {
      const filePath = getLocalFilePath(photo.path);
      console.log("📂 Serving local file:", filePath);

      return res.download(filePath, photo.originalName || photo.filename);
    }

    if (photo.storage === "s3") {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: photo.filename,
      };

      const s3Stream = s3.getObject(params).createReadStream();

      s3Stream.on("error", (err) => {
        console.error("❌ S3 download error:", err);
        res.status(500).json({ error: "Error downloading file from S3" });
      });

      res.attachment(photo.originalName || photo.filename);
      s3Stream.pipe(res);
      return;
    }

    res.status(400).json({ error: "Unknown storage type" });
  } catch (err) {
    console.error("❌ Download error:", err);
    res.status(500).json({ error: err.message });
  }
};

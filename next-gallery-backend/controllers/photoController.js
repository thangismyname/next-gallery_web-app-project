// next-gallery-backend/controllers/photoController.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
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

// ------------------------------
//        UPLOAD PHOTO
// ------------------------------
exports.uploadPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    let photoData = {
      originalName: file.originalname,
      category: "Uncategorized",
    };

    // ------------------------------
    //        AWS S3 MODE
    // ------------------------------
    if (process.env.USE_S3 === "true") {
      photoData.filename = file.key; // original
      photoData.url = file.location;
      photoData.mimetype = file.mimetype;
      photoData.size = file.size;
      photoData.storage = "s3";
      photoData.previewUrl = file.location; // preview uses same file for now
    } else {
      // ------------------------------
      //      LOCAL STORAGE MODE
      // ------------------------------

      const uploadsDir = path.join(__dirname, "..", "uploads");
      const originalPath = path.join(uploadsDir, file.filename);

      // Default preview = original
      let previewFilename = file.filename;
      let previewMimetype = file.mimetype;

      // --- Convert HEIC → JPEG for browser preview ---
      if (file.mimetype === "image/heic" || file.mimetype === "image/heif") {
        previewFilename = file.filename.replace(/\.\w+$/, ".jpg");
        const previewPath = path.join(uploadsDir, previewFilename);

        await sharp(originalPath).jpeg({ quality: 90 }).toFile(previewPath);

        previewMimetype = "image/jpeg";
      }

      // Store DB fields
      photoData.originalFile = file.filename;
      photoData.originalUrl = toUrlPath(path.join("uploads", file.filename));

      photoData.previewFile = previewFilename;
      photoData.previewUrl = toUrlPath(path.join("uploads", previewFilename));

      photoData.mimetype = file.mimetype;
      photoData.previewMimetype = previewMimetype;

      photoData.size = file.size;
      photoData.storage = "local";
    }

    // Save photo document
    const photo = new Photo(photoData);
    await photo.save();

    res.status(201).json(photo);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
//        GET ALL PHOTOS
// ------------------------------
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
//        GET PHOTO BY ID
// ------------------------------
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
//        DELETE PHOTO
// ------------------------------
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    // --- LOCAL DELETE ---
    if (photo.storage === "local") {
      const pathsToDelete = [
        photo.originalUrl,
        photo.previewUrl !== photo.originalUrl ? photo.previewUrl : null,
      ].filter(Boolean);

      for (const p of pathsToDelete) {
        const filePath = getLocalFilePath(p);

        try {
          await fs.promises.unlink(filePath);
          console.log("🗑️ Deleted local file:", filePath);
        } catch (err) {
          console.warn("⚠️ Failed to delete:", err.message);
        }
      }
    }

    await Photo.deleteOne({ _id: req.params.id });

    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
//        DOWNLOAD PHOTO
// ------------------------------
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.downloadPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    // ---- LOCAL MODE ----
    if (photo.storage === "local") {
      const filePath = getLocalFilePath(photo.originalUrl);
      return res.download(filePath, photo.originalName || photo.filename);
    }

    // ---- S3 MODE ----
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
  } catch (err) {
    console.error("❌ Download error:", err);
    res.status(500).json({ error: err.message });
  }
};

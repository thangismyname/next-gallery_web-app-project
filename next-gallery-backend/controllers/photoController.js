const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const Photo = require("../models/Photo");

// Get photo by ID
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload photo
exports.uploadPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Prepare data differently depending on storage type
    let photoData = {
      originalName: file.originalname,
      category: "Uncategorized", // your placeholder category
    };

    if (process.env.USE_S3 === "true") {
      // When using S3, multer-s3 provides .key and .location
      photoData.filename = file.key; // S3 object key (filename in bucket)
      photoData.url = file.location; // Public URL to access S3 object
      photoData.mimetype = file.mimetype;
      photoData.size = file.size;
      photoData.storage = "s3";
    } else {
      // Local storage
      photoData.filename = file.filename; // filename on disk
      photoData.path = file.path; // full local path
      photoData.mimetype = file.mimetype;
      photoData.size = file.size;
      photoData.storage = "local";
    }

    const photo = new Photo(photoData);
    await photo.save();

    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPhotos = async (req, res) => {
  try {
    // Sort by creation date descending (latest first)
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    if (photo.storage === "local" && photo.path) {
      // Ensure photo.path is absolute or construct it if relative
      // Adjust this if photo.path is stored as a relative path to your uploads folder
      const filePath = path.isAbsolute(photo.path)
        ? photo.path
        : path.resolve(__dirname, "..", photo.path);

      // Use fs.promises.unlink for awaitable unlink
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error("Failed to delete file:", err);
        // You can decide to continue or fail here. I continue.
      }
    }

    await Photo.deleteOne({ _id: req.params.id });
    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Error deleting photo:", err);
    res.status(500).json({ error: err.message });
  }
};

// Download from S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.downloadPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    if (photo.storage === "local") {
      // Serve local file
      return res.download(
        path.resolve(photo.path),
        photo.originalName || photo.filename
      );
    } else if (photo.storage === "s3") {
      // Stream from S3 and send as attachment
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: photo.filename,
      };

      const s3Stream = s3.getObject(params).createReadStream();

      s3Stream.on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: "Error downloading file from S3" });
      });

      res.attachment(photo.originalName || photo.filename);
      s3Stream.pipe(res);
    } else {
      res.status(400).json({ error: "Unknown storage type" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

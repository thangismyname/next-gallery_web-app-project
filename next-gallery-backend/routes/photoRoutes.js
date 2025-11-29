// next-gallery-backend/routes/photoRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const photoController = require("../controllers/photoController");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Allow HEIC / HEIF / images of all kinds
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/tiff",
      "image/heic",
      "image/heif",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type: " + file.mimetype));
    }

    cb(null, true);
  },
});

// ⚠️ IMPORTANT: Put /download BEFORE /:id
router.post("/", upload.single("photo"), photoController.uploadPhoto);
router.get("/", photoController.getAllPhotos);
router.get("/download/:id", photoController.downloadPhoto);
router.get("/:id", photoController.getPhotoById);
router.delete("/:id", photoController.deletePhoto);

module.exports = router;

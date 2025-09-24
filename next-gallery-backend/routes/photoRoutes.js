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

// Multer instance
const upload = multer({ storage });

// ✅ RESTful routes under /api/photos
router.post("/", upload.single("photo"), photoController.uploadPhoto);
router.get("/", photoController.getAllPhotos);
router.get("/:id", photoController.getPhotoById);
router.get("/download/:id", photoController.downloadPhoto);
router.delete("/:id", photoController.deletePhoto);

module.exports = router;

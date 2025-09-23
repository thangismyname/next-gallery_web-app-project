// next-gallery-backend/routes/photoRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const photoController = require("../controllers/photoController");
const upload = require("../middlewares/storage"); // Use your centralized multer config

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Routes
router.post("/upload", upload.single("photo"), photoController.uploadPhoto);
router.get("/photos", photoController.getAllPhotos);
router.get("/photos/:id", photoController.getPhotoById);
router.get("/photos/download/:id", photoController.downloadPhoto);
router.delete("/photos/:id", photoController.deletePhoto);

module.exports = router;

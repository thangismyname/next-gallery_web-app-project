const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const path = require("path");
const fs = require("fs");

// Check env variable early
const useS3 = process.env.USE_S3 === "true";

const localUploadPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(localUploadPath)) {
  fs.mkdirSync(localUploadPath);
}

// AWS S3 client (only initialize if needed)
let s3;
if (useS3) {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
}

// Local storage config
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, localUploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Conditionally create multer storage
const storage = useS3
  ? multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    })
  : localStorage;

const upload = multer({ storage });

module.exports = upload;

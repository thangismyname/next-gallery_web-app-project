const crypto = require("crypto");

exports.generateOtp = () => {
  // 6‑digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Store a hash of the OTP in DB (sha256)
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  return { otp, hashedOtp };
};

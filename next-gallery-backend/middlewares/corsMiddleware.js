const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173", // Vite React app origin
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);

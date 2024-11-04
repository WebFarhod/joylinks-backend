const multer = require("multer");
const path = require("path");

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/files")); // Specify the destination directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Name the file with a timestamp
  },
});

// File filter to allow various file types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip|rar|txt/; // Add more file types as needed
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Set up multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: fileFilter,
});

// Middleware function to handle file upload
const uploadFileMiddleware = (req, res, next) => {
  const uploadSingle = upload.single("file"); // 'file' is the field name expected in the form-data

  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      console.log(err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    // If everything is fine, proceed to the next middleware
    next();
  });
};

module.exports = uploadFileMiddleware;

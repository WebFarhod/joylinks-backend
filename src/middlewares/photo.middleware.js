const multer = require("multer");
const path = require("path");

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads/images"); // Specify the destination directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Name the file with a timestamp
  },
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Set up multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

// Middleware function to handle image upload
const uploadImageMiddleware = (req, res, next) => {
  console.log();

  const uploadSingle = upload.single("image"); // 'image' is the field name expected in the form-data

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

module.exports = uploadImageMiddleware;

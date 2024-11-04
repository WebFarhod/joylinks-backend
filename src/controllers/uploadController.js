// routes/uploadRoutes.js
const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");

// Set up storage engine for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.params;
    console.log(type, "scscs");

    const uploadPath = `./src/uploads/${type}`;
    cb(null, uploadPath); // Specify the destination directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Name the file with a timestamp
  },
});

// File filter to only allow certain file types (you can customize this)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only certain file types are allowed"), false);
  }
};

// Set up multer for different types of files
const upload = (type) =>
  multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: fileFilter,
  });

// Controller function for file upload
const uploadFile = (type) => async (req, res) => {
  console.log(req.file);

  const uploadSingle = await upload(type).single("file"); // 'type' is the field name expected in the form-data

  await uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(400).json({ error: err.message });
    }
    // If everything is fine, respond with success
    res.status(200).json({
      message: "File uploaded successfully!",
      file: req.file,
    });
  });
};

// Route for handling file uploads

// Route for retrieving files by filename

module.exports = { uploadFile };

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Set up storage engine for different file types
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const { type } = req.params;

//     // Define the upload path
//     const uploadPath = path.join(__dirname, "/src/uploads", type);

//     // Ensure the directory exists
//     fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist

//     cb(null, uploadPath); // Specify the destination directory for uploads
//   },
//   filename: (req, file, cb) => {
//     // Name the file with a timestamp
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // File filter to allow only specific file types
// const fileFilter = (req, file, cb) => {
//   const fileTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = fileTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only certain file types are allowed"), false);
//   }
// };

// // Set up multer for different types of files
// const upload = (type) =>
//   multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//     fileFilter: fileFilter,
//   }).single("file"); // 'file' is the expected field name in the form-data

// // Promisify the Multer upload process
// const uploadFile = (type) => async (req, res) => {
//   try {
//     // Create a promise-based version of the upload
//     const multerUpload = () =>
//       new Promise((resolve, reject) => {
//         const uploader = upload(type);
//         uploader(req, res, (err) => {
//           if (err) {
//             reject(err); // Reject the promise if an error occurs
//           } else {
//             resolve(); // Resolve the promise if successful
//           }
//         });
//       });

//     // Await the multer upload function
//     await multerUpload();

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // If everything is fine, respond with success
//     res.status(200).json({
//       message: "File uploaded successfully!",
//       file: req.file,
//     });
//   } catch (err) {
//     // Handle Multer-specific errors and other errors
//     res.status(400).json({ error: err.message });
//   }
// };

// module.exports = { uploadFile };

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.params;
    const uploadPath = path.join(__dirname, "../uploads", type);
    ensureDirExists(uploadPath); // Ensure upload folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Multer file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = allowedTypes.test(file.mimetype);
  isValidExt && isValidMime
    ? cb(null, true)
    : cb(new Error("Invalid file type"), false);
};

// Initialize Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter,
}).single("file"); // 'file' is the expected field name

// Handle file upload
const handleFileUpload = (req, res) => {
  const { type } = req.params;
  const allowedTypes = ["assigns", "questions", "banners", "files", "images"];

  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid upload type" });
  }

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = `/uploads/${type}/${req.file.filename}`;
    res.status(200).json({
      message: "File uploaded successfully!",
      file: {
        path: filePath,
      },
    });
  });
};

// Serve uploaded file
const serveFile = (req, res) => {
  const { type, filename } = req.params;
  const allowedTypes = ["assigns", "questions", "banners", "files", "images"];

  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  const filePath = path.join(__dirname, "../uploads", type, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(err.status || 500).json({ error: "File not found" });
    }
  });
};

module.exports = { handleFileUpload, serveFile };

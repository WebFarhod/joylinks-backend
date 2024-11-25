// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const { uploadFile } = require("../controllers/uploadController");
// const AuthMiddleware = require("../middlewares/auth.middleware");
// // const { authenticateToken } = require("../middlewares/auth.middleware");

// // Route for handling file uploads
// router.post("/:type", AuthMiddleware, (req, res) => {
//   const { type } = req.params;
//   console.log(req.params);

//   if (["assigns", "questions", "banners", "files", "images"].includes(type)) {
//     uploadFile(type)(req, res);
//   } else {
//     res.status(400).json({ error: "Invalid upload type" });
//   }
// });

// // Route for retrieving files by filename
// router.get("/:type/:filename", (req, res) => {
//   const { type, filename } = req.params;
//   if (["assigns", "questions", "banners", "files", "images"].includes(type)) {
//     const filePath = path.join(__dirname, "../../src/uploads", type, filename);
//     console.log(filePath);

//     res.sendFile(filePath, (err) => {
//       if (err) {
//         console.log(err);

//         res.status(err.status || 500).json({ error: "File not found" });
//       }
//     });
//   } else {
//     res.status(400).json({ error: "Invalid file type" });
//   }
// });

// module.exports = router;
////////////////////////////////////
const express = require("express");
const path = require("path");
const { uploadFile } = require("../controllers/uploadController");
const AuthMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Fayllarni yuklash uchun marshrut
router.post("/:type", AuthMiddleware, (req, res) => {
  const { type } = req.params;

  if (["assigns", "questions", "banners", "files", "images"].includes(type)) {
    uploadFile(type)(req, res);
  } else {
    res.status(400).json({ error: "Invalid upload type" });
  }
});

// Fayllarni yuklab olish uchun marshrut
router.get("/:type/:filename", (req, res) => {
  const { type, filename } = req.params;

  if (["assigns", "questions", "banners", "files", "images"].includes(type)) {
    const filePath = path.join(__dirname, "../../src/uploads", type, filename);

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(err.status || 500).json({ error: "File not found" });
      }
    });
  } else {
    res.status(400).json({ error: "Invalid file type" });
  }
});

module.exports = router;

////////////////////////////////////////////////////////////////////

// const express = require("express");
// const router = express.Router();
// const {
//   handleFileUpload,
//   serveFile,
// } = require("../controllers/uploadController");
// const AuthMiddleware = require("../middlewares/auth.middleware");

// // File upload route
// router.post("/:type", AuthMiddleware, handleFileUpload);

// // File serve route
// router.get("/:type/:filename", serveFile);

// module.exports = router;

/////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload operations
 */

/**
 * @swagger
 * /upload/{type}:
 *   post:
 *     summary: Uploads a file (assigns, questions, banners, images, or general files)
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [assigns, questions, banners, files, images]
 *         description: The type of file to upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully!
 *                 file:
 *                   type: object
 *                   properties:
 *                     fieldname:
 *                       type: string
 *                       example: file
 *                     originalname:
 *                       type: string
 *                       example: example.jpg
 *                     encoding:
 *                       type: string
 *                       example: 7bit
 *                     mimetype:
 *                       type: string
 *                       example: image/jpeg
 *                     destination:
 *                       type: string
 *                       example: ./src/uploads/assigns
 *                     filename:
 *                       type: string
 *                       example: 1633026780123-example.jpg
 *                     path:
 *                       type: string
 *                       example: ./src/uploads/assigns/1633026780123-example.jpg
 *                     size:
 *                       type: integer
 *                       example: 102400
 *       400:
 *         description: Error uploading file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Only certain file types are allowed
 */

/**
 * @swagger
 * /upload/{type}/{filename}:
 *   get:
 *     summary: Retrieve a file by filename (assigns, questions, banners, images, or general files)
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [assigns, questions, banners, files, images]
 *         description: The type of file to retrieve
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to retrieve
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: File not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

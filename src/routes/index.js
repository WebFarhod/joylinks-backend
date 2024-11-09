const express = require("express");
const categoryRoutes = require("./category.routes");
const roleRoutes = require("./role.routes");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const courseRoutes = require("./course.routes");
const questionRoutes = require("./question.routes");
const lessonRoutes = require("./lesson.routes");
const reviewRoutes = require("./review.routes");
const studentCourseRoutes = require("./studentCourse.routes");
const assignRoutes = require("./assign.routes");
const notificationRoutes = require("./notification.routes");
const quizRoutes = require("./quiz.routes");
const quizquestionsRoutes = require("./quizQuestion.routes");
const bannerRoutes = require("./banner.routes");
const moduleRoutes = require("./module.routes");
const districtRoutes = require("./district.routes");
const { uploadvideo } = require("../controllers/video.controller");
const upload = require("../middlewares/uploadVideoConfig");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");
const { getStatisAllData } = require("../controllers/statisConroller");
const uploadRoutes = require("./uploadRoutes");
const resultsRoutes = require("./result.routes");
const orderRoutes = require("./order.routes");
// const transactionRouter = require("./transaction");
const paymentRoutes = require("./payment.routes");
const dashbordRoutes = require("./dashbord.routes.js");

const router = express.Router();

router.use("/categories", categoryRoutes);
router.use("/roles", roleRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/questions", questionRoutes);
router.use("/lessons", lessonRoutes);
router.use("/modules", moduleRoutes);
router.use("/reviews", reviewRoutes);
router.use("/studentcourses", studentCourseRoutes);
router.use("/assigns", assignRoutes);
router.use("/notifications", notificationRoutes);
router.use("/quizzes", quizRoutes);
router.use("/quiz-questions", quizquestionsRoutes);
router.use("/banners", bannerRoutes);
router.use("/districts", districtRoutes);
router.use("/statistics", getStatisAllData);
router.use("/upload", uploadRoutes);
router.use("/results", resultsRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/dashbord", dashbordRoutes);
router.use(
  "/videos",
  authenticateToken,
  checkRole(["admin", "mentor", "teacher"]),
  upload.single("video"),
  uploadvideo
);
// router.use("/payments/click", transactionRouter);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: API for uploading videos
 */

/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Upload a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: The video file to upload
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the video was uploaded successfully
 *                 message:
 *                   type: string
 *                   description: A message confirming the upload
 *                 videoUrl:
 *                   type: string
 *                   description: The URL of the uploaded video
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Forbidden. You do not have permission to upload videos.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /src/uploads/files/{filename}:
 *   get:
 *     summary: Get an image by file path
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the image to retrieve, including extension
 *         example: 1725350925380-7294791.jg.jpg
 *     responses:
 *       200:
 *         description: Image retrieved successfully
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 *       500:
 *         description: Failed to retrieve image
 */

/**
 * @swagger
 * /Allstatistics:
 *   get:
 *     summary: Retrieve platform statistics
 *     description: Fetch the total number of students, video lessons, tests, and courses from the platform.
 *     tags:
 *       - Statistics
 *     responses:
 *       200:
 *         description: Successfully retrieved the platform statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: integer
 *                   description: Total number of students
 *                   example: 204891
 *                 videos:
 *                   type: integer
 *                   description: Total number of video lessons
 *                   example: 5149
 *                 tests:
 *                   type: integer
 *                   description: Total number of tests
 *                   example: 82121
 *                 courses:
 *                   type: integer
 *                   description: Total number of courses
 *                   example: 62
 *       500:
 *         description: Failed to fetch statistics due to a server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Failed to fetch statistics
 */

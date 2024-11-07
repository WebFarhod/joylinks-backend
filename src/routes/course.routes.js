const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");

// Create a new course
router.post(
  "/",
  authenticateToken,
  checkRole(["admin", "mentor", "teacher"]),
  courseController.createCourse
);

// Get all public courses with query filters
router.get(
  "/public",
  (req, res, next) => {
    next();
  },
  courseController.getPublicCourses
);

// Admin API routes to get courses
router.get(
  "/admin",
  authenticateToken,
  checkRole(["admin", "mentor", "teacher"]),
  courseController.getAdminCourses
);

// Get a course by ID
router.get("/:id", courseController.getCourseById);

// Get course by ID along with statistics
router.get("/:id/statistics", courseController.getCourseByIdWithStatistics);

// Get statistics for all courses
router.get("/statistics", courseController.getStatistics);

// Update a course by ID
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin", "mentor", "teacher"]),
  courseController.updateCourseById
);

// Delete a course by ID
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  courseController.deleteCourseById
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - category_id
 *         - name
 *         - description
 *         - teacher_id
 *         - price
 *         - duration
 *         - level
 *         - mentor_id
 *         - image
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the course
 *         category_id:
 *           type: string
 *           description: The ID of the category
 *         name:
 *           type: string
 *           description: The name of the course
 *         description:
 *           type: string
 *           description: Course description
 *         teacher_id:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of teachers
 *         price:
 *           type: number
 *           description: Course price
 *         duration:
 *           type: string
 *           description: Duration in "HH:MM:SS" format
 *         is_top:
 *           type: boolean
 *           description: is course top
 *         level:
 *           type: string
 *           enum:
 *             - beginner
 *             - intermediate
 *             - advanced
 *           description: Course difficulty level
 *         mentor_id:
 *           type: string
 *           description: Mentor's ID
 *         image:
 *           type: string
 *           format: binary
 *           description: Course image
 *       example:
 *         id: 60d5f481e55c0c3b19f7d383
 *         category_id: 60d5f481e55c0c3b19f7d382
 *         name: Advanced Node.js
 *         description: A deep dive into Node.js for advanced learners.
 *         teacher_id: [60d5f481e55c0c3b19f7d380]
 *         price: 299
 *         duration: "04:00:00"
 *         level: advanced
 *         mentor_id: 60d5f481e55c0c3b19f7d381
 *         is_top: true
 *         image: null
 *     CourseStatistics:
 *       type: object
 *       properties:
 *         totalCourses:
 *           type: integer
 *           description: Total number of courses
 *         averagePrice:
 *           type: number
 *           description: Average price of all courses
 *         maxPrice:
 *           type: number
 *           description: Highest course price
 *         minPrice:
 *           type: number
 *           description: Lowest course price
 *         totalDuration:
 *           type: string
 *           description: Total duration of all courses
 *         averageDuration:
 *           type: string
 *           description: Average course duration
 *       example:
 *         totalCourses: 10
 *         averagePrice: 150.0
 *         maxPrice: 500.0
 *         minPrice: 50.0
 *         totalDuration: "100:00:00"
 *         averageDuration: "10:00:00"
 *
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - name
 *               - description
 *               - teacher_id
 *               - price
 *               - duration
 *               - level
 *               - mentor_id
 *             properties:
 *               category_id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               teacher_id:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               mentor_id:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /courses/public:
 *   get:
 *     summary: Get all public courses with query filters
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter courses by category
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum:
 *             - beginner
 *             - intermediate
 *             - advanced
 *         description: Filter by course level
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: string
 *           format: time
 *         description: Minimum course duration (TIME format)
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: string
 *           format: time
 *         description: Maximum course duration (TIME format)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: Minimum course price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: Maximum course price
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search courses by name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Courses per page
 *       - in: query
 *         name: is_top
 *         schema:
 *           type: boolean
 *           default: false
 *         description: top courses
 *     responses:
 *       200:
 *         description: List of public courses with filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /courses/admin:
 *   get:
 *     summary: Get all courses for admin
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: is_top
 *         schema:
 *           type: boolean
 *         description: top courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all courses for admin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{id}/statistics:
 *   get:
 *     summary: Get course statistics by course ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Course statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseStatistics'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /courses/statistics:
 *   get:
 *     summary: Get statistics for all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseStatistics'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */

const express = require("express");
const router = express.Router();
const studentCourseController = require("../controllers/studentCourse.controller");
// const { authenticateToken } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");
const { authenticateToken } = require("../middlewares/auth.middleware");
const AdminMiddleware = require("../middlewares/admin.middleware");
const AuthMiddleware = require("../middlewares/auth.middleware");
const RoleMiddleware = require("../middlewares/role.middleware");
const UserMiddleware = require("../middlewares/user.middleware");

router.post("/", AdminMiddleware, studentCourseController.createEnrollment);
router.post(
  "/buy",
  RoleMiddleware("student"),
  // UserMiddleware,
  studentCourseController.buyCourse
);

router.get("/", AdminMiddleware, studentCourseController.getAllEnrollments);

router.get("/mycourses", AuthMiddleware, studentCourseController.getMyCourse);

router.get("/:id", studentCourseController.getEnrollmentById);

router.get(
  "/bystudentid/:id",
  AdminMiddleware,
  studentCourseController.getEnrollmentsByStudentId
);

router.get(
  "/bycourseid/:id",
  AdminMiddleware,
  studentCourseController.getEnrollmentsByCourseId
);

router.put(
  "/:id",
  AdminMiddleware,
  studentCourseController.updateEnrollmentById
);

router.delete(
  "/:id",
  AdminMiddleware,
  studentCourseController.deleteEnrollmentById
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: StudentCourses
 *   description: API for managing student course enrollments
 */

/**
 * @swagger
 * /studentcourses:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [StudentCourses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentCourse'
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentCourse'
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /studentcourses:
 *   get:
 *     summary: Retrieve all student course enrollments
 *     tags: [StudentCourses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page of enrollments to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of enrollments to retrieve per page
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *           description: Filter enrollments by active status (true for active, false for inactive)
 *     responses:
 *       200:
 *         description: A list of student course enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of enrollments
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentCourse'
 *       500:
 *         description: Internal server error. An unexpected error occurred.
 */

/**
 * @swagger
 * /studentcourses/{id}:
 *   get:
 *     summary: Get a student course enrollment by ID
 *     description: Retrieve a specific student course enrollment by ID, including all courses and a count of those courses.
 *     tags: [StudentCourses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the enrollment
 *     responses:
 *       200:
 *         description: Student course enrollment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_id:
 *                   type: string
 *                   description: The unique identifier of the student
 *                 student:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the student
 *                     phone:
 *                       type: string
 *                       description: The student's phone number
 *                     role:
 *                       type: string
 *                       description: The student's role
 *                     active:
 *                       type: boolean
 *                       description: Whether the student is active
 *                     photo:
 *                       type: string
 *                       description: The URL of the student's photo
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the course
 *                       name:
 *                         type: string
 *                         description: The name of the course
 *                       description:
 *                         type: string
 *                         description: The description of the course
 *                 count:
 *                   type: integer
 *                   description: The number of courses the student is enrolled in
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /studentcourses/bycourseid/{id}:
 *   get:
 *     summary: Get enrollments by course ID
 *     description: Retrieve all student enrollments for a specific course by its ID.
 *     tags: [StudentCourses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the course
 *     responses:
 *       200:
 *         description: Successfully retrieved enrollments for the course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the student
 *                       name:
 *                         type: string
 *                         description: The name of the student
 *                       description:
 *                         type: string
 *                         description: The description of the student
 *                       phone:
 *                         type: string
 *                         description: The phone of the student
 *                       photo:
 *                         type: string
 *                         description: The photo of the student
 *                   progress:
 *                     type: string
 *                     description: The progress of the student in the course
 *                   completed:
 *                     type: boolean
 *                     description: Whether the student has completed the course
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /studentcourses/bystudentid/{id}:
 *   get:
 *     summary: Get enrollments by student ID
 *     description: Retrieve all course enrollments for a specific student by their ID.
 *     tags: [StudentCourses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the student
 *     responses:
 *       200:
 *         description: Successfully retrieved enrollments for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   course:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the course
 *                       name:
 *                         type: string
 *                         description: The name of the course
 *                       description:
 *                         type: string
 *                         description: The description of the course
 *                   progress:
 *                     type: string
 *                     description: The progress of the student in the course
 *                   completed:
 *                     type: boolean
 *                     description: Whether the student has completed the course
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /studentcourses/mycourses:
 *   get:
 *     summary: Get enrolled courses for the current user
 *     description: Retrieve all courses that the current user is enrolled in.
 *     tags: [StudentCourses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved enrollments for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the enrollment record
 *                   course:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the course
 *                       name:
 *                         type: string
 *                         description: The name of the course
 *                       photo:
 *                         type: string
 *                         description: The URL of the course photo
 *                       completed:
 *                         type: boolean
 *                         description: Whether the student has completed the course
 *                       progress:
 *                         type: number
 *                         description: The progress percentage of the student in the course
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /studentcourses/{id}:
 *   put:
 *     summary: Update an enrollment by ID
 *     tags: [StudentCourses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentCourse'
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentCourse'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Enrollment not found
 */

/**
 * @swagger
 * /studentcourses/{id}:
 *   delete:
 *     summary: Delete an enrollment by ID
 *     tags: [StudentCourses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       404:
 *         description: Enrollment not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentCourse:
 *       type: object
 *       required:
 *         - course_id
 *         - student_id
 *         - progress
 *         - completed
 *       properties:
 *         course_id:
 *           type: string
 *           description: The ID of the related course
 *         student_id:
 *           type: string
 *           description: The ID of the student
 */

const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

// Create a new quiz
router.post("/", authenticateToken, quizController.createQuiz);

// Get all quizzes with optional pagination and filtering
router.get("/", authenticateToken, quizController.getQuizzes);

// Get a quiz by ID
router.get("/:id", authenticateToken, quizController.getQuizById);

// Update a quiz by ID
router.put("/:id", authenticateToken, quizController.updateQuizById);

// Delete a quiz by ID
router.delete("/:id", authenticateToken, quizController.deleteQuizById);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       required:
 *         - teacher_id
 *         - mark
 *         - module_id
 *         - lesson_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the quiz
 *         teacher_id:
 *           type: string
 *           description: The ID of the teacher who created the quiz
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of question IDs associated with the quiz
 *         module_id:
 *           type: string
 *           description: The ID of the module associated with the quiz
 *         mark:
 *           type: number
 *           description: The total mark for the quiz
 *         lesson_id:
 *           type: string
 *           description: The ID of the lesson associated with the quiz
 *         is_active:
 *           type: boolean
 *           description: Indicates if the quiz is active
 *           example: true
 */

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Retrieve a list of quizzes with optional filters
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of quizzes per page
 *       - in: query
 *         name: teacher_id
 *         schema:
 *           type: string
 *         description: Filter quizzes by teacher ID
 *       - in: query
 *         name: lesson_id
 *         schema:
 *           type: string
 *         description: Filter quizzes by lesson ID
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter quizzes by their active status
 *     responses:
 *       200:
 *         description: List of quizzes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of quizzes
 *                 page:
 *                   type: integer
 *                   description: The current page number
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The quiz ID
 *     responses:
 *       200:
 *         description: The quiz with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 */

/**
 * @swagger
 * /quizzes/{id}:
 *   put:
 *     summary: Update a quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       200:
 *         description: The quiz was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Quiz, Module, or Lesson not found
 */

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The quiz ID
 *     responses:
 *       200:
 *         description: The quiz was successfully deleted
 *       404:
 *         description: Quiz not found
 */

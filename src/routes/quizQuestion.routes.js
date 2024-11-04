const express = require("express");
const router = express.Router();
const quizQuestionController = require("../controllers/quizQuestion.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

// Create a new quiz question
router.post("/", authenticateToken, quizQuestionController.createQuizQuestion);

// Get all quiz questions
router.get("/", quizQuestionController.getQuizQuestions);

// Get a quiz question by ID
router.get(
  "/:id",
  authenticateToken,
  quizQuestionController.getQuizQuestionById
);

// Update a quiz question by ID
router.put(
  "/:id",
  authenticateToken,
  quizQuestionController.updateQuizQuestionById
);

// Delete a quiz question by ID
router.delete(
  "/:id",
  authenticateToken,
  quizQuestionController.deleteQuizQuestionById
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizQuestion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the quiz question
 *         questionText:
 *           type: string
 *           description: The text of the quiz question
 *         answers:
 *           type: string
 *           description: The correct answer(s) for the quiz question
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of possible answer options
 *         is_active:
 *           type: boolean
 *           description: Indicates if the quiz question is active
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the quiz question was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the quiz question was last updated
 *     QuizQuestionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *         question:
 *           $ref: '#/components/schemas/QuizQuestion'
 */

/**
 * @swagger
 * /quiz-questions:
 *   post:
 *     summary: Create a new quiz question
 *     tags: [Quiz Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizQuestion'
 *     responses:
 *       201:
 *         description: Quiz question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizQuestionResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /quiz-questions:
 *   get:
 *     summary: Retrieve all quiz questions
 *     tags: [Quiz Questions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of quiz questions to retrieve per page
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: A list of quiz questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of quiz questions
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizQuestion'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /quiz-questions/{id}:
 *   get:
 *     summary: Retrieve a quiz question by ID
 *     tags: [Quiz Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the quiz question to retrieve
 *     responses:
 *       200:
 *         description: A quiz question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizQuestion'
 *       404:
 *         description: Quiz question not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /quiz-questions/{id}:
 *   put:
 *     summary: Update a quiz question by ID
 *     tags: [Quiz Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the quiz question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizQuestion'
 *     responses:
 *       200:
 *         description: Quiz question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizQuestion'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Quiz question not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /quiz-questions/{id}:
 *   delete:
 *     summary: Delete a quiz question by ID
 *     tags: [Quiz Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the quiz question to delete
 *     responses:
 *       200:
 *         description: Quiz question deleted successfully
 *       404:
 *         description: Quiz question not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizQuestion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         questionText:
 *           type: string
 *         answers:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     QuizQuestionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         question:
 *           $ref: '#/components/schemas/QuizQuestion'
 */

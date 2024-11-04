const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");

router.post(
  "/",
  authenticateToken,
  checkRole(["admin", "student"]),
  questionController.createQuestion
);
router.post(
  "/:questionId/reply",
  authenticateToken,
  checkRole(["mentor"]),
  questionController.replyToQuestion
);
router.get("/", questionController.getQuestions);
router.get("/:id", questionController.getQuestionById);
router.put("/:id", questionController.updateQuestionById);
router.delete("/:id", questionController.deleteQuestionById);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - course
 *         - lesson
 *         - student_id
 *         - text
 *         - is_active
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the question
 *         course:
 *           type: string
 *           description: The ID of the course associated with the question
 *         lesson:
 *           type: string
 *           description: The ID of the lesson associated with the question
 *         mentor_id:
 *           type: string
 *           description: The ID of the mentor who asked the question
 *         text:
 *           type: string
 *           description: The text of the question
 *         file:
 *           type: string
 *           description: The file associated with the question
 *         is_active:
 *           type: boolean
 *           description: Indicates if the question is active
 *           example: true
 */

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management API
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /questions/{questionId}/reply:
 *   post:
 *     summary: Reply to a student's question
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question to reply to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The reply text
 *                 example: "This is the mentor's reply to the question."
 *     responses:
 *       200:
 *         description: Reply added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reply added successfully"
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       403:
 *         description: You are not authorized to reply to this question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to reply to this question"
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Retrieve a list of questions with optional filters
 *     tags: [Questions]
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
 *         description: The number of questions per page
 *       - in: query
 *         name: mentor_id
 *         schema:
 *           type: string
 *         description: Filter questions by mentor ID
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: string
 *         description: Filter questions by course ID
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter questions by their active status
 *     responses:
 *       200:
 *         description: List of questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: The current page number
 *                 limit:
 *                   type: integer
 *                   description: The number of questions per page
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question to retrieve
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Update a question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question to delete
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 */

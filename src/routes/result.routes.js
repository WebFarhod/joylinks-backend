const express = require("express");
let router = express.Router();
const {
  submitAssignment,
  gradeAssignment,
  submitQuiz,
} = require("../controllers/result.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

// Route for students to submit an assignment
router.post("/assigns/:assign_id/submit", authenticateToken, submitAssignment);

// Route for teachers to grade an assignment
router.put(
  "/assign-results/:result_id/grade",
  authenticateToken,
  gradeAssignment
);

// Route for students to submit a quiz
router.post(
  "/quizes/:quiz_id/submit",
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  authenticateToken,
  submitQuiz
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: API for handling assignment and quiz results
 */

/**
 * @swagger
 * /results/assigns/{assign_id}/submit:
 *   post:
 *     summary: Submit an assignment
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: assign_id
 *         in: path
 *         required: true
 *         description: ID of the assignment being submitted
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileUrl:
 *                 type: string
 *                 description: The URL of the submitted assignment file
 *             required:
 *               - fileUrl
 *     responses:
 *       201:
 *         description: Assignment submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/AssignResult'
 *       400:
 *         description: Bad request, validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /results/assign-results/{result_id}/grade:
 *   put:
 *     summary: Grade an assignment
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: result_id
 *         in: path
 *         required: true
 *         description: ID of the submitted assignment result
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mark:
 *                 type: number
 *                 description: The mark given by the teacher
 *               feedback:
 *                 type: string
 *                 description: Optional feedback provided by the teacher
 *             required:
 *               - mark
 *     responses:
 *       200:
 *         description: Assignment graded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/AssignResult'
 *       400:
 *         description: Bad request, validation error
 *       404:
 *         description: Assignment result not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /results/quizes/{quiz_id}/submit:
 *   post:
 *     summary: Submit a quiz
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: quiz_id
 *         in: path
 *         required: true
 *         description: ID of the quiz being submitted
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 description: The ID of the student submitting the quiz
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: string
 *                       description: The ID of the quiz question
 *                     selectedOption:
 *                       type: string
 *                       description: The option selected by the student (A, B, C, etc.)
 *                       example: 'A'
 *                 required:
 *             required:
 *               - answers
 *     responses:
 *       201:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quiz submitted successfully"
 *                 score:
 *                   type: number
 *                   description: The total number of correct answers
 *                 totalQuestions:
 *                   type: number
 *                   description: The total number of quiz questions
 *                 percentage:
 *                   type: string
 *                   description: The percentage score rounded to two decimal places
 *                   example: "80.00"
 *                 result:
 *                   $ref: '#/components/schemas/QuizResult'
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question ID {question_id} does not belong to the quiz {quiz_id}"
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
 * components:
 *   schemas:
 *     AssignResult:
 *       type: object
 *       properties:
 *         assign_id:
 *           type: string
 *           description: The ID of the assignment
 *         student_id:
 *           type: string
 *           description: The ID of the student
 *         fileUrl:
 *           type: string
 *           description: The URL of the submitted assignment file
 *         mark:
 *           type: number
 *           description: The mark given by the teacher
 *         feedback:
 *           type: string
 *           description: Teacher's feedback
 *         submitted_at:
 *           type: string
 *           format: date-time
 *           description: Submission timestamp
 *     QuizResult:
 *       type: object
 *       properties:
 *         quiz_id:
 *           type: string
 *           description: The ID of the quiz
 *         student_id:
 *           type: string
 *           description: The ID of the student
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: string
 *                 description: The ID of the quiz question
 *               selectedOption:
 *                 type: string
 *                 description: The option selected by the student (A, B, C, etc.)
 *         mark:
 *           type: number
 *           description: The calculated percentage score of the quiz
 *         submitted_at:
 *           type: string
 *           format: date-time
 *           description: Submission timestamp
 */

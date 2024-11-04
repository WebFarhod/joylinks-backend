const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

router.post("/", authenticateToken, reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.put("/:id", authenticateToken, reviewController.updateReviewById);
router.delete("/:id", authenticateToken, reviewController.deleteReviewById);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - course_id
 *         - lesson_id
 *         - comment
 *         - rating
 *         - student_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the review
 *         course_id:
 *           type: string
 *           description: The ID of the related course
 *         lesson_id:
 *           type: string
 *           description: The ID of the related lesson
 *         comment:
 *           type: string
 *           description: The content of the review
 *         rating:
 *           type: integer
 *           description: The rating given to the course (1-5)
 *           minimum: 1
 *           maximum: 5
 *         student_id:
 *           type: string
 *           description: The ID of the student who made the review
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the review was created
 *         is_active:
 *           type: boolean
 *           description: Indicates whether the review is active
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: string
 *                 description: The ID of the course
 *               lesson_id:
 *                 type: string
 *                 description: The ID of the lesson
 *               comment:
 *                 type: string
 *                 description: The content of the review
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               student_id:
 *                 type: string
 *                 description: The ID of the student (if not provided, it will be the authenticated user)
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: string
 *         description: Filter reviews by course ID
 *       - in: query
 *         name: lesson_id
 *         schema:
 *           type: string
 *         description: Filter reviews by lesson ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of reviews per page
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: Current page
 *                 limit:
 *                   type: integer
 *                   description: Number of reviews per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the review to retrieve
 *     responses:
 *       200:
 *         description: The review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Review not found
 */

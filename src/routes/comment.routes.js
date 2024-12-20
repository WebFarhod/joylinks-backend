const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const UserMiddleware = require("../middlewares/user.middleware");
const AuthMiddleware = require("../middlewares/auth.middleware");
const AdminMiddleware = require("../middlewares/admin.middleware");
const RoleMiddleware = require("../middlewares/role.middleware");

router.post("/add", AuthMiddleware, commentController.addComment);

router.get("/", UserMiddleware, commentController.getCommentsForCourse);

router.put(
  "/:commentId/approve",
  RoleMiddleware(["admin", "teacher", "mentor"]),
  commentController.approveComment
);

router.put(
  "/:commentId/read",
  RoleMiddleware(["admin", "teacher", "mentor"]),
  commentController.readComment
);

router.delete(
  "/:commentId",
  RoleMiddleware(["admin", "teacher", "mentor"]),
  commentController.deleteComment
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management operations
 */

/**
 * @swagger
 * /comments/add:
 *   post:
 *     summary: Add a new comment to a course
 *     description: Allows users to add a new comment to a specific course.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - text
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course
 *                 example: '12345'
 *               text:
 *                 type: string
 *                 description: The content of the comment
 *                 example: 'This course is very helpful!'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Retrieve all comments for a specific course
 *     description: Fetch all approved comments for a given course.
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: The ID of the course
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
 *         description: The number of users to return per page
 *     responses:
 *       200:
 *         description: Successfully fetched comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: No comments found for this course
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comments/{commentId}/approve:
 *   put:
 *     summary: Admin approves a comment
 *     description: Allows admins to approve a comment, making it visible to users.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to be approved
 *     responses:
 *       200:
 *         description: Comment approved successfully
 *       403:
 *         description: Unauthorized. Only admins can approve comments
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comments/{commentId}/read:
 *   put:
 *     summary: Admin read a comment
 *     description: Allows admins to read a comment, making it visible to users.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to be read
 *     responses:
 *       200:
 *         description: Comment read successfully
 *       403:
 *         description: Unauthorized. Only admins can read comments
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Allows users (or admins) to delete a specific comment.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Unauthorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the comment
 *         courseId:
 *           type: string
 *           description: The ID of the course associated with the comment
 *         text:
 *           type: string
 *           description: The content of the comment
 *         userId:
 *           type: string
 *           description: The ID of the user who made the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was last updated
 *         status:
 *           type: string
 *           description: The approval status of the comment (approved, pending, rejected)
 *           example: 'approved'
 *         isRead:
 *           type: boolean
 *           description: Whether the comment has been read
 *           example: false
 */

const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lesson.controller");
const RoleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/",
  RoleMiddleware(["admin", "teacher"]),
  lessonController.createLesson
);

router.get(
  "/",
  RoleMiddleware(["admin", "teacher", "mentor"]),
  lessonController.getLessons
);

router.get(
  "/:id",
  RoleMiddleware(["admin", "teacher", "mentor"]),
  lessonController.getLessonById
);

router.put(
  "/:id",
  RoleMiddleware(["admin", "teacher"]),
  lessonController.updateLessonById
);

router.delete(
  "/:id",
  RoleMiddleware(["admin", "teacher"]),
  lessonController.deleteLessonById
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       required:
 *         - name
 *         - video_link
 *         - module_id
 *         - is_active
 *       properties:
 *         id:
 *         name:
 *           type: string
 *           description: The name of the lesson
 *         video_link:
 *           type: array
 *           items:
 *             type: string
 *           description: The URLs of the videos
 *         materials:
 *           type: array
 *           items:
 *             type: string
 *           description: The URLs of the materials
 *         module_id:
 *           type: string
 *           description: The ID of the associated module
 *         is_active:
 *           type: boolean
 *           description: Indicates if the lesson is active
 *         passed:
 *           type: boolean
 *           description: Indicates if the lesson has been passed
 *       example:
 *         id: 60d5f481e55c0c3b19f7d384
 *         name: Introduction to Programming
 *         sequence: 1
 *         video_link: ["https://example.com/video.mp4", "https://www.youtube.com/watch?v=7YDdfIeeJTU"]
 *         materials: ["https://example.com/material.pdf", "https://example.com/another-material.pdf"]
 *         duration: 1200
 *         module_id: 60d5f481e55c0c3b19f7d383
 *         is_active: true
 *         passed: false
 */

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: API for managing lessons
 */

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       201:
 *         description: Lesson successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Bad request. Invalid input.
 */

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Retrieve all lessons with optional filters
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *         description: Filter by module ID
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
 *         description: Number of lessons per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of lessons with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 lessons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Retrieve a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the lesson
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lesson details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Update a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lesson successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Bad request. Invalid input.
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Delete a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the lesson
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lesson successfully deleted
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */

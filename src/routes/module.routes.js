const express = require("express");
const router = express.Router();
const moduleController = require("../controllers/module.controller");
const RoleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/",
  RoleMiddleware(["admin", "teacher"]),
  moduleController.createModule
);

router.get(
  "/",
  RoleMiddleware(["admin", "teacher", "mentor"]),
  moduleController.getModules
);

router.get(
  "/:id",
  RoleMiddleware(["admin", "teacher", "mentor"]),
  moduleController.getModuleById
);

router.put(
  "/:id",
  RoleMiddleware(["admin", "teacher"]),
  moduleController.updateModuleById
);

router.delete(
  "/:id",
  RoleMiddleware(["admin", "teacher"]),
  moduleController.deleteModuleById
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required:
 *         - course_id
 *         - name
 *         - sequence
 *       properties:
 *         course_id:
 *           type: string
 *           description: The ID of the associated course
 *         name:
 *           type: string
 *           description: The name of the module
 *         sequence:
 *           type: integer
 *           description: The sequence of the module within the course
 *       example:
 *         course_id: 60d5f481e55c0c3b19f7d382
 *         name: Introduction
 *         sequence: 1
 */

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: API for managing modules
 */

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a new module
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Module'
 *     responses:
 *       201:
 *         description: Module successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       400:
 *         description: Bad request. Invalid input.
 */

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Retrieve all modules with pagination, filtering by course ID, and include lessons
 *     tags: [Modules]
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
 *         description: The number of modules per page
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter modules by course ID
 *     responses:
 *       200:
 *         description: List of modules with pagination, filtering by course ID, and included lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 totalModules:
 *                   type: integer
 *                   description: The total number of modules found
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the module
 *                       name:
 *                         type: string
 *                         description: The name of the module
 *                       sequence:
 *                         type: integer
 *                         description: The sequence number of the module
 *                       is_active:
 *                         type: boolean
 *                         description: Whether the module is active
 *                       lessons:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: The ID of the lesson
 *                             name:
 *                               type: string
 *                               description: The name of the lesson
 *                             sequence:
 *                               type: integer
 *                               description: The sequence number of the lesson
 *                             video_link:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               description: URLs for the lesson video
 *                             materials:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               description: Materials related to the lesson
 *                             is_active:
 *                               type: boolean
 *                               description: Whether the lesson is active
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /modules/{id}:
 *   get:
 *     summary: Retrieve a module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the module
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Module details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Update a module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Module'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Module successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       400:
 *         description: Bad request. Invalid input.
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Delete a module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the module
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Module successfully deleted
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */

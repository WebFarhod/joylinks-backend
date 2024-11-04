const express = require("express");
const router = express.Router();
const assignController = require("../controllers/assign.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const uploadFileMiddleware = require("../middlewares/file.middleware");

// Create assignment
router.post("/", assignController.createAssign);

// Get all assignments
router.get("/", assignController.getAllAssigns);

// Get assignment by ID
router.get("/:id", assignController.getAssignById);

// Update assignment by ID
router.put("/:id", assignController.updateAssignById);

// Delete assignment by ID
router.delete("/:id", assignController.deleteAssignById);



module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       properties:
 *         module_id:
 *           type: string
 *           description: ID of the module associated with the assignment
 *           example: "66b7630e0f59666fbef15be2"
 *         teacher_id:
 *           type: string
 *           description: ID of the teacher who created the assignment
 *           example: "66b7630e0f59666fbef15be3"
 *         name:
 *           type: string
 *           description: Name of the assignment
 *           example: "Final Project"
 *         description:
 *           type: string
 *           description: Detailed description of the assignment
 *           example: "Complete the final project based on the course requirements."
 *         fileUrl:
 *           type: string
 *           description: URL or path to the assignment file (if any)
 *           example: "/uploads/files/assignment1.pdf"
 *         mark:
 *           type: integer
 *           description: Maximum mark that can be awarded for the assignment
 *           example: 100
 *         dueTime:
 *           type: string
 *           format: date-time
 *           description: Due date and time for the assignment
 *           example: "2024-09-01T12:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment management
 */

/**
 * @swagger
 * /assigns:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       400:
 *         description: Bad request, invalid input or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All required fields must be provided."
 */

/**
 * @swagger
 * /assigns:
 *   get:
 *     summary: Get all assignments with optional filters
 *     tags: [Assignments]
 *     parameters:
 *       - in: query
 *         name: module_id
 *         schema:
 *           type: string
 *         description: Filter assignments by module ID
 *       - in: query
 *         name: teacher_id
 *         schema:
 *           type: string
 *         description: Filter assignments by teacher ID
 *       - in: query
 *         name: lesson_id
 *         schema:
 *           type: string
 *         description: Filter assignments by lesson ID
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
 *         description: Number of items per page for pagination
 *     responses:
 *       200:
 *         description: List of assignments, with optional filters applied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of assignments
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: No assignments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No assignments found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error message."
 */


/**
 * @swagger
 * /assigns/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The assignment ID
 *     responses:
 *       200:
 *         description: Assignment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assignment not found."
 */

/**
 * @swagger
 * /assigns/{id}:
 *   put:
 *     summary: Update assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input."
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assignment not found."
 */

/**
 * @swagger
 * /assigns/{id}:
 *   delete:
 *     summary: Delete assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The assignment ID
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assignment deleted successfully."
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Assignment not found."
 */

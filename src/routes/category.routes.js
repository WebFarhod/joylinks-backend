const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const AdminMiddleware = require("../middlewares/role.middleware");
const UserMiddleware = require("../middlewares/user.middleware");

router.post("/", AdminMiddleware, categoryController.createCategory);

router.get("/", UserMiddleware, categoryController.getCategories);

router.get("/:id", UserMiddleware, categoryController.getCategoryById);

router.put("/:id", AdminMiddleware, categoryController.updateCategory);

router.delete("/:id", AdminMiddleware, categoryController.deleteCategory);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category
 *         is_active:
 *           type: boolean
 *           description: The status of the category
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories with pagination and courses
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
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
 *         description: The number of categories per page
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *           default: true
 *         description: The status of categories
 *     responses:
 *       200:
 *         description: List of categories with pagination and courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: The total number of categories
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request. Invalid input.
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category successfully deleted
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

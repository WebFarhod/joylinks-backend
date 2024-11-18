const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const AdminMiddleware = require("../middlewares/admin.middleware");
const RoleMiddleware = require("../middlewares/role.middleware");
const AuthMiddleware = require("../middlewares/auth.middleware");

router.post("/", AdminMiddleware, userController.createUser);

router.get("/", RoleMiddleware(["admin", "teacher"]), userController.getUsers);

router.get(
  "/:id",
  RoleMiddleware(["admin", "teacher"]),
  userController.getUserById
);

router.put("/update-me", AuthMiddleware, userController.updateMe);

router.put("/:id", AdminMiddleware, userController.updateUserById);

router.delete("/:id", AdminMiddleware, userController.deleteUserById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user to the database.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: '996887953'
 *               password:
 *                 type: string
 *                 example: '12345678'
 *               role:
 *                 type: string
 *                 example: 'admin'
 *               active:
 *                 type: boolean
 *                 example: true
 *               photo:
 *                 type: string
 *                 example: 'http://example.com/photo.jpg'
 *               gender:
 *                 type: string
 *                 example: 'male'
 *                 description: Optional gender of the user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users with optional filters
 *     tags: [Users]
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
 *         description: The number of users to return per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum:
 *             - admin
 *             - mentor
 *             - teacher
 *             - student
 *         description: Filter users by their role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by user's firsname, lastname or phone
 *     responses:
 *       200:
 *         description: A list of users
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
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Fetch a specific user from the database by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Update details of a specific user by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: '996887953'
 *               password:
 *                 type: string
 *                 example: 'newpassword'
 *               role:
 *                 type: string
 *                 example: 'admin'
 *               active:
 *                 type: boolean
 *                 example: true
 *               photo:
 *                 type: string
 *                 example: 'http://example.com/photo.jpg'
 *               gender:
 *                 type: string
 *                 example: 'female'
 *                 description: Optional gender of the user
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Remove a specific user from the database by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have the required role.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user
 *         firstname:
 *           type: string
 *           description: The user's fristname
 *         lasstname:
 *           type: string
 *           description: The user's lastname
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         role:
 *           type: string
 *           description: The user's role (e.g., user, admin)
 *         active:
 *           type: boolean
 *           description: Whether the user is active
 *         photo:
 *           type: string
 *           description: The URL of the user's photo
 *         gender:
 *           type: string
 *           description: The gender of the user (optional)
 *           example: 'male'
 */

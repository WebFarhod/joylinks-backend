const express = require("express");
const router = express.Router();
// const authController = require("../controllers/auth.controller");
// const uploadImageMiddleware = require("../middlewares/photo.middleware");
// const { checkRole } = require("../middlewares/role.middleware");
const authController = require("../controllers/auth.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
// router.post(
//   "/register",
//   // uploadImageMiddleware,
//   // checkRole(["admin"]),
//   authController.register
// );
// router.post("/login", authController.login);
// router.post("/refresh-token", authController.refreshToken);
// router.post("/logout", authController.logout);
// router.post(
//   "/changerole/:id",
//   checkRole(["admin"]),
//   authController.changeUserRole
// );

// router.patch("/me", authenticateToken, authController.updateMe);

router.post("/check-phone", authController.checkPhone);
router.post("/register", authController.register);
router.post("/verification", authController.verification);
router.post("/resend-code", authController.resendCode);
router.post("/forgot-password", authController.forgotPassword);
router.post("/login", authController.login);
router.get("/me", AuthMiddleware, authController.getUser);
router.get("/refresh", authController.refresh);
router.put("/new-password", authController.newPassword);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - phone
 *         - password
 *       properties:
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         password:
 *           type: string
 *           description: The user's password
 *         role:
 *           type: string
 *           description: The user's role
 *         active:
 *           type: boolean
 *           description: Whether the user is active or not
 *         photo:
 *           type: string
 *           description: The URL of the user's photo
 *     Token:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The user's firstname
 *                 example: "Firstname"
 *               lastname:
 *                 type: string
 *                 description: The user's lastname
 *                 example: "Lastname"
 *               phone:
 *                 type: string
 *                 description: The user's phone number
 *                 example: "991051600"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "12345678"
 *               role:
 *                 type: string
 *                 description: The roles' id
 *                 example: "66b7630e0f59666fbef15be1"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The user's profile image (optional)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *     security: []
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "999999999"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         description: Invalid credentials
 *     security: []
 *
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       401:
 *         description: No token provided
 *       403:
 *         description: Invalid token
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/changerole/{id}:
 *   post:
 *     summary: Change the role of a user
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose role is to be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The ID of the new role to assign to the user
 *                 example: "64a7e8b9b593ec1b3d2d6d8f"
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User role updated successfully"
 *       400:
 *         description: Invalid input or user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid user ID or role"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access"
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You do not have permission to change user roles"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while updating the user role"
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Update the authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 description: The user's phone number
 *                 example: "998912345678"
 *               biography:
 *                 type: string
 *                 description: A brief biography of the user
 *                 example: "Software developer with 10 years of experience"
 *               photo:
 *                 type: string
 *                 description: The URL of the user's profile photo
 *                 example: "/images/profile.jpg"
 *               gender:
 *                 type: string
 *                 description: The user's gender
 *                 enum: [male, female, other]
 *                 example: "male"
 *               region:
 *                 type: string
 *                 description: The user's region
 *                 example: "Central"
 *               district:
 *                 type: string
 *                 description: The user's district
 *                 example: "District 7"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: The user's birthdate
 *                 example: "1985-08-15"
 *               lastname:
 *                 type: string
 *                 description: The user's last name
 *                 example: "Doe"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while updating the profile"
 */

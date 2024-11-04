const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");


// Routes for Notifications
router.post(
    "/",
    notificationController.createNotification
);
router.get(
    "/",
    authenticateToken,
    notificationController.getAllNotifications
);

router.get(
    "/:id",
    notificationController.getNotificationById
);

router.put(
    "/:id",
    notificationController.updateNotificationById
);

router.delete(
    "/:id",
    notificationController.deleteNotificationById
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - userId
 *         - message
 *         - isRead
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the notification
 *         userId:
 *           type: string
 *           description: The ID of the user the notification belongs to
 *         toAll:
 *           type: boolean
 *           description: send notification to all users
 *         toStudents:
 *           type: boolean
 *           description: send notification to all Students
 *         toMentors:
 *           type: boolean
 *           description: send notification to all toMentors
 *         message:
 *           type: string
 *           description: The notification message
 *         isRead:
 *           type: boolean
 *           description: Whether the notification has been read
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the notification was created
 */

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management API
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user the notification is for
 *               toAll:
 *                 type: boolean
 *                 description: Send notification to all users
 *               toStudents:
 *                 type: boolean
 *                 description: Send notification to all students
 *               toMentors:
 *                 type: boolean
 *                 description: Send notification to all mentors
 *               message:
 *                 type: string
 *                 description: The notification message
 *               isActive:
 *                 type: boolean
 *                 description: Whether the notification is active
 *                 default: true
 *     responses:
 *       201:
 *         description: Notification successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad Request. Missing required fields
 *       401:
 *         description: Unauthorized. Authentication required
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications
 *     description: Returns a list of notifications for the current user based on their role.
 *     tags:
 *       - Notifications
 *     parameters:
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
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Notification ID
 *                       message:
 *                         type: string
 *                         description: Notification message
 *                       toAll:
 *                         type: boolean
 *                         description: Is the notification for all users
 *                       toStudents:
 *                         type: boolean
 *                         description: Is the notification for students
 *                       toMentors:
 *                         type: boolean
 *                         description: Is the notification for mentors
 *                       isRead:
 *                         type: boolean
 *                         description: Read status of the notification
 *                       is_active:
 *                         type: boolean
 *                         description: Notification active status
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation date of the notification
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Last update date of the notification
 *                       userFirstName:
 *                         type: string
 *                         description: First name of the user who triggered the notification
 *                       userLastName:
 *                         type: string
 *                         description: Last name of the user who triggered the notification
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *       400:
 *         description: Invalid limit value
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Retrieve a specific notification by its ID
 *     description: Accessible only to the user who owns the notification.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the notification to retrieve
 *     responses:
 *       200:
 *         description: The details of the notification with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       403:
 *         description: Forbidden. Access is restricted to the owner of the notification.
 *       404:
 *         description: The notification was not found
 */

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Update a notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: The notification was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad Request. The request body is invalid
 *       404:
 *         description: The notification was not found
 */

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: The notification was deleted
 *       404:
 *         description: The notification was not found
 */

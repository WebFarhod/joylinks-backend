const express = require("express");
const router = express.Router();
const dashbordController = require("../controllers/dashbord.controller");
const RoleMiddleware = require("../middlewares/role.middleware");

router.get(
  "/",
  RoleMiddleware(["admin"]),
  dashbordController.getDashboardData
);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStatistics:
 *       type: object
 *       properties:
 *         studentCount:
 *           type: integer
 *           description: Total number of students
 *         mentorCount:
 *           type: integer
 *           description: Total number of mentors
 *         teacherCount:
 *           type: integer
 *           description: Total number of teachers
 *         totalPurchases:
 *           type: integer
 *           description: Total number of purchases
 *         coursesPurchased:
 *           type: object
 *           properties:
 *             weekly:
 *               type: integer
 *               description: Number of courses purchased this week
 *             monthly:
 *               type: integer
 *               description: Number of courses purchased this month
 *             yearly:
 *               type: integer
 *               description: Number of courses purchased this year
 *         totalCourses:
 *           type: integer
 *           description: Total number of courses
 *       example:
 *         studentCount: 100
 *         mentorCount: 20
 *         teacherCount: 15
 *         totalPurchases: 250
 *         coursesPurchased:
 *           weekly: 10
 *           monthly: 50
 *           yearly: 200
 *         totalCourses: 80
 *
 * tags:
 *   name: Dashboard
 *   description: API for fetching dashboard statistics
 */

/**
 * @swagger
 * /dashbord:
 *   get:
 *     summary: Get dashboard data with statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStatistics'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder, getOrderById, getUsersByCourseId, getCoursesByUserId } = require('../controllers/order.controller');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order for a specific course and user after processing the payment.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: string
 *                 description: The unique identifier of the course
 *               user_id:
 *                 type: string
 *                 description: The unique identifier of the user
 *               payment_type:
 *                 type: string
 *                 description: The type of payment (e.g., credit card, click, payme)
 *             required:
 *               - course_id
 *               - user_id
 *               - payment_type
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the order
 *                 course_id:
 *                   type: string
 *                   description: The unique identifier of the course
 *                 user_id:
 *                   type: string
 *                   description: The unique identifier of the user
 *                 status:
 *                   type: string
 *                   description: The status of the order (e.g., paid)
 *       404:
 *         description: Course or User not found
 *       400:
 *         description: Payment failed
 *       500:
 *         description: Internal server error
 */

router.post('/', createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieve a specific order by its ID, including user and course details.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the order
 *     responses:
 *       200:
 *         description: Successfully retrieved order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the user
 *                     name:
 *                       type: string
 *                       description: The name of the user
 *                     phone:
 *                       type: string
 *                       description: The phone number of the user
 *                 course:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the course
 *                     name:
 *                       type: string
 *                       description: The name of the course
 *                     price:
 *                       type: number
 *                       description: The price of the course
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */


router.get('/:id', getOrderById);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of orders with pagination, filtering by student ID and course ID. Includes course and student details.
 *     tags: [Orders]
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
 *         description: The number of orders to return per page
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: string
 *         description: The ID of the student to filter orders by
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: string
 *         description: The ID of the course to filter orders by
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the order
 *                       status:
 *                         type: string
 *                         description: The status of the order
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the order was created
 *                       course:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the course
 *                           name:
 *                             type: string
 *                             description: The name of the course
 *                           price:
 *                             type: number
 *                             description: The price of the course
 *                       student:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the student
 *                           name:
 *                             type: string
 *                             description: The name of the student
 *                           phone:
 *                             type: string
 *                             description: The phone number of the student
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 totalOrders:
 *                   type: integer
 *                   description: The total number of orders
 *       500:
 *         description: Internal server error
 */


router.get('', getAllOrders);





module.exports = router;
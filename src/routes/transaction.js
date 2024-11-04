const express = require("express");

const transactionController = require("../controllers/transaction.controller");

const router = express.Router();

router.post(
  "/prepare",
  // (req, res, next) => {
  //   console.log(req);
  //   next();
  // },
  transactionController.prepareTransaction
);

router.post("/complete", transactionController.completeTransaction);

module.exports = router;

/**
 * @swagger
 * /payments/click/prepare:
 *   post:
 *     summary: Prepare a transaction for purchasing a course
 *     description: This endpoint prepares a transaction by validating user, course, and amount details, ensuring the course has not already been paid for.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               click_trans_id:
 *                 type: string
 *                 description: Click transaction ID
 *                 example: "1234567890"
 *               service_id:
 *                 type: string
 *                 description: Service ID provided by the payment system
 *                 example: "service123"
 *               merchant_trans_id:
 *                 type: string
 *                 description: User's ID from the system
 *                 example: "user123"
 *               course_id:
 *                 type: string
 *                 description: ID of the course being purchased
 *                 example: "course123"
 *               amount:
 *                 type: number
 *                 description: The amount to be paid for the course
 *                 example: 100
 *               action:
 *                 type: integer
 *                 description: The action code for transaction preparation
 *                 example: 0
 *               sign_time:
 *                 type: string
 *                 description: Time of the signature
 *                 example: "2024-09-26T12:34:56Z"
 *               sign_string:
 *                 type: string
 *                 description: Signature string to validate the request
 *                 example: "abcd1234signature"
 *     responses:
 *       200:
 *         description: Transaction prepared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 click_trans_id:
 *                   type: string
 *                   description: Click transaction ID
 *                   example: "1234567890"
 *                 merchant_trans_id:
 *                   type: string
 *                   description: User's transaction ID
 *                   example: "user123"
 *                 merchant_prepare_id:
 *                   type: number
 *                   description: Timestamp of the preparation
 *                   example: 1672531200000
 *                 error:
 *                   type: integer
 *                   description: Success status code (0 = success)
 *                   example: 0
 *                 error_note:
 *                   type: string
 *                   description: Success message
 *                   example: "Success"
 *       400:
 *         description: Bad request (Invalid parameters or conditions)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   description: Error code
 *                   example: -3
 *                 error_note:
 *                   type: string
 *                   description: Error description
 *                   example: "User not found"
 */

/**
 * @swagger
 * /payments/click/complete:
 *   post:
 *     summary: Complete a transaction for purchasing a course
 *     description: This endpoint completes a prepared transaction by confirming payment, validating the signature, and updating the transaction status.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               click_trans_id:
 *                 type: string
 *                 description: Click transaction ID
 *                 example: "1234567890"
 *               service_id:
 *                 type: string
 *                 description: Service ID provided by the payment system
 *                 example: "service123"
 *               merchant_trans_id:
 *                 type: string
 *                 description: User's ID from the system
 *                 example: "user123"
 *               course_id:
 *                 type: string
 *                 description: ID of the course being purchased
 *                 example: "course123"
 *               merchant_prepare_id:
 *                 type: number
 *                 description: Preparation ID of the transaction
 *                 example: 1672531200000
 *               amount:
 *                 type: number
 *                 description: The amount to be paid for the course
 *                 example: 100
 *               action:
 *                 type: integer
 *                 description: The action code for transaction completion
 *                 example: 1
 *               sign_time:
 *                 type: string
 *                 description: Time of the signature
 *                 example: "2024-09-26T12:34:56Z"
 *               sign_string:
 *                 type: string
 *                 description: Signature string to validate the request
 *                 example: "abcd1234signature"
 *               error:
 *                 type: integer
 *                 description: Error code returned by the payment system (0 = success)
 *                 example: 0
 *     responses:
 *       200:
 *         description: Transaction completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 click_trans_id:
 *                   type: string
 *                   description: Click transaction ID
 *                   example: "1234567890"
 *                 merchant_trans_id:
 *                   type: string
 *                   description: User's transaction ID
 *                   example: "user123"
 *                 merchant_confirm_id:
 *                   type: number
 *                   description: Timestamp of the confirmation
 *                   example: 1672531200000
 *                 error:
 *                   type: integer
 *                   description: Success status code (0 = success)
 *                   example: 0
 *                 error_note:
 *                   type: string
 *                   description: Success message
 *                   example: "Success"
 *       400:
 *         description: Bad request (Invalid parameters or conditions)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   description: Error code
 *                   example: -3
 *                 error_note:
 *                   type: string
 *                   description: Error description
 *                   example: "Transaction not found"
 */

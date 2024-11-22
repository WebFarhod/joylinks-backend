const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment.controller.test");
const { paymeCheckToken } = require("../middlewares/transaction.middleware");

// router.post("/payme", paymeCheckToken, payment.payme);

module.exports = router;

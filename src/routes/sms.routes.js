const express = require("express");
const router = express.Router();
const UserMiddleware = require("../middlewares/user.middleware");
const balanceController = require("../controllers/balance.controller");
const smsController = require("../controllers/sms.controller");

router.post("/", smsController.send);

module.exports = router;

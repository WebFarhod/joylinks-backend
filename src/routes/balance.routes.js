const express = require("express");
const router = express.Router();
const UserMiddleware = require("../middlewares/user.middleware");
const balanceController = require("../controllers/balance.controller");

router.post("/", UserMiddleware, balanceController.createBalance);

module.exports = router;

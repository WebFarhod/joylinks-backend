const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const UserMiddleware = require("../middlewares/user.middleware");
const AdminMiddleware = require("../middlewares/admin.middleware");

router.post("/", UserMiddleware, contactController.add);

router.get("/", AdminMiddleware, contactController.getAll);

router.put("/:id/contacted", AdminMiddleware, contactController.contacted);

router.put("/:id/read", AdminMiddleware, contactController.read);

router.delete("/:id", AdminMiddleware, contactController.delete);

module.exports = router;

const express = require("express");
const router = express.Router();
const UserMiddleware = require("../middlewares/user.middleware");
const testController = require("../controllers/test.controller");
const AdminMiddleware = require("../middlewares/admin.middleware");

router.post("/", AdminMiddleware, testController.createTest);

router.post("/check-test", UserMiddleware, testController.checkTest);
// router.get("/", UserMiddleware, testController.getTests);

router.get("/lesson-id", UserMiddleware, testController.getTestByLessonId);

router.get("/:id", UserMiddleware, testController.getTestById);

router.put("/", AdminMiddleware, testController.updateTest);

router.delete("/:id", AdminMiddleware, testController.deleteTest);

module.exports = router;

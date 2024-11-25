const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadVideoConfig");
const RoleMiddleware = require("../middlewares/role.middleware");

const { uploadvideo } = require("../controllers/video.controller");

router.post(
  "/",
  RoleMiddleware(["admin", "mentor", "teacher"]),
  upload.single("video"),
  uploadvideo
);

module.exports = router;

// const User = require("../models/user.model"); // Assuming you have a Student model
// const Role = require("../models/role.model"); // Assuming you have a Student model
// const Video = require("../models/lesson.model"); // Assuming you have a Video model
// const Quiz = require("../models/quiz.model"); // Assuming you have a Test model
// const Course = require("../models/course.model"); // Assuming you have a Course model

const mongoose = require("mongoose");
const Lesson = require("../models/lesson.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");

let getStatisAllData = async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    const teachers = await User.countDocuments({ role: "teacher" });
    const courses = await Course.countDocuments({ isActive: true });
    const lessons = await Lesson.countDocuments({ isActive: true });

    res.json({
      students,
      teachers,
      courses,
      lessons,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

module.exports = { getStatisAllData };

const User = require("../models/user.model"); // Assuming you have a Student model
const Role = require("../models/role.model"); // Assuming you have a Student model
const Video = require("../models/lesson.model"); // Assuming you have a Video model
const Quiz = require("../models/quiz.model"); // Assuming you have a Test model
const Course = require("../models/course.model"); // Assuming you have a Course model

const mongoose = require("mongoose");

let getStatisAllData = async (req, res) => {
  try {
    // Fetch the counts of each item from the database
    let studentRole = await Role.find({ name: "student" });
    if (!studentRole[0]) {
      studentRole = new Role({ name: "student" });
      await studentRole.save();
    }
    // console.log(studentRole[0]._id);
    // let studentsss = await User.findOne({
    //   role: studentRole[0]._id,
    // });
    // console.log(studentsss);

    let alldata = await Promise.all([
      User.countDocuments({ role: studentRole[0]._id }),
      Video.countDocuments(),
      Quiz.countDocuments(),
      Course.countDocuments(),
    ]);

    // Send the aggregated statistics as a JSON response
    res.json({
      students: alldata[0],
      lessons: alldata[1],
      tests: alldata[2],
      courses: alldata[3],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

module.exports = { getStatisAllData };

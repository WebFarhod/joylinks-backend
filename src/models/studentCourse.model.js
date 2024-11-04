const mongoose = require("mongoose");

const studentCourseSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true, // New field to indicate if the enrollment is active
    },
  },
  { timestamps: true }
);

const StudentCourse = mongoose.model("studentcourses", studentCourseSchema);

module.exports = StudentCourse;

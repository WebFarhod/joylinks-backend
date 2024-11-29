const mongoose = require("mongoose");

const studentCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    studentId: {
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
    isActive: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      required: true,
    },
    supportUntil: {
      type: Number,
      required: true,
    },
    mentorPercentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentCourse = mongoose.model("studentcourses", studentCourseSchema);

module.exports = StudentCourse;

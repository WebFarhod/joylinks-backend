const { Types } = require("mongoose");
const { Schema, model } = require("mongoose");
const coursePayment = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "courses",
      required: true,
    },
    countCourse: {
      type: Number,
      required: true,
      default: 0,
    },
    mentorPercentage: {
      type: Number,
      required: true,
      default: 12,
    },
    mentorSum: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CoursePayment = model("coursePayment", coursePayment);
module.exports = CoursePayment;

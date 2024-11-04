const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
    lesson_id: {  // Added lesson_id
      type: mongoose.Schema.Types.ObjectId,
      ref: "lessons",
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;

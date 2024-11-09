const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false, // Initially set to false; admin needs to approve
    },
    isRead: {
      type: Boolean,
      default: false, // Track if the comment has been read
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

const { default: mongoose } = require("mongoose");
const Comment = require("../models/comment.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");

// Add a comment to a course
exports.addComment = async (req, res) => {
  console.log("test");

  try {
    const { courseId, text } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and their ID is available in `req.user`

    console.log("userId", req.user);
    console.log("userId", userId);

    // Ensure the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Create a new comment
    const comment = new Comment({
      course: courseId,
      user: userId,
      text,
    });

    // Save the comment to the database
    await comment.save();
    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all approved comments for a specific course
exports.getCommentsForCourse = async (req, res) => {
  try {
    const { courseId, page = 1, limit = 10 } = req.query;
    console.log(req.query);
    const id = new mongoose.Types.ObjectId(courseId);

    let query = {};
    query.course = id;

    const comments = await Comment.aggregate([
      { $match: { course: id } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          course: 1,
          text: 1,
          approved: 1,
          isRead: 1,
          user: { firstname: 1, lastname: 1, _id: 1 },
        },
      },
    ]);
    //   course: courseId,
    // }).populate("user");

    // console.log("comment", comments);

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this course" });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin approves a comment
exports.approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    console.log(req.params);
    const id = new mongoose.Types.ObjectId(commentId);

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Only allow admins to approve comments
    // if (req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to approve this comment" });
    // }

    // Approve the comment
    comment.approved = true;
    await comment.save();

    res.status(200).json({ message: "Comment approved successfully", comment });
  } catch (error) {
    console.error("Error approving comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin read a comment
exports.readComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log(req.params);

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.isRead = true;
    await comment.save();

    res.status(200).json({ message: "Comment read successfully", comment });
  } catch (error) {
    console.error("Error reading comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment by its ID
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find the comment by its ID
    const comment = await Comment.findByIdAndDelete(commentId);
    console.log("delete", comment);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Delete the comment
    // await comment.de();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const Comment = require("../models/comment.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const { Types } = require("mongoose");

exports.addComment = async (req, res) => {
  try {
    const { courseId, text } = req.body;
    if (!courseId || !text) {
      return res
        .status(400)
        .json({ error: "Talab qilingan ma'lumotlar mavjud emas." });
    }
    const userId = req.user.sub;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const comment = new Comment({
      courseId,
      userId,
      text,
    });

    await comment.save();
    return res
      .status(201)
      .json({ message: "Izoh muvaffaqiyatli yaratildi.", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCommentsForCourse = async (req, res) => {
  const { courseId, page = 1, limit = 10 } = req.query;
  const user = req.user;

  try {
    const id = new Types.ObjectId(courseId);
    let query = {};

    console.log("er", user);

    // if (!courseId) {
    //   if (
    //     !user ||
    //     (user && user.role !== "admin" && user && user.role !== "teacher")
    //   ) {
    //     return res.status(400).json({ message: "send comment id" });
    //   }
    //   query = {};
    // } else {
    if (user && user.role === "admin") {
      query = {};
    }
    if (user && user.role === "teacher") {
      const teacherCourses = await Course.find({ teacherId: user.sub });
      if (!teacherCourses || teacherCourses.length === 0) {
        return res.status(200).json([]);
      }
      const courseIds = teacherCourses.map((course) => course._id);
      query.courseId = { $in: courseIds };
    }
    if (user && user.role === "mentor") {
      const mentorCourses = await Course.find({ mentorId: user.sub });
      if (!mentorCourses || mentorCourses.length === 0) {
        return res.status(200).json([]);
      }
      const courseIds = mentorCourses.map((course) => course._id);
      query.courseId = { $in: courseIds };
    } else {
      if (!courseId) {
        return res.status(400).json({ message: "send comment id" });
      }
      query.approved = true;
      query.courseId = id;
    }
    // }

    const comments = await Comment.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          courseId: 1,
          text: 1,
          approved: 1,
          isRead: 1,
          user: { firstname: 1, lastname: 1, _id: 1, photo: 1 },
        },
      },
    ]);

    // if (comments.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No comments found for this course" });
    // }

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (user.role == "teacher") {
      const course = await Course.findOne({
        _id: comment.courseId,
        teacherId: user.sub,
      });
      if (!course) {
        return res.status(400).json({ error: "Ruhsat berilmagan." });
      }
    }
    if (comment.approved == true) {
      return res
        .status(200)
        .json({ message: "Izoh muvaffaqiyatli tasdiqlangan", comment });
    }
    comment.approved = true;
    await comment.save();
    return res
      .status(200)
      .json({ message: "Izoh muvaffaqiyatli tasdiqlandi.", comment });
  } catch (error) {
    console.error("Error approving comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.readComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (user.role == "teacher") {
      const course = await Course.findOne({
        _id: comment.courseId,
        teacherId: user.sub,
      });
      if (!course) {
        return res.status(400).json({ error: "Ruhsat berilmagan." });
      }
    }
    if (comment.isRead) {
      return res
        .status(200)
        .json({ message: "Izoh o'qildi deb belgilangan", comment });
    }

    comment.isRead = true;
    await comment.save();

    return res
      .status(200)
      .json({ message: "Izoh o'qildi deb belgilandi", comment });
  } catch (error) {
    console.error("Error reading comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const user = req.user;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (user.role == "teacher") {
      const course = await Course.findOne({
        _id: comment.courseId,
        teacherId: user.sub,
      });
      if (!course) {
        return res.status(400).json({ error: "Ruhsat berilmagan." });
      }
    }

    await comment.deleteOne();

    return res.status(200).json({ message: "Izoh o'chirildi." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

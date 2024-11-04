const mongoose = require('mongoose');
const Review = require("../models/review.model");

exports.createReview = async (req, res) => {
  try {
    let { course_id, lesson_id, comment, rating, student_id } = req.body;
    student_id = student_id ? student_id : req.user.id;

    // Ensure at least one of course_id or lesson_id is provided
    if (!course_id && !lesson_id) {
      return res.status(400).json({ error: "At least one of course_id or lesson_id must be provided." });
    }

    // Validate course_id if it is provided
    if (course_id && !mongoose.Types.ObjectId.isValid(course_id)) {
      return res.status(400).json({ error: "Invalid course_id" });
    }

    // Validate lesson_id if it is provided
    if (lesson_id && !mongoose.Types.ObjectId.isValid(lesson_id)) {
      return res.status(400).json({ error: "Invalid lesson_id" });
    }

    // Validate rating (between 1 and 5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Create a new review
    const review = new Review({
      course_id: course_id || null,  // Set course_id to null if not provided
      lesson_id: lesson_id || null,  // Set lesson_id to null if not provided
      comment,
      rating,
      student_id,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, course_id, lesson_id } = req.query;

    let matchConditions = {};

    // Add filtering for course_id if provided
    if (course_id) {
      if (!mongoose.Types.ObjectId.isValid(course_id)) {
        return res.status(400).json({ error: "Invalid course_id" });
      }
      matchConditions.course_id = course_id;
    }

    // Add filtering for lesson_id if provided
    if (lesson_id) {
      if (!mongoose.Types.ObjectId.isValid(lesson_id)) {
        return res.status(400).json({ error: "Invalid lesson_id" });
      }
      matchConditions.lesson_id = lesson_id;
    }

    const reviews = await Review.aggregate([
      { $match: matchConditions },
      {
        $lookup: {
          from: "users",
          localField: "student_id",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$student" },
      { $unwind: "$course" },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("course_id")
      .populate("student_id");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReviewById = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReviewById = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

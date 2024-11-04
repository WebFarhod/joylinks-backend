const Question = require("../models/question.model");
const mongoose = require("mongoose");

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    // Set default value for is_active if not provided
    const newQuestionData = {
      ...req.body,
      student_id: req.user.id,
      is_active: req.body.is_active !== undefined ? req.body.is_active : true, // Default to true if not provided
    };

    const newQuestion = new Question(newQuestionData);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.replyToQuestion = async (req, res) => {
  try {
    const { questionId } = req.params; // Get question ID from URL params
    const { text } = req.body; // Get reply text from request body
    const mentorId = req.user._id; // Assume mentor's ID is available in req.user after authentication

    // Find the question by its ID
    const question = await Question.findById(questionId);

    // Check if the question exists
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check if the current user is the assigned mentor
    if (question.mentor_id.toString() !== mentorId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reply to this question" });
    }

    // Add the reply
    question.replies.push({
      text: text,
      repliedBy: mentorId,
      date: Date.now(),
    });

    // Save the updated question with the reply
    await question.save();

    res.status(200).json({ message: "Reply added successfully", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all questions with pagination and lookup details, with optional filtering by mentor_id, course_id, and is_active
exports.getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Extract filter parameters from query
    const { mentor_id, course_id, is_active } = req.query;

    const filter = {};
    if (course_id) {
      if (mongoose.Types.ObjectId.isValid(course_id)) {
        filter.course = new mongoose.Types.ObjectId(course_id);
      } else {
        return res.status(400).json({ message: "Invalid course_id format" });
      }
    }
    if (mentor_id) {
      if (mongoose.Types.ObjectId.isValid(mentor_id)) {
        filter.mentor_id = new mongoose.Types.ObjectId(mentor_id);
      } else {
        return res.status(400).json({ message: "Invalid mentor_id format" });
      }
    }
    if (is_active !== undefined) {
      filter.is_active = is_active === 'true'; // Convert string to boolean
    } else {
      filter.is_active = true; // Default to only active questions
    }

    // Aggregate pipeline for filtering, lookup, and pagination
    const questions = await Question.aggregate([
      { $match: filter }, // Apply filter
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
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$student" },
      { $unwind: "$course" },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          text: 1,
          student: { _id: 1, name: 1 },
          course: { _id: 1, name: 1 },
        },
      },
    ]);

    const totalCount = await Question.countDocuments(filter); // Total count for pagination considering the filter

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a question by ID with populated fields
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("student_id")
      .populate("course")
      .populate("lesson");
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a question by ID
exports.updateQuestionById = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a question by ID
exports.deleteQuestionById = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

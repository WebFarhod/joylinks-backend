const Quiz = require("../models/quiz.model"); // Import your Quiz model
const Lesson = require("../models/lesson.model"); // Assuming you have a Lesson model
const Module = require("../models/module.model"); // Assuming you have a Module model

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { teacher_id, questions, mark, module_id, lesson_id, is_active } = req.body;

    // Check if both `module_id` and `lesson_id` are missing
    if (!module_id && !lesson_id) {
      return res.status(400).json({
        error: "Either module_id or lesson_id must be provided.",
      });
    }

    // If module_id is provided, check if the module exists
    if (module_id) {
      const moduleExists = await Module.findById(module_id);
      if (!moduleExists) {
        return res.status(404).json({
          error: "Module not found",
        });
      }
    }

    // If lesson_id is provided, check if the lesson exists
    if (lesson_id) {
      const lessonExists = await Lesson.findById(lesson_id);
      if (!lessonExists) {
        return res.status(404).json({
          error: "Lesson not found",
        });
      }
    }

    // Create a new quiz
    const newQuiz = new Quiz({
      teacher_id,
      questions,
      mark,
      module_id: module_id || null, // If module_id is not provided, set it to null
      lesson_id: lesson_id || null, // If lesson_id is not provided, set it to null
      is_active: is_active !== undefined ? is_active : true, // Set default to true if not provided
    });

    await newQuiz.save();
    res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};


// Get all quizzes with optional pagination and filtering
exports.getQuizzes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      lesson_id,
      teacher_id,
      start_date,
      end_date,
      is_active
    } = req.query;

    const filters = {};

    if (lesson_id) filters.lesson_id = lesson_id;
    if (teacher_id) filters.teacher_id = teacher_id;
    if (start_date && end_date) {
      filters.createdAt = {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      };
    }
    if (is_active !== undefined) filters.is_active = is_active === 'true';

    const quizzes = await Quiz.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Quiz.countDocuments(filters);

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

// Update a quiz by ID
exports.updateQuizById = async (req, res) => {
  try {
    const { teacher_id, questions, mark, module_id, lesson_id } = req.body;

    // Check if both module_id and lesson_id are missing
    if (!module_id && !lesson_id) {
      return res.status(400).json({
        error: "Either module_id or lesson_id must be provided.",
      });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Update the quiz fields
    quiz.teacher_id = teacher_id || quiz.teacher_id;
    quiz.questions = questions || quiz.questions;
    quiz.mark = mark || quiz.mark;

    // If module_id is provided, check if the module exists
    if (module_id) {
      const moduleExists = await Module.findById(module_id);
      if (!moduleExists) {
        return res.status(404).json({
          error: "Module not found",
        });
      }
      quiz.module_id = module_id;
      quiz.lesson_id = null; // Reset lesson_id if module_id is provided
    }

    // If lesson_id is provided, check if the lesson exists
    if (lesson_id) {
      const lessonExists = await Lesson.findById(lesson_id);
      if (!lessonExists) {
        return res.status(404).json({
          error: "Lesson not found",
        });
      }
      quiz.lesson_id = lesson_id;
      quiz.module_id = null; // Reset module_id if lesson_id is provided
    }

    await quiz.save();
    res.status(200).json({
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

// Delete a quiz by ID
exports.deleteQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    await quiz.remove();
    res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

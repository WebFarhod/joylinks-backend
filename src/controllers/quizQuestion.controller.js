const QuizQuestion = require("../models/quizQuestion.model");

// Create a new quiz question
exports.createQuizQuestion = async (req, res) => {
  try {
    console.log(req.body);

    const quizQuestion = new QuizQuestion({
      ...req.body,
      is_active: req.body.is_active !== undefined ? req.body.is_active : true, // Default to true if not provided
    });
    await quizQuestion.save();
    res.status(201).json(quizQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all quiz questions
exports.getQuizQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 10, is_active } = req.query; // Include is_active in query parameters
    const skip = (page - 1) * limit;

    const filters = {};
    if (is_active !== undefined) {
      filters.is_active = is_active === 'true'; // Convert string to boolean
    }

    const quizQuestions = await QuizQuestion.aggregate([
      { $match: filters }, // Apply filters
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $sort: { createdAt: -1 } }, // Optional sorting
    ]);

    const total = await QuizQuestion.countDocuments(filters);

    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: quizQuestions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get a quiz question by ID
exports.getQuizQuestionById = async (req, res) => {
  try {
    const quizQuestion = await QuizQuestion.findById(req.params.id);
    if (!quizQuestion)
      return res.status(404).json({ message: "Quiz Question not found" });
    res.status(200).json(quizQuestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a quiz question by ID
exports.updateQuizQuestionById = async (req, res) => {
  try {
    const quizQuestion = await QuizQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!quizQuestion)
      return res.status(404).json({ message: "Quiz Question not found" });
    res.status(200).json(quizQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a quiz question by ID
exports.deleteQuizQuestionById = async (req, res) => {
  try {
    const quizQuestion = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!quizQuestion)
      return res.status(404).json({ message: "Quiz Question not found" });
    res.status(200).json({ message: "Quiz Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

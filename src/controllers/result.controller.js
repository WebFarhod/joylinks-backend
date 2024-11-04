const AssignResult = require("../models/assignResult.model");
const QuizResult = require("../models/quizResult.model");
const QuizQuestion = require("../models/quizQuestion.model"); // Changed from quiz.model
const Assign = require("../models/assign.model");
const Quiz = require("../models/quiz.model");

// Submit an assignment
const submitAssignment = async (req, res) => {
  console.log(req.user);

  const { assign_id } = req.params;
  const { fileUrl } = req.body;

  try {
    const result = new AssignResult({
      assign_id,
      student_id: req.user.id, // assuming student is authenticated
      fileUrl,
    });

    await result.save();
    res
      .status(201)
      .json({ message: "Assignment submitted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error submitting assignment", error });
  }
};

// Submit a quiz

const submitQuiz = async (req, res) => {
  try {
    const { quiz_id } = req.params; // Assuming you have quiz_id in the URL
    let { student_id, answers } = req.body; // student_id and answers should come from request body

    student_id = student_id ? student_id : req.user.id;
    // 1. Find the quiz and populate its questions
    const quiz = await Quiz.findById(quiz_id).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        message: `Quiz not found: ${quiz_id}`,
      });
    }

    // 2. Extract question IDs from the quiz to check if submitted questions belong to this quiz
    const quizQuestionIds = quiz.questions.map((q) => q._id.toString());

    let totalScore = 0;
    const totalQuestions = answers.length; // The total number of questions answered

    // Store the results for saving later
    const resultData = {
      quiz_id,
      student_id,
      answers: [],
      mark: 0,
    };

    // 3. Iterate through each answer submitted
    for (const answer of answers) {
      const { question_id, selectedOption } = answer;

      // Check if the question belongs to the quiz
      if (!quizQuestionIds.includes(question_id)) {
        return res.status(400).json({
          message: `Question ID ${question_id} does not belong to the quiz ${quiz_id}`,
        });
      }

      // Fetch the quiz question from the database
      const quizQuestion = await QuizQuestion.findById(question_id);

      if (!quizQuestion) {
        return res.status(404).json({
          message: `Question not found: ${question_id}`,
        });
      }

      // Convert selectedOption to index (A = 0, B = 1, C = 2, etc.)
      const optionIndex = selectedOption.toUpperCase().charCodeAt(0) - 65;

      // Ensure the selected option is within bounds
      if (optionIndex < 0 || optionIndex >= quizQuestion.options.length) {
        return res.status(400).json({
          message: `Invalid option selected for question: ${question_id}`,
        });
      }

      // Save the answer in the result data
      resultData.answers.push({
        question_id,
        selectedOption,
      });

      // Check if the selected answer is correct
      if (quizQuestion.answers === quizQuestion.options[optionIndex]) {
        totalScore++; // Increment score if the answer is correct
      }
    }

    // Set the final score

    // Calculate percentage
    const percentage = (totalScore / totalQuestions) * 100;
    resultData.mark = percentage;

    // Save the quiz result to the database
    const quizResult = await QuizResult.create(resultData);

    // Respond with the quiz result including the score and percentage
    res.status(201).json({
      message: "Quiz submitted successfully",
      score: totalScore,
      totalQuestions,
      percentage: percentage.toFixed(2), // Round the percentage to 2 decimal places
      result: quizResult,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Grade an assignment
const gradeAssignment = async (req, res) => {
  const { result_id } = req.params;
  const { mark, feedback } = req.body;

  try {
    const result = await AssignResult.findById(result_id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const assign = await Assign.findById(result.assign_id);
    if (!assign) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assign.mark * 0.7 <= mark) {
      result.status = "completed";
    } else {
      result.status = "rejected";
    }
    result.mark = mark;
    result.feedback = feedback || result.feedback;

    await result.save();

    res.status(200).json({ message: "Assignment graded successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error grading assignment", error });
  }
};

module.exports = { submitAssignment, submitQuiz, gradeAssignment };

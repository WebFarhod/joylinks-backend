// const mongoose = require("mongoose");

// const quizResultSchema = new mongoose.Schema({
//   quiz_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "quizzes", // Ensure this matches the name of your Quiz model
//     required: true,
//   },
//   student_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },
//   answers: [
//     {
//       question_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "quizQuestions",
//         required: true,
//       },
//       selectedOption: {
//         type: String, // or ObjectId if you have options as subdocuments
//         required: true,
//       },
//     },
//   ],
//   mark: {
//     type: Number,
//     default: 0, // score is assigned after quiz evaluation
//   },
//   submitted_at: {
//     type: Date,
//     default: Date.now,
//   },
//   is_active: {
//     type: Boolean,
//     default: true, // New field to indicate if the quiz result is active
//   },
// });

// const QuizResult = mongoose.model("quizResults", quizResultSchema);

// module.exports = QuizResult;

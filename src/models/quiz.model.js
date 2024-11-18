// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const quizSchema = new Schema(
//   {
//     teacher_id: {
//       type: Schema.Types.ObjectId,
//       ref: "users",
//       required: true,
//     },
//     questions: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "quizQuestions",
//       },
//     ],
//     module_id: {
//       type: Schema.Types.ObjectId,
//       ref: "modules",
//       // required: true,
//     },
//     mark: {
//       type: Number,
//       required: true,
//     },
//     lesson_id: {
//       type: Schema.Types.ObjectId,
//       ref: "lessons",
//       // required: true,
//     },
//     is_active: {
//       type: Boolean,
//       default: true, // New field to indicate if the quiz is active
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//     timestamps: true,
//   }
// );

// const Quiz = mongoose.model("quizzes", quizSchema);

// module.exports = Quiz;

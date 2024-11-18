// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema(
//   {
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "courses",
//       required: true,
//     },
//     mentor_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//       required: true,
//     },
//     lesson: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "lessons",
//       required: true,
//     },
//     student_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//       required: true,
//     },
//     text: {
//       type: String,
//       required: true,
//     },
//     replies: {
//       type: [
//         {
//           text: String,
//           date: {
//             type: Date,
//             default: Date.now,
//           },
//           repliedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "users",
//           },
//         },
//       ],
//       required: false,
//     },
//     file: {
//       type: String,
//       required: false,
//     },
//     is_active: {
//       type: Boolean,
//       default: true, // New field to indicate if the question is active
//     },
//   },
//   { timestamps: true }
// );

// const Question = mongoose.model("questions", questionSchema);

// module.exports = Question;

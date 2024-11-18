// const mongoose = require("mongoose");

// const lessonSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     sequence: {
//       type: Number,
//       required: true,
//     },
//     video_link: [
//       {
//         type: String,
//         required: true,
//         validate: {
//           validator: function (v) {
//             return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(v); // URL validation
//           },
//           message: (props) => `${props.value} is not a valid URL!`,
//         },
//       },
//     ],
//     materials: [
//       {
//         type: String,
//         required: false,
//       },
//     ],

//     module_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "modules",
//       required: true,
//     },
//     is_active: {
//       type: Boolean,
//       default: true,
//     },
//     passed: {
//       type: Boolean,
//       default: false, // Default value is false
//     },
//   },
//   { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
// );

// // Add indexes for faster queries
// lessonSchema.index({ module_id: 1, sequence: 1 });
// lessonSchema.virtual("quizes", {
//   ref: "quizes",
//   localField: "_id",
//   foreignField: "lesson_id",
// });

// const Lesson = mongoose.model("lessons", lessonSchema);

// module.exports = Lesson;

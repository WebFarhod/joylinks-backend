// const mongoose = require("mongoose");

// const assignSchema = new mongoose.Schema({
//   module_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "modules",
//     required: true,
//   },
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   mark: {
//     type: Number,
//     required: true,
//   },
//   fileUrl: {
//     type: String,
//     required: true,
//   },
//   dueTime: {
//     type: Date,
//     required: true,
//   },
//   is_active: {
//     type: Boolean,
//     required: true,
//     default: true,
//   },
// }, { timestamps: true });

// const Assign = mongoose.model("assigns", assignSchema);

// module.exports = Assign;

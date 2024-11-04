const mongoose = require("mongoose");

const assignResultSchema = new mongoose.Schema({
  assign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "assigns",
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  fileUrl: {
    type: String,
    required: true, // student's uploaded assignment file
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  mark: {
    type: Number,
    default: null, // teacher will assign this later
  },
  feedback: {
    type: String,
    default: "", // optional feedback from teacher
  },
  status: {
    type: String,
    enum: ["pending", "completed", "rejected"],
    default: "pending",
  },
  is_active: {
    type: Boolean,
    default: true, // new field to indicate if the assignment result is active
  },
});

const AssignResult = mongoose.model("assignResults", assignResultSchema);
module.exports = AssignResult;

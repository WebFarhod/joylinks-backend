const { Schema, model } = require("mongoose");

const ProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  lessonId: { type: Schema.Types.ObjectId, ref: "lessons" },
  courseId: { type: Schema.Types.ObjectId, ref: "courses" },
  isLessonCompleted: { type: Boolean, default: false },
  isVideoCompleted: { type: Boolean, default: false },
  isTestPassed: { type: Boolean, default: false },
});

const Progress = model("progress", ProgressSchema);

module.exports = Progress;

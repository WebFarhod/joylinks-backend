const { Schema, model } = require("mongoose");

const ProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  lessonId: { type: Schema.Types.ObjectId, ref: "lesson" },
  isLessonCompleted: { type: Boolean, default: false },
  isTestPassed: { type: Boolean, default: false },
});

const Progress = model("progress", ProgressSchema);

module.exports = Progress;
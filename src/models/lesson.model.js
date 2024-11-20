const { Schema, model } = require("mongoose");

const lessonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    video_link: [
      {
        type: String,
        required: false,
      },
    ],
    materials: [
      {
        type: String,
        required: false,
      },
    ],

    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "modules",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passed: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true }, toObject: { virtuals: true }
  }
);

const Lesson = model("lessons", lessonSchema);

module.exports = Lesson;

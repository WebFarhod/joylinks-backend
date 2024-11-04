// models/Course.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      // required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    teacher_id: { type: [Schema.Types.ObjectId], ref: "users", required: true },
    price: { type: Number, required: true }, 
    duration: { type: Schema.Types.Decimal128, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    photo: {
      type: String,
      // required: true,
      trim: true,
      default: "./defaults/video.png",
    },
    is_active: { type: Boolean, default: true },
    is_top: { type: Boolean, default: false },
    mentor_id: { type: Schema.Types.ObjectId, ref: "users", required: true },

  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);
courseSchema.virtual("modules", {
  ref: "modules",
  localField: "_id",
  foreignField: "course_id",
  justOne: false,
});
courseSchema.virtual("reviews", {
  ref: "reviews",
  localField: "_id",
  foreignField: "course_id",
  justOne: false,
});
courseSchema.virtual("studentcourses", {
  ref: "studentcourses",
  localField: "_id",
  foreignField: "course_id",
  justOne: false,
});
let Course = mongoose.model("courses", courseSchema);
module.exports = Course;

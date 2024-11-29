const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
      type: String,
      trim: true,
      default: null,
    },
    // duration: { type: Schema.Types.Decimal128, required: true },
    // level: {
    //   type: String,
    //   enum: ["beginner", "intermediate", "advanced"],
    //   default: "beginner",
    // },
    isActive: { type: Boolean, default: false, require: true },
    isTop: { type: Boolean, default: false },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    teacherId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    //new
    mentorPercentage: {
      type: Number,
      required: true,
    },
    supportUntil: {
      type: Number,
      required: true,
    },
  },
  {
    // toJSON: { virtuals: true }, toObject: { virtuals: true },
    timestamps: true,
  }
);
// courseSchema.virtual("modules", {
//   ref: "modules",
//   localField: "_id",
//   foreignField: "course_id",
//   justOne: false,
// });
// courseSchema.virtual("reviews", {
//   ref: "reviews",
//   localField: "_id",
//   foreignField: "course_id",
//   justOne: false,
// });
// courseSchema.virtual("studentcourses", {
//   ref: "studentcourses",
//   localField: "_id",
//   foreignField: "course_id",
//   justOne: false,
// });
const Course = model("courses", courseSchema);
module.exports = Course;

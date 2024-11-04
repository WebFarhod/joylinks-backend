const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

moduleSchema.virtual("lessons", {
  ref: "lessons",
  localField: "_id",
  foreignField: "module_id",
  // justOne: false,
});
moduleSchema.virtual("assigns", {
  ref: "assigns",
  localField: "_id",
  foreignField: "module_id",
  // justOne: false,
});
moduleSchema.virtual("quizes", {
  ref: "quizes",
  localField: "_id",
  foreignField: "module_id",
  // justOne: false,
});

const Module = mongoose.model("modules", moduleSchema);

module.exports = Module;

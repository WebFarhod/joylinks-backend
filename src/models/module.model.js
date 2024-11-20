const { Schema, model } = require("mongoose");

const moduleSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
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
    isActive: {
      type: Boolean,
      default: false,
      required: true,
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
});

const Module = model("modules", moduleSchema);

module.exports = Module;

const { Schema, model } = require("mongoose");
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model("categories", categorySchema);

module.exports = Category;

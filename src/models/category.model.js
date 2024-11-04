const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category nomini berish majburiy"],
      maxlength: 255,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;

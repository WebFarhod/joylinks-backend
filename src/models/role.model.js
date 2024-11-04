const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["user", "student", "admin", "teacher", "mentor"],
      required: true,
      default: "user",
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Pre-find middleware to filter out inactive roles
roleSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: false } });
  next();
});

const Role = mongoose.model("roles", roleSchema);

module.exports = Role;

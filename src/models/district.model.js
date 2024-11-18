// const mongoose = require("mongoose");
// const db = require("../utils/db");

// const districtSchema = new mongoose.Schema({
//   region: {
//     type: String,
//     required: true,
//   },
//   district: {
//     type: String,
//     required: true,
//   },
//   code: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   is_active: {
//     type: Boolean,
//     default: true, // Field to track if the district is active
//   },
// }, { timestamps: true });

// // Adding a unique index to prevent duplicate districts in the same region
// districtSchema.index({ region: 1, district: 1 }, { unique: true });

// const District = mongoose.model("districts", districtSchema);

// module.exports = District;

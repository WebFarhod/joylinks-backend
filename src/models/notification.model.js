// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//       required: false,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//     toAll: {
//       type: Boolean,
//       default: false,
//     },
//     toStudents: {
//       type: Boolean,
//       default: false,
//     },
//     toMentors: {
//       type: Boolean,
//       default: false,
//     },
//     // isRead: {
//     //   type: Boolean,
//     //   default: false,
//     // },
//     readByUsers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "users",
//       },
//     ],
//     is_active: {
//       type: Boolean,
//       default: true, // New field to track if the notification is active
//     },
//   },
//   { timestamps: true }
// );

// const Notification = mongoose.model("notifications", notificationSchema);

// module.exports = Notification;

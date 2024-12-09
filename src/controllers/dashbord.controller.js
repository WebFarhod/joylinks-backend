const Course = require("../models/course.model");
// const Role = require("../models/role.model");
const StudentCourse = require("../models/studentCourse.model");
const User = require("../models/user.model");

exports.getDashboardData = async (req, res) => {
  try {
    // Fetch role ObjectIds
    // const studentRole = await Role.findOne({ name: "student" }).exec();
    // const mentorRole = await Role.findOne({ name: "mentor" }).exec();
    // const teacherRole = await Role.findOne({ name: "teacher" }).exec();

    // Count users by role ObjectId
    const studentsCount = await User.countDocuments({ role: "student" });
    const mentorsCount = await User.countDocuments({ role: "mentor" });
    const teachersCount = await User.countDocuments({ role: "teacher" });
    // const totalCourses = await Course.countDocuments();
    // const totalPurchases = await StudentCourse.countDocuments();

    // Umumiy foyda
    // const totalRevenue = await StudentCourse.aggregate([
    //   {
    //     $lookup: {
    //       from: "courses",
    //       localField: "course_id",
    //       foreignField: "_id",
    //       as: "courseDetails",
    //     },
    //   },
    //   { $unwind: "$courseDetails" },
    //   { $group: { _id: null, totalRevenue: { $sum: "$courseDetails.price" } } },
    // ]);

    // const totalRevenueAmount = totalRevenue[0]?.totalRevenue || 0;

    // // Haftalik, oylik va yillik foyda va haridlar soni
    // const now = new Date();
    // const lastWeek = new Date(now);
    // lastWeek.setDate(now.getDate() - 7);

    // const lastMonth = new Date(now);
    // lastMonth.setMonth(now.getMonth() - 1);

    // const lastYear = new Date(now);
    // lastYear.setFullYear(now.getFullYear() - 1);

    // const weeklyRevenue = await StudentCourse.aggregate([
    //   {
    //     $match: { enrolledAt: { $gte: lastWeek } },
    //   },
    //   {
    //     $lookup: {
    //       from: "courses",
    //       localField: "course_id",
    //       foreignField: "_id",
    //       as: "courseDetails",
    //     },
    //   },
    //   { $unwind: "$courseDetails" },
    //   { $group: { _id: null, totalRevenue: { $sum: "$courseDetails.price" } } },
    // ]);
    // const weeklyRevenueAmount = weeklyRevenue[0]?.totalRevenue || 0;

    // const monthlyRevenue = await StudentCourse.aggregate([
    //   {
    //     $match: { enrolledAt: { $gte: lastMonth } },
    //   },
    //   {
    //     $lookup: {
    //       from: "courses",
    //       localField: "course_id",
    //       foreignField: "_id",
    //       as: "courseDetails",
    //     },
    //   },
    //   { $unwind: "$courseDetails" },
    //   { $group: { _id: null, totalRevenue: { $sum: "$courseDetails.price" } } },
    // ]);
    // const monthlyRevenueAmount = monthlyRevenue[0]?.totalRevenue || 0;

    // const yearlyRevenue = await StudentCourse.aggregate([
    //   {
    //     $match: { enrolledAt: { $gte: lastYear } },
    //   },
    //   {
    //     $lookup: {
    //       from: "courses",
    //       localField: "course_id",
    //       foreignField: "_id",
    //       as: "courseDetails",
    //     },
    //   },
    //   { $unwind: "$courseDetails" },
    //   { $group: { _id: null, totalRevenue: { $sum: "$courseDetails.price" } } },
    // ]);
    // const yearlyRevenueAmount = yearlyRevenue[0]?.totalRevenue || 0;

    // // Haftalik, oylik va yillik haridlar soni
    // const weeklyPurchases = await StudentCourse.countDocuments({
    //   enrolledAt: { $gte: lastWeek },
    // });
    // const monthlyPurchases = await StudentCourse.countDocuments({
    //   enrolledAt: { $gte: lastMonth },
    // });
    // const yearlyPurchases = await StudentCourse.countDocuments({
    //   enrolledAt: { $gte: lastYear },
    // });

    res.status(200).json({
      studentsCount,
      mentorsCount,
      teachersCount,
      // totalPurchases,
      // totalRevenue: totalRevenueAmount,
      // purchaseStats: {
      //   weekly: weeklyPurchases,
      //   monthly: monthlyPurchases,
      //   yearly: yearlyPurchases,
      // },
      // revenueStats: {
      //   weekly: weeklyRevenueAmount,
      //   monthly: monthlyRevenueAmount,
      //   yearly: yearlyRevenueAmount,
      // },
      // totalCourses,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const Course = require("../models/course.model");
// const Role = require("../models/role.model");
// const StudentCourse = require("../models/studentCourse.model");
// const User = require("../models/user.model");

// exports.getDashboardData = async (req, res) => {
//   try {
//     // Rollar bo'yicha foydalanuvchilarni hisoblash
//     const studentRole = await Role.findOne({ name: "student" }).exec();
//     const mentorRole = await Role.findOne({ name: "mentor" }).exec();
//     const teacherRole = await Role.findOne({ name: "teacher" }).exec();

//     const studentsCount = await User.countDocuments({ role: studentRole._id });
//     const mentorsCount = await User.countDocuments({ role: mentorRole._id });
//     const teachersCount = await User.countDocuments({ role: teacherRole._id });
//     const totalCourses = await Course.countDocuments();
//     const totalPurchases = await StudentCourse.countDocuments();

//     // Umumiy daromadni hisoblash
//     const totalRevenue = await StudentCourse.aggregate([
//       {
//         $lookup: {
//           from: "courses",
//           localField: "course_id",
//           foreignField: "_id",
//           as: "courseDetails",
//         },
//       },
//       { $unwind: "$courseDetails" },
//       { $group: { _id: null, totalRevenue: { $sum: "$courseDetails.price" } } },
//     ]);

//     const totalRevenueAmount = totalRevenue[0]?.totalRevenue || 0;

//     // Sanalarni hisoblash
//     const now = new Date();
//     const currentYear = now.getFullYear();
//     const currentMonth = now.getMonth() + 1;
//     const lastWeek = new Date(now);
//     lastWeek.setDate(now.getDate() - 6);

//     // Yillik daromad: Joriy oyni oxirgi qiymat sifatida olish
//     const yearlyStats = await StudentCourse.aggregate([
//       {
//         $match: {
//           enrolledAt: {
//             $gte: new Date(currentYear - 1, currentMonth - 1, 1),
//             $lt: new Date(currentYear, currentMonth, 1),
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "courses",
//           localField: "course_id",
//           foreignField: "_id",
//           as: "courseDetails",
//         },
//       },
//       { $unwind: "$courseDetails" },
//       {
//         $group: {
//           _id: { month: { $month: "$enrolledAt" } },
//           monthlyRevenue: { $sum: "$courseDetails.price" },
//         },
//       },
//     ]);

//     const yearlyRevenue = Array(12).fill(0);
//     yearlyStats.forEach((stat) => {
//       yearlyRevenue[stat._id.month - 1] = stat.monthlyRevenue;
//     });

//     // Oylik daromad: Oxirgi hafta sifatida 7 kunlik daromadni olish
//     const monthlyStats = await StudentCourse.aggregate([
//       {
//         $match: {
//           enrolledAt: {
//             $gte: new Date(currentYear, currentMonth - 1, 1),
//             $lt: new Date(currentYear, currentMonth, 1),
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "courses",
//           localField: "course_id",
//           foreignField: "_id",
//           as: "courseDetails",
//         },
//       },
//       { $unwind: "$courseDetails" },
//       {
//         $group: {
//           _id: { week: { $week: "$enrolledAt" } },
//           weeklyRevenue: { $sum: "$courseDetails.price" },
//         },
//       },
//     ]);

//     const monthlyRevenue = Array(4).fill(0);
//     const last7DaysRevenue = await StudentCourse.aggregate([
//       { $match: { enrolledAt: { $gte: lastWeek } } },
//       {
//         $lookup: {
//           from: "courses",
//           localField: "course_id",
//           foreignField: "_id",
//           as: "courseDetails",
//         },
//       },
//       { $unwind: "$courseDetails" },
//       {
//         $group: {
//           _id: null,
//           last7DaysRevenue: { $sum: "$courseDetails.price" },
//         },
//       },
//     ]);
//     monthlyRevenue[3] = last7DaysRevenue[0]?.last7DaysRevenue || 0;

//     // Haftalik daromad: Bugungi kun oxirgi qiymat sifatida olish
//     const weeklyStats = await StudentCourse.aggregate([
//       { $match: { enrolledAt: { $gte: lastWeek } } },
//       {
//         $lookup: {
//           from: "courses",
//           localField: "course_id",
//           foreignField: "_id",
//           as: "courseDetails",
//         },
//       },
//       { $unwind: "$courseDetails" },
//       {
//         $group: {
//           _id: { day: { $dayOfWeek: "$enrolledAt" } },
//           dailyRevenue: { $sum: "$courseDetails.price" },
//         },
//       },
//     ]);

//     const weeklyRevenue = Array(7).fill(0);
//     weeklyStats.forEach((stat) => {
//       weeklyRevenue[stat._id.day - 1] = stat.dailyRevenue;
//     });

//     res.status(200).json({
//       studentsCount,
//       mentorsCount,
//       teachersCount,
//       totalPurchases,
//       totalRevenue: totalRevenueAmount,
//       totalCourses,
//       revenueStats: {
//         yearly: yearlyRevenue,
//         monthly: monthlyRevenue,
//         weekly: weeklyRevenue,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

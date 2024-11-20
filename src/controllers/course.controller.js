const Course = require("../models/course.model");
const Assignment = require("../models/assign.model");
const Test = require("../models/quiz.model");
const Lesson = require("../models/lesson.model");
const Module = require("../models/module.model");
const StudentCourse = require("../models/studentCourse.model");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const { convertToSeconds } = require("../utils/convertToSeconds");
const mongoose = require("mongoose");
const Assign = require("../models/assign.model");
const Quiz = require("../models/quiz.model");
const { ObjectId } = require("mongodb");
const courseService = require("../services/course.service");

class CourseController {
  async createCourse(req, res, next) {
    try {
      const { name, description, price, categoryId, teacherId, mentorId } =
        req.body;
      const user = req.user;
      if (user.role == "admin") {
        if (
          !name ||
          !description ||
          !price ||
          !categoryId ||
          !teacherId ||
          !mentorId
        ) {
          return res
            .status(400)
            .json({ error: "Talab qilinga malumotlar mavjud emas" });
        }
      } else {
        if (name || !description || !price || !categoryId || !mentorId) {
          return res
            .status(400)
            .json({ error: "Talab qilinga malumotlar mavjud emas" });
        }
      }
      const data = await courseService.create(res.body, user);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getAllCourses(req, res, next) {
    try {
      const data = await courseService.getAll(req.query, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteCourseById(req, res, next) {
    try {
      const data = await courseService.deleteById(req.params.id, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateCourseById(req, res, next) {
    try {
      const data = await courseService.updateById(
        req.body,
        req.params.id,
        req.user
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
// Create a new course
// exports.createCourse = async (req, res) => {
//   try {
//     req.body.duration = convertToSeconds(req.body.duration);
//     const course = new Course(req.body);
//     await course.save();
//     res.status(201).json(course);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Get public courses with filters
exports.getPublicCourses = async (req, res) => {
  try {
    const {
      is_top,
      teacher,
      mentor,
      category,
      // level,
      // minDuration,
      // maxDuration,
      // minPrice,
      // maxPrice,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (is_top) {
      query.is_top = true;
    }

    if (teacher) query.teacher_id = new ObjectId(teacher);
    if (mentor) query.mentor_id = new ObjectId(mentor);
    if (category) query.category_id = new ObjectId(category);
    if (level) query.level = level;
    if (minDuration || maxDuration) {
      query.duration = {};
      if (minDuration) query.duration.$gte = convertToSeconds(minDuration);
      if (maxDuration) query.duration.$lte = convertToSeconds(maxDuration);
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const courses = await Course.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "teacher_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "mentor_id",
          foreignField: "_id",
          as: "mentor",
        },
      },
      // { $match: { "category._id": category } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category", 0] },
          teacher: { $arrayElemAt: ["$teacher", 0] },
          mentor: { $arrayElemAt: ["$mentor", 0] },
        },
      },
      {
        $project: {
          name: 1,
          photo: 1,
          description: 1,
          price: 1,
          duration: 1,
          level: 1,
          is_active: 1,
          is_top: 1,
          "category._id": 1,
          "category.name": 1,
          "teacher._id": 1,
          "teacher.firstname": 1,
          "teacher.lastname": 1,
          "mentor._id": 1,
          "mentor.firstname": 1,
          "mentor.lastname": 1,
        },
      },
    ]);

    const processCourse = async (course) => {
      const totalModules = await Module.countDocuments({
        course_id: course._id,
      });
      course.module_counts = totalModules || 0;

      const totalEnrolledStudents = await StudentCourse.countDocuments({
        course_id: course._id,
      });
      course.enrolled_students_counts = totalEnrolledStudents || 0;

      const modules = await Module.find({ course_id: course._id });

      if (modules.length > 0) {
        let totalLessons = 0;
        let totalVideos = 0;
        let totalMaterials = 0;
        let totalAssigns = 0;
        let totalTests = 0;

        await Promise.all(
          modules.map(async (module) => {
            const lessonCounts = await Lesson.aggregate([
              { $match: { module_id: module._id } },
              {
                $project: {
                  videoLinkCount: { $size: "$video_link" },
                  materialsCount: { $size: "$materials" },
                },
              },
              {
                $group: {
                  _id: null,
                  totalCount: { $sum: 1 },
                  totalVideoLinks: { $sum: "$videoLinkCount" },
                  totalMaterials: { $sum: "$materialsCount" },
                },
              },
            ]);

            totalLessons +=
              lessonCounts.length > 0 ? lessonCounts[0].totalCount : 0;
            totalVideos +=
              lessonCounts.length > 0 ? lessonCounts[0].totalVideoLinks : 0;
            totalMaterials +=
              lessonCounts.length > 0 ? lessonCounts[0].totalMaterials : 0;

            const assignCounts = await Assign.countDocuments({
              module_id: module._id,
            });
            totalAssigns += assignCounts;

            const testCounts = await Quiz.countDocuments({
              module_id: module._id,
            });
            totalTests += testCounts;
          })
        );

        course.lesson_counts = totalLessons;
        course.video_counts = totalVideos;
        course.material_counts = totalMaterials;
        course.assign_counts = totalAssigns;
        course.test_counts = totalTests;
      }

      // Check if course exists in public courses
      const publicCourse = await Course.findOne({ _id: course._id });

      if (!publicCourse) {
        // Transfer course to public collection
        await Course.create(course);

        // Remove course from original collection
        await Course.deleteOne({ _id: course._id });
      }
    };

    const processAllCourses = async (courses) => {
      await Promise.all(courses.map(processCourse));
    };

    await processAllCourses(courses);

    const totalCourses = await Course.countDocuments(query);

    res.status(200).json({
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: parseInt(page),
      courses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminCourses = async (req, res) => {
  try {
    const {
      is_top,
      teacher,
      mentor,
      category,
      level,
      page = 1,
      limit = 10,
    } = req.query;

    const match = {};
    if (is_top) match.is_top = is_top;
    if (teacher) match.teacher_id = teacher;
    if (mentor) match.mentor_id = mentor;
    if (category) match.category_id = category;
    if (level) match.level = level;

    const courses = await Course.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" }, // Unwind the category array
      {
        $lookup: {
          from: "users",
          localField: "teacher_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" }, // Unwind the teacher array
      {
        $lookup: {
          from: "users",
          localField: "mentor_id",
          foreignField: "_id",
          as: "mentor",
        },
      },
      { $unwind: "$mentor" }, // Unwind the mentor array
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          duration: 1,
          level: 1,
          is_active: 1,
          is_top: 1,
          category: { name: 1, _id: 1 },
          teacher: { firstname: 1, lastname: 1, _id: 1 },
          mentor: { firstname: 1, lastname: 1, _id: 1 },
        },
      },
    ]);

    const processCourse = async (course) => {
      const totalModules = await Module.countDocuments({
        course_id: course._id,
      });
      course.module_counts = totalModules || 0;

      const totalEnrolledStudents = await StudentCourse.countDocuments({
        course_id: course._id,
      });
      course.enrolled_students_counts = totalEnrolledStudents || 0;

      const modules = await Module.find({ course_id: course._id });

      if (modules.length > 0) {
        let totalLessons = 0;
        let totalVideos = 0;
        let totalMaterials = 0;
        let totalAssigns = 0;
        let totalTests = 0;

        await Promise.all(
          modules.map(async (module) => {
            const lessonCounts = await Lesson.aggregate([
              { $match: { module_id: module._id } },
              {
                $project: {
                  videoLinkCount: { $size: "$video_link" },
                  materialsCount: { $size: "$materials" },
                },
              },
              {
                $group: {
                  _id: null,
                  totalCount: { $sum: 1 },
                  totalVideoLinks: { $sum: "$videoLinkCount" },
                  totalMaterials: { $sum: "$materialsCount" },
                },
              },
            ]);

            totalLessons +=
              lessonCounts.length > 0 ? lessonCounts[0].totalCount : 0;
            totalVideos +=
              lessonCounts.length > 0 ? lessonCounts[0].totalVideoLinks : 0;
            totalMaterials +=
              lessonCounts.length > 0 ? lessonCounts[0].totalMaterials : 0;

            const assignCounts = await Assign.countDocuments({
              module_id: module._id,
            });
            totalAssigns += assignCounts;

            const testCounts = await Quiz.countDocuments({
              module_id: module._id,
            });
            totalTests += testCounts;
          })
        );

        course.lesson_counts = totalLessons;
        course.video_counts = totalVideos;
        course.material_counts = totalMaterials;
        course.assign_counts = totalAssigns;
        course.test_counts = totalTests;
      }
    };

    const processAllCourses = async (courses) => {
      await Promise.all(courses.map(processCourse));
    };

    await processAllCourses(courses);

    const totalCourses = await Course.countDocuments(match);

    res.status(200).json({
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: parseInt(page),
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a course by ID
// exports.getCourseById = async (req, res) => {
//   try {
//     const courseId = req.params.id;

//     // Validate if courseId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(courseId)) {
//       return res.status(400).json({ message: "Invalid course ID" });
//     }

//     // Fetch the course details with aggregations
//     const course = await Course.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(courseId),
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "teacher_id",
//           foreignField: "_id",
//           as: "teacher",
//         },
//       },
//       {
//         $unwind: {
//           path: "$teacher",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category_id",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       {
//         $unwind: {
//           path: "$category",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           description: 1,
//           price: 1,
//           teacher: {
//             _id: "$teacher._id",
//             name: "$teacher.name",
//           },
//           category: {
//             _id: "$category._id",
//             name: "$category.name",
//           },
//           mentor: {
//             _id: "$mentor._id",
//             name: "$mentor.name",
//           },
//           is_top: 1,
//         },
//       },
//     ]);

//     // If no course is found, return 404
//     if (course?.length === 0) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Processing course data to include additional counts
//     const processCourse = async (course) => {
//       // Count the number of modules associated with the course
//       const totalModules = await Module.countDocuments({
//         course_id: course._id,
//       });
//       course.module_counts = totalModules || 0;

//       // Count the number of students enrolled in the course
//       const totalEnrolledStudents = await StudentCourse.countDocuments({
//         course_id: course._id,
//       });
//       course.enrolled_students_counts = totalEnrolledStudents || 0;

//       // Fetch the modules and their related data
//       const modules = await Module.find({ course_id: course._id });
//       if (modules.length > 0) {
//         let totalLessons = 0;
//         let totalVideos = 0;
//         let totalMaterials = 0;
//         let totalAssigns = 0;
//         let totalTests = 0;

//         await Promise.all(
//           modules.map(async (module) => {
//             const lessonCounts = await Lesson.aggregate([
//               { $match: { module_id: module._id } },
//               {
//                 $project: {
//                   videoLinkCount: { $size: "$video_link" },
//                   materialsCount: { $size: "$materials" },
//                 },
//               },
//               {
//                 $group: {
//                   _id: null,
//                   totalCount: { $sum: 1 },
//                   totalVideoLinks: { $sum: "$videoLinkCount" },
//                   totalMaterials: { $sum: "$materialsCount" },
//                 },
//               },
//             ]);

//             totalLessons +=
//               lessonCounts.length > 0 ? lessonCounts[0].totalCount : 0;
//             totalVideos +=
//               lessonCounts.length > 0 ? lessonCounts[0].totalVideoLinks : 0;
//             totalMaterials +=
//               lessonCounts.length > 0 ? lessonCounts[0].totalMaterials : 0;

//             const assignCounts = await Assign.countDocuments({
//               module_id: module._id,
//             });
//             totalAssigns += assignCounts;

//             const testCounts = await Quiz.countDocuments({
//               module_id: module._id,
//             });
//             totalTests += testCounts;
//           })
//         );

//         // Set the calculated counts to the course object
//         course.lesson_counts = totalLessons;
//         course.video_counts = totalVideos;
//         course.material_counts = totalMaterials;
//         course.assign_counts = totalAssigns;
//         course.test_counts = totalTests;
//       }
//     };
//     await processCourse(course[0]);
//     res.status(200).json(course);
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = req.user;

    // Validate if courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Fetch the course details with aggregations
    const courseData = await Course.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "teacher_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $unwind: {
          path: "$teacher",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          photo: 1,
          "teacher._id": 1,
          "teacher.firstname": 1,
          "teacher.lastname": 1,
          "teacher.photo": 1,
          category: {
            _id: "$category._id",
            name: "$category.name",
          },
          mentor: {
            _id: "$mentor._id",
            name: "$mentor.name",
          },
          is_top: 1,
        },
      },
    ]);

    const course = courseData[0];

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let hasPurchased = false;
    if (user) {
      hasPurchased = await StudentCourse.exists({
        course_id: courseId,
        student_id: user.id,
      });
    }

    const processCourse = async (course) => {
      course.purchased = !!hasPurchased;

      // Count the number of modules associated with the course
      const totalModules = await Module.countDocuments({
        course_id: course._id,
      });
      course.module_counts = totalModules || 0;

      const totalEnrolledStudents = await StudentCourse.countDocuments({
        course_id: course._id,
      });
      course.enrolled_students_counts = totalEnrolledStudents || 0;

      const modules = await Module.find({ course_id: course._id });
      if (modules.length > 0) {
        let totalLessons = 0;
        let totalVideos = 0;
        let totalMaterials = 0;
        let totalAssigns = 0;
        let totalTests = 0;

        await Promise.all(
          modules.map(async (module) => {
            const lessonCounts = await Lesson.aggregate([
              { $match: { module_id: module._id } },
              {
                $project: {
                  videoLinkCount: { $size: "$video_link" },
                  materialsCount: { $size: "$materials" },
                },
              },
              {
                $group: {
                  _id: null,
                  totalCount: { $sum: 1 },
                  totalVideoLinks: { $sum: "$videoLinkCount" },
                  totalMaterials: { $sum: "$materialsCount" },
                },
              },
            ]);

            totalLessons +=
              lessonCounts.length > 0 ? lessonCounts[0].totalCount : 0;
            totalVideos +=
              lessonCounts.length > 0 ? lessonCounts[0].totalVideoLinks : 0;
            totalMaterials +=
              lessonCounts.length > 0 ? lessonCounts[0].totalMaterials : 0;

            const assignCounts = await Assign.countDocuments({
              module_id: module._id,
            });
            totalAssigns += assignCounts;

            const testCounts = await Quiz.countDocuments({
              module_id: module._id,
            });
            totalTests += testCounts;
          })
        );

        // Set the calculated counts to the course object
        course.lesson_counts = totalLessons;
        course.video_counts = totalVideos;
        course.material_counts = totalMaterials;
        course.assign_counts = totalAssigns;
        course.test_counts = totalTests;
      }
    };
    await processCourse(course);
    res.status(200).json(course);
  } catch (error) {
    // console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};

// Update a course by ID
// exports.updateCourseById = async (req, res) => {
//   try {
//     req.body.duration = convertToSeconds(req.body.duration);
//     const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (course) {
//       res.status(200).json(course);
//     } else {
//       res.status(404).json({ message: "Course not found" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a course by ID
// exports.deleteCourseById = async (req, res) => {
//   try {
//     const course = await Course.findByIdAndDelete(req.params.id);
//     if (course) {
//       res.status(200).json({ message: "Course deleted" });
//     } else {
//       res.status(404).json({ message: "Course not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getCourseByIdWithStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the course details
    const course = await Course.findById(id)
      .select(
        "name description price duration level is_active category_id teacher_id mentor_id"
      )
      .populate("category_id", "name id")
      .populate("teacher_id", "name id")
      .populate("mentor_id", "name id")
      .populate("modules", { name: 1, sequence: 1, course_id: -1 });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Count related documents
    const [assignmentsCount, testsCount, lessonsCount, modulesCount] =
      await Promise.all([
        Assignment.countDocuments({ course_id: id }),
        Test.countDocuments({ course_id: id }),
        Lesson.countDocuments({ course_id: id }),
        Module.countDocuments({ course_id: id }),
      ]);

    res.status(200).json({
      course,
      assignmentsCount,
      testsCount,
      lessonsCount,
      modulesCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const { timeFrame } = req.query;

    const now = new Date();

    // 1. Unique students
    const totalStudents = await StudentCourse.distinct(
      "student_id"
    ).countDocuments();
    // console.log(`Total Students: ${totalStudents}`);

    // 2. Number of teachers (using correct query)
    const teacherRole = await Role.findOne({ name: "teacher" });
    const totalTeachers = await User.countDocuments({ role: teacherRole._id });
    // console.log(`Total Teachers: ${totalTeachers}`);

    // 3. Number of mentors
    const mentorRole = await Role.findOne({ name: "mentor" });
    const totalMentors = await User.countDocuments({ role: mentorRole._id });
    // console.log(`Total Mentors: ${totalMentors}`);

    // 4. Total number of courses (active and inactive)
    const totalCourses = await Course.countDocuments();
    // console.log(`Total Courses: ${totalCourses}`);

    const activeCourses = await Course.countDocuments({ is_active: true });
    const inactiveCourses = totalCourses - activeCourses;

    // 5. Total purchased courses
    const totalPurchasedCourses = await StudentCourse.countDocuments();

    // Helper functions for time frames
    const getStartOfDay = () => new Date(now.setHours(0, 0, 0, 0));
    const getStartOfWeek = () => {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;
    };
    const getStartOfMonth = () =>
      new Date(now.getFullYear(), now.getMonth(), 1);
    const getStartOfYear = () => new Date(now.getFullYear(), 0, 1);

    // 6. Total revenue calculation (using a mock calculateRevenue function for now)
    const revenueMatch =
      {
        daily: { createdAt: { $gte: getStartOfDay() } },
        weekly: { createdAt: { $gte: getStartOfWeek() } },
        monthly: { createdAt: { $gte: getStartOfMonth() } },
        yearly: { createdAt: { $gte: getStartOfYear() } },
      }[timeFrame] || {};

    const totalRevenue = await calculateRevenue(revenueMatch);

    // 7. Number of ongoing courses (replace 'is_active' with actual status field)
    const ongoingCourses = await StudentCourse.countDocuments({
      completed: false,
    });

    // Detailed revenue statistics
    const dailyRevenue = await calculateRevenue({
      createdAt: { $gte: getStartOfDay() },
    });
    const weeklyRevenue = await calculateRevenue({
      createdAt: { $gte: getStartOfWeek() },
    });
    const monthlyRevenue = await calculateRevenue({
      createdAt: { $gte: getStartOfMonth() },
    });
    const yearlyRevenue = await calculateRevenue({
      createdAt: { $gte: getStartOfYear() },
    });

    // Send response
    res.status(200).json({
      totalStudents,
      totalTeachers,
      totalMentors,
      totalCourses,
      activeCourses,
      inactiveCourses,
      totalPurchasedCourses,
      totalRevenue,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      ongoingCourses,
    });
  } catch (error) {
    // console.error("Error fetching statistics:", error);
    res.status(500).json({
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

// Mock function for calculating revenue (replace this with actual logic)
async function calculateRevenue(match) {
  const result = await StudentCourse.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "courses", // Ensure "courses" is correct and exists in MongoDB
        localField: "course_id",
        foreignField: "_id",
        as: "courseData",
      },
    },
    { $unwind: "$courseData" }, // Make sure courseData is not empty
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$courseData.price" }, // Check if price exists in courseData
      },
    },
  ]);
  // console.log("Result after lookup and unwind:", result);

  return result[0] ? result[0].totalRevenue : 0;
}

const StudentCourse = require("../models/studentCourse.model");
const mongoose = require("mongoose");

exports.createEnrollment = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    const studentCourse = await StudentCourse.findOne({
      courseId,
      studentId,
    });

    if (studentCourse) {
      res.status(400).json({ message: "already exists" });
    }

    const enrollment = new StudentCourse({
      courseId,
      studentId,
    });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllEnrollments = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const isActive = req.query.isActive;
    const dd = await StudentCourse.find();
    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const studentCourses = await StudentCourse.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course_info",
        },
      },
      {
        $unwind: "$course_info",
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student_info",
        },
      },
      {
        $unwind: "$student_info",
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          studentId: "$student",
          student: {
            id: "$student_info._id",
            phone: "$student_info.phone",
            role: "$student_info.role",
            active: "$student_info.active",
            photo: "$student_info.photo",
          },
          course: {
            id: "$course_info._id",
            name: "$course_info.name",
            price: "$course_info.price",
          },
        },
      },
    ]);

    const total = await StudentCourse.countDocuments(query);
    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: studentCourses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await StudentCourse.findById(req.params.id)
      .populate("courseId")
      .populate("studentId");
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnrollmentsByStudentId = async (req, res) => {
  const { id } = req.params;
  const studentId = new mongoose.Types.ObjectId(id);
  try {
    const enrollments = await StudentCourse.aggregate([
      {
        $match: { studentId: studentId },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course_info",
        },
      },
      {
        $unwind: "$course_info",
      },
     
      {
        $project: {
          _id: 1,
          // teacher: {
          //   _id: "$teacher_info._id",
          //   firstname: "$teacher_info.firstname",
          //   lastname: "$teacher_info.lastname",
          //   photo: "$teacher_info.photo",
          // },
          // user: {
          //   _id: "$user_info._id",
          //   firstname: "$user_info.firstname",
          //   lastname: "$user_info.lastname",
          //   photo: "$user_info.photo",
          // },
          course: {
            _id: "$course_info._id",
            // category_id: "$course_info.category_id",
            name: "$course_info.name",
            // duration: "$course_info.duration",
            // level: "$course_info.level",
            photo: "$course_info.photo",
            // is_active: "$course_info.is_active",
            completed: "$completed",
            progress: "$progress",
          },
        },
      },
    ]);

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCourse = async (req, res) => {
  try {
    // Token orqali olinadigan foydalanuvchi identifikatori
    const id = req.user.id;
    const studentId = new mongoose.Types.ObjectId(id);

    // Ma'lumotlar bazasidan kurslarga yozilgan enrollmentsni olish
    const enrollments = await StudentCourse.aggregate([
      // Foydalanuvchiga tegishli enrollmentsni topish
      {
        $match: { student_id: studentId },
      },
      // Kurslar bilan bog'lash
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course_info",
        },
      },
      {
        $unwind: "$course_info",
      },
      // O'qituvchi bilan bog'lash
      {
        $lookup: {
          from: "users",
          localField: "course_info.teacherId",
          foreignField: "_id",
          as: "teacher_info",
        },
      },
      {
        $unwind: "$teacher_info",
      },
      // Kategoriya bilan bog'lash
      // {
      //   $lookup: {
      //     from: "categories",
      //     localField: "course_info.category_id",
      //     foreignField: "_id",
      //     as: "category_info",
      //   },
      // },
      // {
      //   $unwind: "$category_info",
      // },
      // Kerakli ma'lumotlarni chiqarish
      {
        $project: {
          _id: 1,
          _id: "$course_info._id",
          name: "$course_info.name",
          description: "$course_info.description",
          price: "$course_info.price",
          duration: "$course_info.duration",
          level: "$course_info.level",
          photo: "$course_info.photo",
          is_active: "$course_info.isActive",
          is_top: "$course_info.isTop",

          teacher: {
            _id: "$teacher_info._id",
            firstname: "$teacher_info.firstname",
            lastname: "$teacher_info.lastname",
          },
          completed: "$course_info.completed",
          progress: "$course_info.progress",
        },
      },
    ]);

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnrollmentsByCourseId = async (req, res) => {
  const { id } = req.params;
  const courseId = new mongoose.Types.ObjectId(id);
  try {
    students = await StudentCourse.aggregate([
      {
        $match: { course_id: courseId },
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student_info",
        },
      },
      {
        $unwind: "$student_info",
      },
      {
        $project: {
          _id: 0,
          student: {
            id: "$student_info._id",
            firstname: "$student_info.firstname",
            lastname: "$student_info.lastname",
            phone: "$student_info.phone",
            photo: "$student_info.photo",
          },
          progress: "$progress",
          completed: "$completed",
        },
      },
      // {
      //   $group: {
      //     _id: "$student.id",
      //     student: { $first: "$student" },
      //     enrollments: {
      //       $push: {
      //         progress: "$progress",
      //         completed: "$completed",
      //       },
      //     },
      //   },
      // },
    ]);

    // if (!students || students.length === 0) {
    //   return res.status(404).json({ message: "No students found for this course" });
    // }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEnrollmentById = async (req, res) => {
  try {
    const enrollment = await StudentCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an enrollment by ID
exports.deleteEnrollmentById = async (req, res) => {
  try {
    console.log("test", req.params.id);

    const enrollment = await StudentCourse.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

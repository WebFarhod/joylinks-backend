const StudentCourse = require("../models/studentCourse.model");
const mongoose = require('mongoose');

// Create a new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const enrollment = new StudentCourse(req.body);
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
    const isActive = req.query.is_active; // Optional query parameter to filter by active status

    // Build query object
    let query = {};
    if (isActive !== undefined) {
      query.is_active = isActive === 'true'; // Convert string to boolean
    }

    // Aggregate to get student enrollments with courses
    const studentCourses = await StudentCourse.aggregate([
      {
        $match: query, // Apply the is_active filter if provided
      },
      {
        $lookup: {
          from: "courses",
          localField: "course_id",
          foreignField: "_id",
          as: "course_info",
        },
      },
      {
        $group: {
          _id: "$student_id", // Group by student_id
          student: { $first: "$student_id" }, // Get student_id
          courses: { $push: "$course_info" }, // Collect courses
          count: { $sum: 1 }, // Count courses per student
        },
      },
      {
        $addFields: {
          courses: {
            $reduce: {
              input: "$courses",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          }, // Flatten the courses array
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student_info",
        },
      },
      {
        $unwind: "$student_info"
      },
      {
        $project: {
          _id: 1, // Return the StudentCourse document's _id (optional, for tracking enrollments)
          student_id: "$student", // Only return student_id once
          student: {
            id: "$student_info._id", // Student's actual _id from users collection
            phone: "$student_info.phone",
            role: "$student_info.role",
            active: "$student_info.active",
            photo: "$student_info.photo",
          },
          courses: 1,
          count: 1, // Return the number of courses the student is enrolled in
        },
      },
    ]);

    const total = await StudentCourse.countDocuments(query); // Count with filter
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



// Get an enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await StudentCourse.findById(req.params.id)
      .populate("course_id")
      .populate("student_id");
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
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
        $match: { student_id: studentId }
      },
      {
        $lookup: {
          from: "courses",
          localField: "course_id",
          foreignField: "_id",
          as: "course_info"
        }
      },
      {
        $unwind: "$course_info"
      },
      {
        $lookup: {
          from: "users",
          localField: "course_info.teacher_id",
          foreignField: "_id",
          as: "teacher_info"
        }
      },
      {
        $project: {
          _id: 0,
          course: {
            _id: "$course_info._id",
            category_id: "$course_info.category_id",
            name: "$course_info.name",
            description: "$course_info.description",
            teacher: "$teacher_info",
            price: "$course_info.price",
            duration: "$course_info.duration",
            level: "$course_info.level",
            photo: "$course_info.photo",
            is_active: "$course_info.is_active",
            mentor_id: "$course_info.mentor_id",
            createdAt: "$course_info.createdAt",
            updatedAt: "$course_info.updatedAt"
          },
          progress: "$progress",
          completed: "$completed"
        }
      }  
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
        $match: { course_id: courseId }
      },
      {
        $lookup: {
          from: "users",
          localField: "student_id",
          foreignField: "_id",
          as: "student_info"
        }
      },
      {
        $unwind: "$student_info"
      },
      {
        $project: {
          _id: 0,
          student: {
            id: "$student_info._id",
            name: "$student_info.name",
            phone: "$student_info.phone",
            photo: "$student_info.photo"
          },
          progress: "$progress",
          completed: "$completed"
        }
      },
      {
        $group: {
          _id: "$student.id",
          student: { $first: "$student" },
          enrollments: {
            $push: {
              progress: "$progress",
              completed: "$completed"
            }
          }
        }
      }
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
    const enrollment = await StudentCourse.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

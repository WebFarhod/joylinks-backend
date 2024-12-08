const { Types } = require("mongoose");
const Category = require("../models/category.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Module = require("../models/module.model");
const User = require("../models/user.model");
const BaseError = require("../utils/baseError");
const StudentCourse = require("../models/studentCourse.model");
const CoursePayment = require("../models/coursePayment");
const Progress = require("../models/progress.model");

class CourseService {
  async checkTeacher(teacherId) {
    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacher) {
      throw BaseError.NotFoundError("teacher topilmadi.");
    }
  }

  async checkMentor(teacherId, mentorId, type) {
    let filter = { _id: mentorId, role: "mentor" };
    if (type == "teacher") {
      filter.createBy = teacherId;
    }
    let mentor = await User.findOne(filter);
    if (!mentor) {
      if (type == "teacher") {
        throw BaseError.NotFoundError("O'qituvchi yaratgan mentor topilmadi.");
      } else {
        throw BaseError.NotFoundError("mentor topilmadi.");
      }
    }
  }

  async checkCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw BaseError.NotFoundError("mavjud bo'lmagan category.");
    }
  }

  async create(
    {
      name,
      description,
      price,
      image,
      categoryId,
      isTop,
      teacherId,
      mentorId,
      mentorPercentage,
      supportUntil,
    },
    user
  ) {
    if (user.role === "admin") {
      await this.checkTeacher(teacherId);
      await this.checkMentor(teacherId, mentorId, user.role);
      await this.checkCategory(categoryId);
      const newCourse = new Course({
        name,
        description,
        price: Number(price),
        image: image || null,
        categoryId,
        isTop,
        teacherId,
        mentorId,
        mentorPercentage,
        supportUntil,
      });
      await newCourse.save();
      const coursePayment = new CoursePayment({
        courseId: newCourse._id,
        mentorPercentage,
      });

      await coursePayment.save();
      return { message: "Kurs yaratildi.", data: newCourse };
    } else {
      await this.checkTeacher(user.sub);
      await this.checkMentor(user.sub, mentorId, user.role);
      await this.checkCategory(categoryId);
      const newCourse = new Course({
        name,
        description,
        price,
        image: image || null,
        categoryId,
        teacherId: user.sub,
        mentorId,
        mentorPercentage,
        supportUntil,
      });
      await newCourse.save();
      const coursePayment = new CoursePayment({
        courseId: newCourse._id,
        mentorPercentage,
      });

      await coursePayment.save();
      return { message: "Kurs yaratildi.", data: newCourse };
    }
  }

  async getAll(query, user) {
    const {
      isTop,
      teacherId,
      mentorId,
      categoryId,
      search,
      page = 1,
      limit = 10,
    } = query;

    let match = {};
    if (user) {
      if (user.role == "teacher") {
        match.teacherId = new Types.ObjectId(user.sub);
      }
      if (user.role == "mentor") {
        match.mentorId = new Types.ObjectId(user.sub);
        match.isActive = true;
      }
      if (user.role == "student") {
        match.isActive = true;
      }
      if (user.role == "admin") {
        match = {};
      }
    }
    if (!user) {
      match.isActive = true;
    }
    if (isTop) match.isTop = true;
    if (teacherId) match.teacherId = new Types.ObjectId(teacherId);
    if (mentorId) match.mentorId = new Types.ObjectId(mentorId);
    if (categoryId) match.categoryId = new Types.ObjectId(categoryId);
    if (search) {
      match.name = { $regex: search, $options: "i" };
    }

    console.log("llk", match);

    const courses = await Course.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      // { $unwind: "$category" },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "mentorId",
          foreignField: "_id",
          as: "mentor",
        },
      },
      { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "modules",
          localField: "_id",
          foreignField: "courseId",
          as: "modules",
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "modules._id",
          foreignField: "moduleId",
          as: "lessons",
        },
      },
      {
        $lookup: {
          from: "studentcourses",
          localField: "_id",
          foreignField: "courseId",
          as: "purchases",
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          image: 1,
          isActive: 1,
          isTop: 1,
          category: {
            _id: { $ifNull: ["$category._id", null] },
            name: { $ifNull: ["$category.name", null] },
          },
          teacher: {
            firstname: { $ifNull: ["$teacher.firstname", null] },
            lastname: { $ifNull: ["$teacher.lastname", null] },
            _id: { $ifNull: ["$teacher._id", null] },
          },
          mentor: {
            firstname: { $ifNull: ["$mentor.firstname", null] },
            lastname: { $ifNull: ["$mentor.lastname", null] },
            _id: { $ifNull: ["$mentor._id", null] },
          },
          moduleCounts: { $size: "$modules" },
          lessonCounts: { $size: "$lessons" },
          purchaseCounts: { $size: "$purchases" },
        },
      },
    ]);

    const totalCourses = await Course.countDocuments(match);

    return {
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: parseInt(page),
      courses,
    };
  }

  async get(courseId, user) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw BaseError.BadRequest({ message: "Invalid course ID" });
    }
    const match = { _id: new Types.ObjectId(courseId) };
    console.log("vvb", match);

    if (!user || user.role === "student") {
      match.isActive = true;
    }
    const courseData = await Course.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
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
          localField: "categoryId",
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
        $lookup: {
          from: "users",
          localField: "mentorId",
          foreignField: "_id",
          as: "mentor",
        },
      },
      {
        $unwind: {
          path: "$mentor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "progress",
          localField: "_id",
          foreignField: "courseId",
          as: "progress",
        },
      },
      {
        $unwind: {
          path: "$progress",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
          isActive: 1,
          isTop: 1,

          teacher: {
            _id: "$teacher._id",
            firstname: "$teacher.firstname",
            lastname: "$teacher.lastname",
            photo: "$teacher.photo",
          },
          category: {
            _id: "$category._id",
            name: "$category.name",
          },
          mentor: {
            _id: "$mentor._id",
            firstname: "$mentor.firstname",
            lastname: "$mentor.lastname",
            photo: "$mentor.photo",
          },
          progress: 1,
        },
      },
    ]);

    const course = courseData[0];
    if (!course) {
      return { message: "Course not found" };
    }

    const processCourse = async (course, hasPurchased) => {
      course.purchased = !!hasPurchased;

      const modules = await Module.find({
        courseId: course._id,
        isActive: true,
      });

      course.modules = modules;
      course.moduleCounts = modules.length;

      const totalLessons = await Lesson.countDocuments({
        courseId: course._id,
        isActive: true,
      });

      const totalEnrolledStudents = await StudentCourse.countDocuments({
        course_id: course._id,
      });

      course.lessonCounts = totalLessons || 0;
      course.studentsCounts = totalEnrolledStudents || 0;

      if (modules.length > 0) {
        let totalVideos = 0;
        let totalMaterials = 0;

        await Promise.all(
          modules.map(async (module) => {
            let lessons = await Lesson.find({
              moduleId: module._id,
              isActive: true,
            }).populate("test");

            // if (user) {
            //   const lessonIds = lessons.map((lesson) => lesson._id);
            //   const progressData = await Progress.find({
            //     lessonId: { $in: lessonIds },
            //     userId: user.sub,
            //   });

            //   lessons.forEach((lesson) => {
            //     const progress = progressData.find(
            //       (p) => p.lessonId.toString() === lesson._id.toString()
            //     );
            //     lesson.progress = progress || null;
            //   });
            // }

            if (user) {
              const progressData = await Progress.find({
                lessonId: { $in: lessons.map((l) => l._id) },
                userId: user.sub,
              });
              lessons = lessons.map((lesson) => {
                const progress = progressData.find(
                  (p) => p.lessonId.toString() === lesson._id.toString()
                );
                return { ...lesson.toObject(), progress: progress || null };
              });
            }

            totalVideos += lessons.reduce(
              (sum, lesson) => sum + lesson.video_link.length,
              0
            );
            totalMaterials += lessons.reduce(
              (sum, lesson) => sum + lesson.materials.length,
              0
            );

            if (hasPurchased) {
              module.lessons = lessons;
            }
          })
        );

        course.videoCounts = totalVideos;
        course.materialCounts = totalMaterials;
        // course.modules = modules;
      }
    };
    let hasPurchased = false;
    if (user === null) {
      hasPurchased = false;
      await processCourse(course, hasPurchased);
    } else if (user.role == "student") {
      hasPurchased = await StudentCourse.exists({
        courseId: courseId,
        studentId: user.sub,
      });
      console.log("rt", hasPurchased);
      await processCourse(course, hasPurchased);
    }

    return course;
  }

  async deleteById(id, user) {
    if (!id) {
      throw BaseError.NotFoundError("Id mavjud emas");
    }
    const filter = { _id: id };
    if (user.role !== "admin") {
      filter.teacherId = user.sub;
    }
    const deletedCourse = await Course.findOneAndDelete(filter);
    if (!deletedCourse) {
      throw BaseError.NotFoundError("Kurs topilmadi.");
    }
    await Module.deleteMany({ courseId: id });
    await Lesson.deleteMany({ courseId: id });
    return { message: "Kurs va barcha bog'liq ma'lumotlar o'chirildi." };
  }

  async updateById(
    {
      name,
      description,
      price,
      image,
      isActive,
      isTop,
      categoryId,
      teacherId,
      mentorId,
      // mentorPercentage,
      // supportUntil,
    },
    id,
    user
  ) {
    if (!id) {
      throw BaseError.NotFoundError("Id mavjud emas");
    }
    const filter = { _id: id };
    if (user.role !== "admin") {
      filter.teacherId = user.sub;
    }
    if (user.role === "admin") {
      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price) updateData.price = Number(price);
      if (image) updateData.image = image;
      // if (isActive) updateData.isActive = true || false;
      if (typeof isActive !== "undefined") updateData.isActive = isActive;
      if (isTop) updateData.isTop = true || false;
      if (categoryId) {
        await this.checkCategory(categoryId);
        updateData.categoryId = categoryId;
      }
      if (teacherId) {
        await this.checkTeacher(teacherId);
        updateData.teacherId = teacherId;
      }
      if (mentorId) {
        await this.checkMentor(teacherId, mentorId, user.role);
        updateData.mentorId = mentorId;
      }
      const course = await Course.findOneAndUpdate(filter, updateData, {
        new: true,
      });
      if (!course) {
        throw BaseError.NotFoundError("Course topilmadi.");
      }
      return { message: "Ma'limotlar muvaffaqiyatli yangilandi." };
    } else {
      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price) updateData.price = price;
      if (image) updateData.image = image;
      if (typeof isActive !== "undefined") updateData.isActive = isActive;
      if (categoryId) {
        await this.checkCategory(categoryId);
        updateData.categoryId = categoryId;
      }
      if (mentorId) {
        await this.checkMentor(user.sub, mentorId, user.role);
        updateData.mentorId = mentorId;
      }
      if (Object.keys(updateData).length === 0) {
        throw BaseError.BadRequest(
          "Yangilash uchun hech qanday ma'lumot berilmagan."
        );
      }

      const course = await Course.findOneAndUpdate(filter, updateData, {
        new: true,
      });
      if (!course) {
        throw BaseError.NotFoundError("Course topilmadi.");
      }
      return { message: "Ma'limotlar muvaffaqiyatli yangilandi." };
    }
  }
}

module.exports = new CourseService();

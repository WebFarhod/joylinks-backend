const { Types } = require("mongoose");
const Category = require("../models/category.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Module = require("../models/module.model");
const User = require("../models/user.model");
const BaseError = require("../utils/baseError");
const { ObjectId } = require("mongodb");
const StudentCourse = require("../models/studentCourse.model");

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
      throw BaseError.NotFoundError("mentor topilmadi.");
    }
  }
  async checkCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw BaseError.NotFoundError("mavjud bo'lmagan category.");
    }
  }
  async create(
    { name, description, price, image, categoryId, isTop, teacherId, mentorId },
    user
  ) {
    console.log("df", name);

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
      });
      await newCourse.save();
      return { message: "Kurs yaratildi.", data: newCourse };
    } else {
      await this.checkTeacher(teacherId);
      await this.checkMentor(teacherId, mentorId, user.role);
      await this.checkCategory(categoryId);
      const newCourse = new Course({
        name,
        description,
        price,
        image: image || null,
        categoryId,
        teacherId: user.sub,
        mentorId,
      });
      await newCourse.save();
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

    const match = {};
    if (user) {
      if (user.role == "teacher") {
        match.teacherId = new ObjectId(teacherId);
      }
      if (user.role == "mentor") {
        match.mentorId = new ObjectId(mentorId);
        match.isActive = true;
      }
      if (user.role == "user") {
        match.isActive = true;
      }
    }
    if (!user) {
      match.isActive = true;
    }
    if (isTop) match.isTop = true;
    if (teacherId) match.teacherId = new ObjectId(teacherId);
    if (mentorId) match.mentorId = new ObjectId(mentorId);
    if (categoryId) match.categoryId = new ObjectId(categoryId);
    if (search) {
      match.name = { $regex: search, $options: "i" };
    }

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
      { $unwind: "$category" },
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      {
        $lookup: {
          from: "users",
          localField: "mentorId",
          foreignField: "_id",
          as: "mentor",
        },
      },
      { $unwind: "$mentor" },
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
          is_active: 1,
          is_top: 1,
          category: { name: 1, _id: 1 },
          teacher: { firstname: 1, lastname: 1, _id: 1 },
          mentor: { firstname: 1, lastname: 1, _id: 1 },
          moduleCounts: { $size: "$modules" },
          lessonCounts: { $size: "$lessons" },
          purchaseCounts: { $size: "$purchases" },
        },
      },
    ]);

    return courses;
  }

  async get(courseId, user) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw BaseError.BadRequest({ message: "Invalid course ID" });
    }
    const match = { _id: new Types.ObjectId(courseId) };
    if (!user) {
    } else if (user === "student") {
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
            const lessons = await Lesson.find({
              moduleId: module._id,
              isActive: true,
            });

            totalVideos += lessons.reduce(
              (sum, lesson) => sum + lesson.video_link.length,
              0
            );
            totalMaterials += lessons.reduce(
              (sum, lesson) => sum + lesson.materials.length,
              0
            );

            module.lessons = lessons;
          })
        );

        course.videoCounts = totalVideos;
        course.materialCounts = totalMaterials;
        course.modules = modules;
      }
      // course.moduleCounts = modules.length;

      // const totalModules = await Module.countDocuments({
      //   courseId: course._id,
      // });

      // const totalLessons = await Lesson.countDocuments({
      //   courseId: course._id,
      // });

      // const totalEnrolledStudents = await StudentCourse.countDocuments({
      //   course_id: course._id,
      // });

      // course.moduleCounts = totalModules || 0;
      // course.lessonCounts = totalLessons || 0;
      // course.studentsCounts = totalEnrolledStudents || 0;

      // const modules = await Module.find({ courseId: course._id });
      // if (modules.length > 0) {
      //   // let totalLessons = 0;
      //   let totalVideos = 0;
      //   let totalMaterials = 0;
      //   // let totalTests = 0;
      //   // let totalAssigns = 0;

      //   await Promise.all(
      //     modules.map(async (module) => {
      //       const lessonCounts = await Lesson.aggregate([
      //         { $match: { module_id: module._id } },
      //         {
      //           $project: {
      //             videoLinkCount: { $size: "$video_link" },
      //             materialsCount: { $size: "$materials" },
      //           },
      //         },
      //         {
      //           $group: {
      //             _id: null,
      //             totalCount: { $sum: 1 },
      //             totalVideoLinks: { $sum: "$videoLinkCount" },
      //             totalMaterials: { $sum: "$materialsCount" },
      //           },
      //         },
      //       ]);

      //       // totalLessons +=
      //       //   lessonCounts.length > 0 ? lessonCounts[0].totalCount : 0;
      //       totalVideos +=
      //         lessonCounts.length > 0 ? lessonCounts[0].totalVideoLinks : 0;
      //       totalMaterials +=
      //         lessonCounts.length > 0 ? lessonCounts[0].totalMaterials : 0;

      //       // const assignCounts = await Assign.countDocuments({
      //       //   module_id: module._id,
      //       // });
      //       // totalAssigns += assignCounts;

      //       // const testCounts = await Quiz.countDocuments({
      //       //   module_id: module._id,
      //       // });
      //       // totalTests += testCounts;
      //     })
      //   );
      //   course.videoCounts = totalVideos;
      //   course.materialCounts = totalMaterials;
      //   // course.lesson_counts = totalLessons;
      //   // course.assign_counts = totalAssigns;
      //   // course.test_counts = totalTests;
      // }
    };
    let hasPurchased = false;
    if (user === null) {
      hasPurchased = false;
      await processCourse(course, hasPurchased);
    } else if (user.role == "student") {
      hasPurchased = await StudentCourse.exists({
        courseId: courseId,
        studentId: user.id,
      });
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
      if (isActive) updateData.isActive = true || false;
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

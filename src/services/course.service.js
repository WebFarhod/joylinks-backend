const Category = require("../models/category.model");
const Course = require("../models/course.model");
const Module = require("../models/module.model");
const User = require("../models/user.model");
const BaseError = require("../utils/baseError");
const { ObjectId } = require("mongodb");

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
    if (user.role === "admin") {
      await this.checkTeacher(teacherId);
      await this.checkMentor(teacherId, mentorId, user.role);
      await this.checkCategory(categoryId);
      const newCourse = new Course({
        name,
        description,
        price,
        image: image || null,
        categoryId,
        isTop,
        teacherId,
        mentorId,
      });
      await newCourse.save();
      return { message: "Course yaratildi." };
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
      return { message: "Course yaratildi." };
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
        },
      },
    ]);
    return courses;
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
      if (price) updateData.price = price;
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

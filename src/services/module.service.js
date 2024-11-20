const Course = require("../models/course.model");
const Module = require("../models/module.model");
const BaseError = require("../utils/baseError");

class ModuleService {
  async checkCourse(courseId, user) {
    const filter = {};
    if (courseId) {
      filter._id = courseId;
    }
    if (user.role == "teacher") {
      filter.teacherId = user.sub;
    }
    if (user.role == "mentor") {
      filter.mentorId = user.sub;
    }
    const course = await Course.findOne(filter);
    if (!course) {
      throw BaseError.NotFoundError("ma'lumot topilmadi.");
    }
  }

  async create({ courseId, name }, user) {
    await this.checkCourse(courseId, user);
    const lastItem = await Module.findOne({ courseId }).sort({ sequence: -1 });
    const sequence = lastItem?.sequence ? lastItem.sequence + 1 : 1;

    const module = new Module({
      courseId,
      name,
      sequence,
    });
    await module.save();
    return { message: "Course yaratildi." };
  }

  async getAll({ courseId }, user) {
    await this.checkCourse(courseId, user);
    const match = {};
    const moduleMatch = {};

    if (user.role == "mentor") {
      match.isActive = true;
      moduleMatch.isActive = true;
    }

    if (courseId) {
      match.courseId = courseId;
    }

    const modules = await Module.find(match).populate({
      path: "lessons",
      select: "name sequence video_link materials isActive",
      match: moduleMatch,
    });

    return modules;
  }

  async get(id, user) {
    const module = await Module.findById(id).exec();
    if (!module) {
      throw BaseError.NotFoundError("Modul topilmadi.");
    }

    const course = await Course.findById(module.courseId).exec();
    if (!course) {
      throw BaseError.NotFoundError("Modulga tegishli kurs topilmadi.");
    }

    if (user.role === "teacher" && course.teacherId.toString() !== user.sub) {
      throw BaseError.BadRequest(
        "Siz ushbu modulga kirish huquqiga ega emassiz."
      );
    }

    if (user.role === "mentor" && course.mentorId.toString() !== user.sub) {
      throw BaseError.BadRequest(
        "Siz ushbu modulga kirish huquqiga ega emassiz."
      );
    }

    return module;
  }

  async update(id, { name, isActive }, user) {
    const module = await Module.findById(id).exec();
    if (!module) {
      throw BaseError.NotFoundError("Modul topilmadi.");
    }

    const course = await Course.findById(module.courseId).exec();
    if (!course) {
      throw BaseError.NotFoundError("Modulga tegishli kurs topilmadi.");
    }

    if (user.role === "teacher" && course.teacherId.toString() !== user.sub) {
      throw BaseError.BadRequest(
        "Siz ushbu modulni yangilash huquqiga ega emassiz."
      );
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (typeof isActive !== "undefined") updateData.isActive = isActive;
    if (Object.keys(updateData).length === 0) {
      throw BaseError.BadRequest(
        "Yangilash uchun hech qanday ma'lumot berilmagan."
      );
    }
    const updateModule = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updateModule) {
      throw BaseError.NotFoundError("Module topilmadi.");
    }
    return { message: "Ma'limotlar muvaffaqiyatli yangilandi." };
  }

  async delete(id, user) {
    const module = await Module.findById(id).exec();
    if (!module) {
      throw BaseError.NotFoundError("Modul topilmadi.");
    }

    const course = await Course.findById(module.courseId).exec();
    if (!course) {
      throw BaseError.NotFoundError("Modulga tegishli kurs topilmadi.");
    }

    if (user.role === "teacher" && course.teacherId.toString() !== user.sub) {
      throw BaseError.BadRequest(
        "Siz ushbu modulni o'chirish huquqiga ega emassiz."
      );
    }
    const deleteModule = await Course.findByIdAndDelete(id);
    if (!deleteModule) {
      throw BaseError.NotFoundError("Modulni o'chirishda xatolik yuz berdi.");
    }
    await Lesson.deleteMany({ moduleId: id });
    return { message: "Module va barcha bog'liq ma'lumotlar o'chirildi." };
  }
}

module.exports = new ModuleService();

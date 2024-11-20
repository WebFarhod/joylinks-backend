const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Module = require("../models/module.model");

class LessonService {
  async checkCourse(moduleId, user) {
    const module = await Module.findById(moduleId);
    if (!module) {
      throw BaseError.NotFoundError("module topilmadi.");
    }
    const filter = {};
    if (module.courseId) {
      filter._id = module.courseId;
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
    return course._id;
  }

  async create({ name, video_link = [], materials = [], moduleId }, user) {
    const courseId = await this.checkCourse(moduleId, user);
    if (!Array.isArray(video_link)) {
      throw BaseError.BadRequest("Video link massiv bo'lishi kerak.");
    }
    if (!Array.isArray(materials)) {
      throw BaseError.BadRequest("Materiallar massiv bo'lishi kerak.");
    }

    const lastItem = await Lesson.findOne({ moduleId }).sort({ sequence: -1 });
    const sequence = lastItem?.sequence ? lastItem.sequence + 1 : 1;
    const lesson = new Lesson({
      name,
      sequence,
      video_link,
      materials,
      moduleId,
      courseId,
    });
    await lesson.save();
    return { message: "Dars muvaffaqiyatli yaratildi." };
  }

  async getAll({ moduleId }, user) {
    await this.checkCourse(moduleId, user);
    const match = {};

    if (user.role == "mentor") {
      match.isActive = true;
    }

    if (moduleId) {
      match.moduleId = moduleId;
    }
    const lessons = await Lesson.find(match).exec();
    return lessons;
  }

  async get(id, user) {
    const mlesson = await Lesson.findById(id);
    if (!mlesson) {
      throw BaseError.NotFoundError("Dars topilmadi.");
    }

    await this.checkCourse(mlesson.moduleId, user);

    const match = { _id: id };
    if (user.role === "mentor") {
      match.isActive = true;
    }

    const lesson = await Lesson.findOne(match).exec();
    if (!lesson) {
      throw BaseError.NotFoundError("Dars topilmadi yoki ruxsat berilmagan.");
    }

    return lesson;
  }

  async update(id, { name, video_link = [], materials = [], isActive }, user) {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw BaseError.NotFoundError("Dars topilmadi.");
    }
    await this.checkCourse(lesson.moduleId, user);
    if (!Array.isArray(video_link)) {
      throw BaseError.BadRequest("Video link massiv bo'lishi kerak.");
    }
    if (!Array.isArray(materials)) {
      throw BaseError.BadRequest("Materiallar massiv bo'lishi kerak.");
    }

    lesson.name = name || lesson.name;
    lesson.video_link = video_link;
    lesson.materials = materials;
    if (isActive !== undefined) {
        lesson.isActive = isActive;
      }u
    await lesson.save();

    return { message: "Dars muvaffaqiyatli yangilandi." };
  }

  async delete(id, user) {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw BaseError.NotFoundError("Dars topilmadi.");
    }

    await this.checkCourse(lesson.moduleId, user);

    await Lesson.findByIdAndDelete(id);

    return { message: "Dars muvaffaqiyatli o'chirildi." };
  }
}
module.exports = new LessonService();

const mongoose = require("mongoose");
const BaseError = require("../utils/baseError");
const Lesson = require("../models/lesson.model");
const Test = require("../models/test.model");
const Progress = require("../models/progress.model");

class TestService {
  async checkLesson(lessonId) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw BaseError.NotFoundError("Mavjud bo'lmagan dars");
    }

    return lesson;
  }

  async checkQuestions(data) {
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw BaseError.NotFoundError("Savollar majburiy.");
    } else {
      data.questions.forEach((question) => {
        if (!question.question || typeof question.question !== "string") {
          throw BaseError.NotFoundError(
            "Savol matni majburiy va matn bo'lishi kerak."
          );
        }
        if (!Array.isArray(question.options) || question.options.length == 2) {
          throw BaseError.NotFoundError(
            "Savol 4 ta variantga ega bo'lishi kerak."
          );
        }
        if (
          !question.correctAnswer ||
          !question.options.includes(question.correctAnswer)
        ) {
          throw BaseError.NotFoundError(
            "To'g'ri javob variantlardan biri bo'lishi kerak."
          );
        }
      });
    }
  }

  async create(data) {
    const { lessonId, questions } = data;
    const lesson = await this.checkLesson(lessonId);
    const test = await Test.findOne({ lessonId: lesson });
    if (test) {
      throw BaseError.NotFoundError("Dars uchun test mavjud");
    }
    await this.checkQuestions(data);

    const newTest = new Test({
      lessonId,
      questions,
    });

    await newTest.save();

    return { message: "Test muvaffaqiyatli yaratildi", test: newTest };
  }

  async checkTest(data, user) {
    const { lessonId, answers } = data;
    const test = await Test.findOne({ lessonId }).lean();
    if (!test) {
      throw BaseError.NotFoundError("Dars uchun test topilmadi");
    }
    if (!Array.isArray(answers) || answers.length !== test.questions.length) {
      throw BaseError.BadRequest(
        "Javoblar soni testdagi savollar soniga teng bo'lishi kerak"
      );
    }
    let correctCount = 0;

    test.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });
    const totalQuestions = test.questions.length;
    // const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const isTestPassed = totalQuestions === correctCount; // 70% va undan yuqori natija muvaffaqiyatli deb qabul qilinadi.
    // const isTestPassed = scorePercentage >= 70; // 70% va undan yuqori natija muvaffaqiyatli deb qabul qilinadi.

    // 6. Progresni yangilash yoki yaratish
    const progress = await Progress.findOneAndUpdate(
      { userId: user._id, lessonId },
      {
        userId: user._id,
        lessonId,
        isLessonCompleted: isTestPassed, // Agar test muvaffaqiyatli o'tgan bo'lsa, dars ham tugatilgan deb hisoblanadi
        isTestPassed,
      },
      { upsert: true, new: true }
    );

    return {
      message: isTestPassed
        ? "Tabriklaymiz! Testni muvaffaqiyatli topshirdingiz."
        : "Afsuski, testdan o'tolmadingiz. Qayta urinib ko'ring.",
      // totalQuestions,
      // correctAnswers: correctCount,
      // scorePercentage,
      // progress,
    };
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
        match.teacherId = new ObjectId(teacherId);
      }
      if (user.role == "mentor") {
        match.mentorId = new ObjectId(mentorId);
        match.isActive = true;
      }
      if (user.role == "user") {
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
    if (teacherId) match.teacherId = new ObjectId(teacherId);
    if (mentorId) match.mentorId = new ObjectId(mentorId);
    if (categoryId) match.categoryId = new ObjectId(categoryId);
    if (search) {
      match.name = { $regex: search, $options: "i" };
    }

    // const courses = await Course.aggregate([
    //   { $match: match },
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "categoryId",
    //       foreignField: "_id",
    //       as: "category",
    //     },
    //   },
    //   { $unwind: "$category" },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "teacherId",
    //       foreignField: "_id",
    //       as: "teacher",
    //     },
    //   },
    //   { $unwind: "$teacher" },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "mentorId",
    //       foreignField: "_id",
    //       as: "mentor",
    //     },
    //   },
    //   { $unwind: "$mentor" },
    //   {
    //     $lookup: {
    //       from: "modules",
    //       localField: "_id",
    //       foreignField: "courseId",
    //       as: "modules",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "lessons",
    //       localField: "modules._id",
    //       foreignField: "moduleId",
    //       as: "lessons",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "studentcourses",
    //       localField: "_id",
    //       foreignField: "courseId",
    //       as: "purchases",
    //     },
    //   },
    //   { $skip: (page - 1) * limit },
    //   { $limit: parseInt(limit) },
    //   {
    //     $project: {
    //       name: 1,
    //       description: 1,
    //       price: 1,
    //       image: 1,
    //       isActive: 1,
    //       isTop: 1,
    //       category: { name: 1, _id: 1 },
    //       teacher: { firstname: 1, lastname: 1, _id: 1 },
    //       mentor: { firstname: 1, lastname: 1, _id: 1 },
    //       moduleCounts: { $size: "$modules" },
    //       lessonCounts: { $size: "$lessons" },
    //       purchaseCounts: { $size: "$purchases" },
    //     },
    //   },
    // ]);

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
          category: { name: 1, _id: 1 },
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

    return courses;
  }

  async getById(id) {
    const test = await Test.findById(id);
    return test;
  }

  async getTestByLessonId(lessonId) {
    const test = await Test.findOne({ lessonId });
    return test;
  }

  async update(data) {
    const { lessonId, questions } = data;
    const lesson = await this.checkLesson(lessonId);
    const test = await Test.findOne({ lessonId: lesson });
    if (!test) {
      throw BaseError.NotFoundError("Dars uchun test mavjud emas");
    }
    await this.checkQuestions(data);

    test.questions = questions;

    await test.save();

    return { message: "Test muvaffaqiyatli yangilandi", test: test };
  }

  async delete(id) {
    const test = await Test.findByIdAndDelete(id);
    if (!test) {
      throw BaseError.NotFoundError("test mavjud emas");
    }
    return { message: "Test muvaffaqiyatli o'chirildi" };
  }
}

module.exports = new TestService();

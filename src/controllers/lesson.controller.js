const Lesson = require("../models/lesson.model");
const mongoose = require("mongoose");
const lessonService = require("../services/lesson.service");

class LessonController {
  async createLesson(req, res, next) {
    try {
      const { moduleId, name } = req.body;
      const user = req.user;
      if (!moduleId || !name) {
        return res
          .status(400)
          .json({ error: "Talab qilinga malumotlar mavjud emas" });
      }
      const data = await lessonService.create(res.body, user);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getLessons(req, res, next) {
    try {
      const data = await lessonService.getAll(req.query, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getLessonById(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "ID mavjud emas" });
      }
      const data = await lessonService.get(id, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateLessonById(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Id mavjud emas" });
      }
      const data = await lessonService.update(
        req.params.id,
        req.body,
        req.user
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteLessonById(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "ID mavjud emas" });
      }
      const data = await moduleService.delete(req.params.id, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new LessonController();
// const createLesson = async (req, res) => {
//   try {
//     console.log(req.body, "____bodududu");

//     // Find the last lesson in the module by sorting on the sequence number
//     const lastItem = await Lesson.findOne({ module_id: req.body.module_id })
//       .sort({ sequence: -1 })
//       .select("sequence");

//     // If there's no lesson yet, sequence starts at 1; otherwise, increment
//     req.body.sequence = lastItem?.sequence ? lastItem.sequence + 1 : 1;

//     // Check if test information is provided in the request body and validate
//     if (req.body.test) {
//       const { questions, pass_score } = req.body.test;
//       if (!questions || questions.length === 0) {
//         return res
//           .status(400)
//           .json({ error: "Test must have at least one question." });
//       }

//       // Validate each question (at least one option and a correct answer required)
//       for (let question of questions) {
//         if (
//           !question.question ||
//           !question.options ||
//           question.options.length < 2
//         ) {
//           return res
//             .status(400)
//             .json({ error: "Each question must have at least two options." });
//         }
//         if (!question.correct_answer) {
//           return res
//             .status(400)
//             .json({ error: "Each question must have a correct answer." });
//         }
//       }

//       // Ensure pass score is provided and valid
//       if (!pass_score || pass_score < 0 || pass_score > 100) {
//         return res
//           .status(400)
//           .json({ error: "Pass score must be between 0 and 100." });
//       }
//     }

//     // Create and save the new lesson
//     const lesson = new Lesson(req.body);
//     await lesson.save();

//     res.status(201).json(lesson);
//   } catch (error) {
//     // Handle any errors and respond with a 400 status
//     res.status(400).json({ error: error.message });
//   }
// };

// const getLessons = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, module } = req.query;
//     const pageInt = parseInt(page);
//     const limitInt = parseInt(limit);

//     // Create the pipeline for aggregation
//     const pipeline = [];

//     // Add filter by module if specified
//     if (module) {
//       pipeline.push({
//         $match: {
//           module_id: new mongoose.Types.ObjectId(module),
//         },
//       });
//     }

//     // Add pagination stages
//     pipeline.push(
//       {
//         $skip: (pageInt - 1) * limitInt,
//       },
//       {
//         $limit: limitInt,
//       }
//     );

//     // Add projection stage to include only necessary fields
//     pipeline.push({
//       $project: {
//         name: 1,
//         sequence: 1,
//         video_link: 1,
//         materials: 1,
//         module_id: 1,
//         is_active: 1,
//         test: 1,
//       },
//     });

//     // Perform the aggregation
//     const lessons = await Lesson.aggregate(pipeline);

//     // Count total lessons (with or without filtering by module)
//     const totalLessons = await Lesson.countDocuments(
//       module ? { module_id: module } : {}
//     );

//     res.status(200).json({
//       total: totalLessons,
//       page: pageInt,
//       limit: limitInt,
//       data: lessons,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// Get a lesson by ID
// const getLessonById = async (req, res) => {
//   try {
//     const lesson = await Lesson.findById(req.params.id);
//     if (!lesson) return res.status(404).json({ message: "Lesson not found" });
//     res.status(200).json(lesson);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Update a lesson by ID
const updateLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a lesson by ID
const deleteLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// module.exports = {
//   createLesson,
//   getLessons,
//   getLessonById,
//   updateLessonById,
//   deleteLessonById,
// };

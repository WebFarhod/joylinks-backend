const Module = require("../models/module.model");
const Lesson = require("../models/lesson.model");
const moduleService = require("../services/module.service");

class ModuleController {
  async createModule(req, res, next) {
    try {
      const { courseId, name } = req.body;
      const user = req.user;
      if (!courseId || !name) {
        return res
          .status(400)
          .json({ error: "Talab qilinga malumotlar mavjud emas" });
      }
      const data = await moduleService.create(req.body, user);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getModules(req, res, next) {
    try {
      const data = await moduleService.getAll(req.query, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getModuleById(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "ID mavjud emas" });
      }
      const data = await moduleService.get(id, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateModuleById(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Id mavjud emas" });
      }
      const data = await moduleService.update(
        req.params.id,
        req.body,
        req.user
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteModuleById(req, res, next) {
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
module.exports = new ModuleController();

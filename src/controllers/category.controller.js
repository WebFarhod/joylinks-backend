const categoryService = require("../services/category.service");

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const { name, isActive } = req.body;
      if (!name) {
        res.status(400).json({ error: "Talab qilinga malumotlar mavjud emas" });
      }
      const data = await categoryService.create(name, isActive);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const user = req.user;
      const data = await categoryService.getAll(user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const user = req.user;
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "id mavjud emas." });
      }
      const data = await categoryService.get(user, id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const categoryData = req.body;
      if (!categoryData) {
        return res.status(200).json({
          message: "Yangilash uchun hech qanday ma'lumot berilmagan.",
        });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "id mavjud emas." });
      }
      const data = await categoryService.update(id, categoryData);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "id mavjud emas." });
      }
      const data = await categoryService.delete(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new CategoryController();

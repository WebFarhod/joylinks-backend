const { default: mongoose } = require("mongoose");
const BaseError = require("../utils/baseError");
const Category = require("../models/category.model");

class CategoryService {
  async create(name, isActive) {
    const newCategory = new Category({
      name,
      isActive: isActive || false,
    });
    await newCategory.save();
    return { message: "Catedoriya yaratildi." };
  }

  async getAll(user) {
    let filter = {};
    if (user && user.role === "admin") {
      filter = {};
    } else {
      filter.isActive = true;
    }
    const categories = await Category.aggregate([
      { $match: filter },
      {
        $project: {
          _id: 1,
          name: 1,
          isActive: 1,
        },
      },
    ]);
    return categories;
  }

  async get(user, id) {
    let filter = { _id: new mongoose.Types.ObjectId(id) };
    if (!(user && user.role === "admin")) {
      filter.isActive = true;
    }
    const categories = await Category.aggregate([
      { $match: filter },
      {
        $project: {
          _id: 1,
          name: 1,
          isActive: 1,
        },
      },
    ]);
    return categories.length > 0 ? categories[0] : null;
  }

  async update(id, categoryData) {
    const updateData = {};
    if (categoryData.name) updateData.name = categoryData.name;
    if (typeof categoryData.isActive !== "undefined")
      updateData.isActive = categoryData.isActive;

    if (Object.keys(updateData).length === 0) {
      throw BaseError.BadRequest(
        "Yangilash uchun hech qanday ma'lumot berilmagan."
      );
    }
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!category) {
      throw BaseError.NotFoundError("Category topilmadi.");
    }
    return {
      message: "Category muvaffaqiyatli yangilandi.",
    };
  }

  async delete(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw BaseError.BadRequest("Category topilmadi.");
    }
    return { message: "Category o'chirildi" };
  }
}

module.exports = new CategoryService();

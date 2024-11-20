const { default: mongoose } = require("mongoose");
const BaseError = require("../utils/baseError");
const Category = require("../models/category.model");

class CategoryService {
  async create(name, isActive) {
    const newCategory = new Category({
      name,
      isActive: !!isActive,
    });
    await newCategory.save();
    return { message: "Bo'lim yaratildi." };
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
    if (!id) {
      throw BaseError.BadRequest("ID ko'rsatilishi shart.");
    }
    const updateData = {};
    if (categoryData.name) {
      if (typeof categoryData.name !== "string" || !categoryData.name.trim()) {
        throw BaseError.BadRequest("Bo'lim nomi noto'g'ri formatda.");
      }
      updateData.name = categoryData.name.trim();
    }

    if (typeof categoryData.isActive !== "undefined") {
      if (typeof categoryData.isActive !== "boolean") {
        throw BaseError.BadRequest(
          "isActive qiymati true yoki false bo'lishi kerak."
        );
      }
      updateData.isActive = categoryData.isActive;
    }

    if (Object.keys(updateData).length === 0) {
      throw BaseError.BadRequest(
        "Yangilash uchun hech qanday ma'lumot berilmagan."
      );
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw BaseError.NotFoundError("Kategoriya topilmadi.");
    }

    return {
      message: "Bo'lim muvaffaqiyatli yangilandi.",
      category,
    };
  }

  async delete(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw BaseError.BadRequest("Bo'lim topilmadi.");
    }
    return { message: "Bo'lim o'chirildi" };
  }
}

module.exports = new CategoryService();

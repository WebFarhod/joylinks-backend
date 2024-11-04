const Category = require("../models/category.model");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    let filter = {}
    const { page = 1, limit = 10, is_active } = req.query;
    const skip = (page - 1) * limit;

    if (is_active) {
      filter["is_active"] = true
    }
    const categories = await Category.aggregate([
      { $match: filter },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "category_id",
          as: "courses",
        },
      },
      { $sort: { name: 1 } }, // Optional: sort by category name in ascending order
    ]);

    const total = await Category.countDocuments();

    res.status(200).json({
      total,
      currentPage: +page,
      totalPages: Math.ceil(total / limit),
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

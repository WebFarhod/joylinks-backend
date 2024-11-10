const Module = require("../models/module.model");
const Lesson = require("../models/lesson.model");
// Create a new module
const createModule = async (req, res) => {
  try {
    const lastItem = await Module.findOne({ course_id: req.body.course_id });

    if (!lastItem?.sequence) {
      req.body.sequence = 1;
    } else {
      req.body.sequence = lastItem.sequence + 1;
    }

    const module = new Module(req.body);
    await module.save();
    res.status(201).json(module);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getModules = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const courseId = req.query.courseId; // Get courseId from query parameters

    // Create the base match condition
    const matchCondition = { is_active: true };

    // If courseId is provided, add it to the match condition
    if (courseId) {
      matchCondition.course_id = courseId;
    }

    // Find modules with courseId and is_active condition, and paginate
    const modules = await Module.find(matchCondition)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "lessons",
        select: "name sequence video_link materials is_active", // Select fields you want
        match: { is_active: true }, // Only include active lessons
      });

    console.log("Modules:", modules);

    // Calculate total number of modules based on the same match condition
    const totalModules = await Module.countDocuments(matchCondition);

    res.status(200).json({
      totalPages: Math.ceil(totalModules / limit),
      currentPage: page,
      totalModules,
      modules,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get a module by ID
const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate({
      path: "lessons",
      select: "name sequence video_link materials is_active", // Select fields you want
      match: { is_active: true }, // Only include active lessons
    });
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a module by ID
const updateModuleById = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.status(200).json(module);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a module by ID
const deleteModuleById = async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.status(200).json({ message: "Module deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createModule,
  getModules,
  getModuleById,
  updateModuleById,
  deleteModuleById,
};

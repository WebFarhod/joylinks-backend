const Assign = require("../models/assign.model");

exports.createAssign = async (req, res) => {
  try {
    const { module_id, teacher_id, fileUrl, name, description, mark, dueTime } =
      req.body;

    if (
      !module_id ||
      !teacher_id ||
      !name ||
      !description ||
      !mark ||
      !dueTime
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const assign = new Assign({
      module_id,
      teacher_id,
      name,
      description,
      fileUrl,
      mark,
      dueTime,
    });

    await assign.save();
    return res.status(201).json(assign);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllAssigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit; 

    const { module_id, teacher_id, lesson_id } = req.query; 

    const filters = {};
    if (module_id) filters.module_id = module_id;
    if (teacher_id) filters.teacher_id = teacher_id;
    if (lesson_id) filters.lesson_id = lesson_id; 

    const assigns = await Assign.aggregate([
      { $match: filters }, 
      {
        $lookup: {
          from: "modules", 
          localField: "module_id", 
          foreignField: "_id", 
          as: "module", 
        },
      },
      {
        $lookup: {
          from: "users", 
          localField: "teacher_id",
          foreignField: "_id", 
          as: "teacher",
        },
      },
      {
        $unwind: {
          path: "$module",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$teacher",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          mark: 1,
          fileUrl: 1,
          dueTime: 1,
          is_active: 1,
          createdAt: 1,
          updatedAt: 1,
          module: 1, 
          teacher: 1,
        },
      },
      {
        $skip: skip, 
      },
      {
        $limit: limit,
      },
    ]);

   
    const total = await Assign.countDocuments();

    if (assigns.length === 0) {
      return res.status(404).json({ message: "No assignments found" });
    }

    res.status(200).json({
      assigns,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Error fetching assignments", error });
  }
};



exports.getAssignById = async (req, res) => {
  try {
    const assign = await Assign.findById(req.params.id)
      .populate("module_id")
      .populate("teacher_id");

    if (!assign) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.status(200).json(assign);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateAssignById = async (req, res) => {
  try {
    const assign = await Assign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!assign) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.status(200).json(assign);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteAssignById = async (req, res) => {
  try {
    const assign = await Assign.findByIdAndDelete(req.params.id);

    if (!assign) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
